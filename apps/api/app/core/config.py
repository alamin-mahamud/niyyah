from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://niyyah:niyyah@localhost:5432/niyyah"
    redis_url: str = "redis://localhost:6379/0"
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    cors_origins: str = "http://localhost:3000"

    # For tests, swap asyncpg → aiosqlite
    test_database_url: str = "sqlite+aiosqlite:///./test.db"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
