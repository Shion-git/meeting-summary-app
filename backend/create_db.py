from app.models import Base
from app.database import engine

# モデルに基づいて全テーブルを作成
Base.metadata.create_all(bind=engine)

print("✅ データベーステーブルが作成されました。")