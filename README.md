# Meeting Summary App

会議の音声をアップロードすると、自動で文字起こし・要約・感情分析・アクションアイテム抽出まで行うアプリケーションです。  
バックエンドは **Python/FastAPI**、フロントエンドは **TypeScript/React** で構築しています。

---

## 🚀 主な機能

- **音声アップロード**（mp3など）
- **Whisper API** による音声認識
- **OpenAI API** による要約生成
- 感情分析・ファクト推論
- アクションアイテム自動抽出
- 結果のモーダル表示（Reactフロントエンド）

---

## 📂 プロジェクト構成
```
meeting-summary-app/
├── backend/ # FastAPI バックエンド
│ ├── app/ # API・モデル・ルーティング・サービス処理
│ ├── requirements.txt
│ └── .env # 環境変数（Git管理外）
└── frontend/ # React + TypeScript フロントエンド
├── src/ # ページ・コンポーネント
├── package.json
└── .env # 環境変数（Git管理外）
```

---

## 🛠 動作環境

### バックエンド
- Python 3.11 以上
- FastAPI
- Uvicorn
- SQLAlchemy
- OpenAI API クライアント
- Whisper
- ffmpeg

 （詳細は [`backend/requirements.txt`](backend/requirements.txt) を参照）

### フロントエンド
- Node.js 20.x 以上
- npm または yarn
- React 18
- Vite
- Material UI

（詳細は [`frontend/package.json`](frontend/package.json) を参照）

---

## ⚙️ 環境変数の設定

本アプリは `.env` ファイルで API キーや接続設定を管理しています。  
セキュリティのため、実際のキーは **絶対に公開しない** でください。

### バックエンド (`backend/.env`)
.env
- OPENAI_API_KEY=your_openai_api_key_here
- DATABASE_URL=sqlite:///./app.db

### フロントエンド (`frontend/.env`)
.env
- VITE_API_BASE_URL=http://localhost:8000


## 🚀 セットアップ手順
### 1. リポジトリのクローン
```
git clone https://github.com/あなたのユーザー名/meeting-summary-app.git
cd meeting-summary-app
```

### 2. バックエンドのセットアップ
```
cd backend
python -m venv venv
source venv/bin/activate   # Windowsは venv\Scripts\activate
pip install -r requirements.txt
cp .env # 環境変数を設定
uvicorn app.main:app --reload
```

※デフォルトで http://localhost:8000 で起動します。

### 3. フロントエンドのセットアップ
```
cd frontend
npm install
cp .env # API接続先を設定
npm run dev
```

※デフォルトで http://localhost:5173 で起動します。

## 🧩 主な機能
- 会議音声ファイルのアップロード
- OpenAI Whisper による音声文字起こし
- GPT による要約生成
- 感情分析
- アクションアイテム抽出
- 会議履歴の保存・閲覧

## 📜 ライセンス
このプロジェクトはポートフォリオ用であり、商用利用は想定していません。

## 💡 注意
- .env ファイルは 必ず .gitignore に追加 してください。
- APIキーや個人情報はコミットしないようにしてください。
