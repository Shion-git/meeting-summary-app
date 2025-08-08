from openai import OpenAI # type: ignore
from app.config import settings
print(settings.OPENAI_API_KEY)

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def analyze_emotion(transcript_text: str) -> str:
    prompt = f"""
あなたは日本語の感情分析アシスタントです。
以下の議事録テキストを分析し、次の情報を日本語で箇条書きで出力してください。

- 会議全体のトーン（例：ポジティブ／ネガティブ／ニュートラル）
- ネガティブ発言の多さ（例：多い／少ない／ほとんどない）
- トーン概要（簡単な説明）

以下が議事録テキストです：
「{transcript_text}」
"""
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "あなたは日本語の感情分析アシスタントです。"},
            {"role": "user", "content": prompt}
        ],
        max_tokens=800,
        temperature=0.2
    )

    result_text = response.choices[0].message.content
    print("★ 感情分析の結果:", result_text)
    return result_text