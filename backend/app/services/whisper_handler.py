import whisper  # type: ignore
import os

model = whisper.load_model("base") # "small"や"medium"に変更可能

def transcribe_audio(file_path: str) -> dict:
    if not os.path.exists(file_path):
        raise FileNotFoundError("音声ファイルが存在しません")
    
    result = model.transcribe(file_path, language="ja") # CPU対応
    return result["text"] # {"text": "文字起こし結果", ...}