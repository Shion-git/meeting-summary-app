from openai import OpenAI # type: ignore
from app.config import settings
import json

# OpenAIクライアントを初期化（APIキーは.envから読み取られる）
client = OpenAI(api_key=settings.OPENAI_API_KEY)

def summarize_text(text: str) -> str:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "あなたは日本語の議事録要約アシスタントです。以下の文字起こしテキストを、分かりやすく日本語で要約してください。"
            },
            {
                "role": "user",
                "content": f"以下の文字起こしを簡潔に要約してください:\n\n{text}"
            }
        ],
        max_tokens=800,
        temperature=0.5
    )

    return response.choices[0].message.content

def summarize_fact_inference(transcript_text: str) -> dict:
    prompt = f"""
あなたは日本語の会議要約アシスタントです。
以下の議事録テキストを読み、以下の2つを分けて出力してください。

【出力フォーマット】
{{
    "facts": [
        "ここにファクト1",
        "ここにファクト2"
    ],
    "inferences": [
        "ここにAIの推測・解釈1",
        "ここにAIの推測・解釈2"
    ]
}}

【ルール】
- ファクトには、会議で実際に話された内容のみを短くまとめて記載してください。
- AI の解釈や提案は「推測」に入れてください。
- JSON 形式で出力してください。
- JSON のキー名は "facts" と "inferences" にしてください。

以下が議事録テキストです：
「{transcript_text}」
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "あなたは日本語の会議要約のアシスタントです。"},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000,
        temperature=0.3,
    )

    result_text = response.choices[0].message.content
    print("★ ファクト＆推測結果:", result_text)

    try:
        result_json = json.loads(result_text)
        return result_json
    except json.JSONDecodeError:
        result_json = {
            "facts": [],
            "inference": [result_text]
        }