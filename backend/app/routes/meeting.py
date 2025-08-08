from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import FullProcessResponse, FactInferenceResponse, FactInferenceRequest, EmotionRequest, EmotionResponse, SummaryCreate, SummaryOut, SummarizeRequest, ActionItemRequest, ActionItemResponse
from app.crud import create_summary
import shutil
import os
import json
from app.config import settings
from app.services.whisper_handler import transcribe_audio
from app.services.summary_handler import summarize_text, summarize_fact_inference
from app.services.action_item_handler import extract_action_items
from app.services.emotion_handler import analyze_emotion
from datetime import datetime
from app import models

UPLOAD_DIR = settings.UPLOAD_DIR

router = APIRouter(prefix="/meetings", tags=["meetings"])

@router.get("/")
def get_all_meetings():
    return {"message": "会議一覧をここに返します（仮）"}

@router.post("/upload")
async def upload_audio_file(file: UploadFile = File(...)):
    # 拡張子チェック
    if not file.filename.endswith((".mp3", ".wav", ".mp4", ".m4a")):
        raise HTTPException(status_code=400, detail="対応していないファイル形式です。")
    
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": filename, "message": "アップロードに成功しました"}

@router.post("/transcribe")
def transcribe_uploaded_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        result = transcribe_audio(file_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="指定されたファイルが存在しません")
    
    # 一時的にテキスト保存
    txt_filename = filename.rsplit(".", 1)[0] + "_transcript.txt"
    txt_path = os.path.join(UPLOAD_DIR, txt_filename)
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(result["text"])

    return {
        "message": "文字起こしが完了しました",
        "transcript_file": txt_filename,
        "text": result["text"][:300] + "..."
    }

@router.post("/summarize")
def summarize(request: SummarizeRequest):
    result = summarize_text(request.text)
    return {"summary": result}

@router.post("/upload-and-summarize", response_model=SummaryOut)
async def upload_and_summarize(file: UploadFile = File(...), db: Session = Depends(get_db)):

    # タイムスタンプを追加
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    unique_filename = f"{timestamp}_{file.filename}"

    # ファイルを保存
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # 音声→ 文字起こし
    transcription = transcribe_audio(file_path)

    # テキスト → 要約
    summary = summarize_text(transcription)

    summary_data = SummaryCreate(
        filename=file.filename,
        transcription=transcription,
        summary=summary
    )
    return create_summary(db, summary_data)

@router.get("/history")
def get_meeting_history(db: Session = Depends(get_db)):
    summaries = db.query(models.Summary).all()
    return [
    {
        "id": s.id,
        "filename": s.filename,
        "transcription": s.transcription,
        "summary": s.summary,
        "created_at": s.created_at
    }
    for s in summaries
    ]

# アップロードしたファイルの削除機能
@router.delete("/delete/{summary_id}")
def delete_summary(summary_id: int, db: Session = Depends(get_db)):
    # DBから該当するMeetingレコードを取得
    summary = db.query(models.Summary).filter(models.Summary.id == summary_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="該当するレコードが存在しません。")
    
    # ファイル削除
    file_path = os.path.join(UPLOAD_DIR, summary.filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    # DBレコード削除
    db.delete(summary)
    db.commit()

    return { "message": f"{summary.filename} を削除しました"}

@router.post("/extract-actions", response_model=ActionItemResponse)
def extract_actions(request: ActionItemRequest):
    raw_json_text = extract_action_items(request.text)

    try:
        actions = json.loads(raw_json_text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AIからのJSONレスポンスの解析に失敗しました")
    
    # dict の場合はリストにする
    if isinstance(actions, dict):
        actions = [actions]

    # None の場合は空リスト
    if actions is None:
        actions = []
    
    # None を空文字に変換
    for action in actions:
        for key in ["person", "action", "deadline"]:
            if action.get(key) is None:
                action[key] = ""

    return {"actions": actions}

@router.post("/analyze-emotion", response_model=EmotionResponse)
def analyze_emotion_route(request: EmotionRequest):
    try:
        # 空文字の場合はダミーテキストを使う
        if not request.text.strip():
            print("★★ 空文字を受け取りました。ダミーテキストで代用します。")
            dummy_text = """
田中：今回のプロジェクトの進捗状況について報告します。
山田：了解しました。遅れているメンバーには改善を促すように連絡を取ってもらえますか？
田中：了解しました。
"""
            result = analyze_emotion(dummy_text)
        else:
            print("★★ 正常なテキストを受け取りました。分析を開始します。")
            print("★ 送信テキスト:", request.text)
            result = analyze_emotion(request.text)

        return {"analysis": result}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"感情分析中にエラーが発生しました: {str(e)}")
    
@router.post("/fact-inference", response_model=FactInferenceResponse)
def fact_inference_route(request: FactInferenceRequest):
    result = summarize_fact_inference(request.text)
    return result

@router.post("/full-process", response_model=FullProcessResponse)
async def full_process(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    
    # ファイルを保存
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    unique_filename = f"{timestamp}_{file.filename}"

    upload_dir = "app/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, unique_filename)

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

        # 文字起こし
        transcription = transcribe_audio(file_path)

        # 要約
        summary = summarize_text(transcription)

        # 感情分析
        emotion = analyze_emotion(transcription)

        # アクションアイテム抽出
        action_items_json = extract_action_items(transcription)

        # JSONバース
        try:
            actions = json.loads(action_items_json)
        except json.JSONDecodeError:
            actions = []

        if isinstance(actions, dict):
            actions = [actions]
        if actions is None:
            actions = []

        # Noneを空文字に変換
        for item in actions:
            for key in ["person", "action", "deadline"]:
                if item.get(key) is None:
                    item[key] =""

        #ファクト＆推測抽出
        fact_inference_json = summarize_fact_inference(transcription)
        if isinstance(fact_inference_json, str):
            factinf = json.loads(fact_inference_json)
        else:
            factinf = fact_inference_json

        facts = factinf.get("facts", [])
        inferences = factinf.get("inferences", [])

        # DB保存
        summary_data = SummaryCreate(
            filename=file.filename,
            transcription=transcription,
            summary=summary,
        )
        db_summary = create_summary(db, summary_data)

        return {
            "id": db_summary.id,
            "filename": db_summary.filename,
            "transcription": db_summary.transcription,
            "summary": db_summary.summary,
            "created_at": db_summary.created_at.isoformat()
            if isinstance(db_summary.created_at, datetime)
            else str(db_summary.created_at),
            "emotion_analysis": emotion,
            "action_items": actions,
            "fact_inference": {
                "facts": facts,
                "inferences": inferences
            }
        }