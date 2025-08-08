from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import meeting
import uvicorn

app = FastAPI()

# CORS ミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )

app.include_router(meeting.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)