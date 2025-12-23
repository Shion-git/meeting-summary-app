# Meeting Summary App

会議の音声をアップロードすると、自動で文字起こし・要約・感情分析・アクションアイテム抽出まで行うアプリケーションです。  
バックエンドは **Python/FastAPI**、フロントエンドは **TypeScript/React** で構築しています。

---

## 🎯 開発背景・目的
会議内容の共有・振り返りに時間がかかるという課題を感じ、
音声から要点を自動で整理できる仕組みを個人開発として構築しました。

実務を想定し、
音声 → テキスト → 要約 → 行動整理
という一連の流れをシステムとして完結させることを目的としています。

---

## 🧠 設計・実装のポイント

- バックエンドは FastAPI を採用し、API 単位で責務を分離
- OpenAI / Whisper 処理は service 層に切り出し、再利用性を意識
- フロントエンドは API との疎結合を意識し、レスポンス形式を統一
- エラー時もユーザーに状態が分かるよう UI 制御を実装

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

# 仮想環境
# Windows
python -m venv venv
venv\Scripts\activate

# 依存インストール
pip install -r requirements.txt

# .env作成
copy .env

# ffmpeg が必要（未導入の場合）
# Windows: https://www.gyan.dev/ffmpeg/builds/ から zip をDL → PATHに追加

# サーバ起動（デフォルト: http://localhost:8000）
uvicorn app.main:app --reload
```

### 3. フロントエンドのセットアップ
```
cd frontend

# 依存インストール
npm install

# .env 作成
copy .env

# 開発起動（デフォルト: http://localhost:5173）
npm run dev
```

## 🧩 主な機能
- 会議音声ファイルのアップロード
- OpenAI Whisper による音声文字起こし
- GPT による要約生成
- 感情分析
- アクションアイテム抽出
- 会議履歴の保存・閲覧

## 📜 ライセンス
このプロジェクトはポートフォリオ用であり、商用利用は想定していません。

## 🔐 守秘義務・個人開発について
本システムは個人開発として作成しており、
実務コード・顧客データ・業務情報は一切使用していません。

## 💡 注意
- .env ファイルは 必ず .gitignore に追加 してください。
- APIキーや個人情報はコミットしないようにしてください。
