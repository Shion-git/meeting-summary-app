from pydantic_settings import BaseSettings # type: ignore

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    UPLOAD_DIR: str = "app/uploads"

    class Config:
        env_file = ".env"

settings = Settings()