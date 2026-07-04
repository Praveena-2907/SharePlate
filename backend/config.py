import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = os.environ.get("DATABASE_URL", "")
    secret_key: str = os.environ.get("SESSION_SECRET", "")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    app_name: str = "SharePlate API"
    cors_origins: list[str] = ["*"]


settings = Settings()

if not settings.database_url:
    raise RuntimeError(
        "DATABASE_URL environment variable is not set. Provision a PostgreSQL database first."
    )

if not settings.secret_key:
    raise RuntimeError(
        "SESSION_SECRET environment variable is not set. It is required to sign JWT tokens."
    )
