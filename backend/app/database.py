from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite データベース URL
SQLALCHEMY_DATABASE_URL = "sqlite:///app.db"

# DBエンジンを作成
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# セッションローカル（リクエストごとに分離されたDB接続）
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデルのベースクラス
Base = declarative_base()

# DBセッションの依存関数（FastAPIで使う）
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
