from openai import OpenAI # type: ignore
from app.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def extract_action_items(text: str) -> str:
    prompt = f"""
あなたは日本語の会議アシスタントです。
以下の議事録テキストから、必ずアクションアイテムを抽出してください。

もしアクションアイテムが直接的に書かれていなくとも、文章の中から
・やるべきタスク
・対応すべきこと
・次回までに必要な行動
などを推測して抽出してください。

出力は必ず JSON 配列で出してください。

【重要】以下のルールを厳守してください：
- deadline の値は存在しない場合は null にしてください。
- deadline に文字列で "null" と書かないでください。文字列で「null」と返すことは禁止です。
- JSON の値はすべてダブルクォーテーションで囲んでください。ただし null は値としてそのまま記載してください。

出力フォーマット例：
[
    {{
        "person": "田中",
        "action": "遅れているメンバーへの改善を促す連絡を取る",
        "deadline": null
    }},
    {{
        "person": "田中",
        "action": "新たな課題のアクションプランを次回までにまとめる",
        "deadline": null
    }}
]

以下が議事録テキストです：
「{text}」
"""
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "あなたは日本語の会議アシスタントです。"},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1500,
        temperature=0.3
    )

    result_text = response.choices[0].message.content
    print("★ AIの返答:", result_text)
    
    return result_text