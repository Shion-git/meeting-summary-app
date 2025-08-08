# Meeting Summary App

会議の音声をアップロードすると、自動で文字起こし・要約・感情分析・アクションアイテム抽出まで行うアプリケーションです。  
バックエンドは **Python/FastAPI**、フロントエンドは **TypeScript/Vue.js** で構築しています。

---

## 🚀 主な機能

- **音声アップロード**（mp3など）
- **Whisper API** による音声認識
- **OpenAI API** による要約生成
- 感情分析・ファクト推論
- アクションアイテム自動抽出
- 結果のモーダル表示（Vue.jsフロントエンド）

---

## 🛠 使用技術

### フロントエンド
- Vue.js 3
- TypeScript
- Vite
- Axios

### バックエンド
- Python 3.11
- FastAPI
- Pydantic / Pydantic Settings
- Uvicorn

### 外部サービス
- OpenAI API（Whisper / Chat Completions）

---

## 📂 ディレクトリ構成（抜粋）
meeting-summary-app/
├── backend/ # FastAPI バックエンド
│ ├── app/
│ │ ├── routes/ # APIルート
│ │ ├── services/ # 音声解析・要約処理
│ │ ├── models.py
│ │ ├── schemas.py
│ │ └── main.py
│ ├── requirements.txt
│ └── create_db.py
├── frontend/ # Vue.js フロントエンド
│ ├── src/
│ │ ├── components/ # モーダルやアップロードUI
│ │ ├── pages/ # 画面
│ │ └── api/ # API呼び出し
│ ├── package.json
│ └── vite.config.ts
└── README.md

---

## ⚙️ セットアップ方法

### 1. バックエンド（FastAPI）
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windowsは venv\Scripts\activate
pip install -r requirements.txt

# 環境変数ファイルを作成
cp .env.example .env
# .env に APIキーなどを設定

# 開発サーバー起動
uvicorn app.main:app --reload

フロントエンド（Vue.js）

cd frontend
npm install

# 環境変数ファイルを作成
cp .env.example .env
# APIエンドポイントなどを設定

# 開発サーバー起動
npm run dev

## 📦 バックエンド動作環境

- Python 3.11 以上
- FastAPI 0.115.13
- Uvicorn 0.34.3
- Pydantic 2.11.7 / Pydantic Settings 2.10.0
- SQLAlchemy 2.0.41
- OpenAI SDK 1.90.0
- OpenAI Whisper 20240930
- python-dotenv 1.1.0
- torch 2.7.1 (CPU版)
- torchaudio 2.7.1+cpu
