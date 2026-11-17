from functools import lru_cache
from pathlib import Path

from pydantic import EmailStr, Field, SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL, make_url

from app.constants.auth import PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH
from app.constants.database import ASYNC_DB_DRIVER, DEFAULT_DB_HOST
from app.constants.http import DEFAULT_FRONTEND_URL

# web/.env : config.py → core → app → backend → web
ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore"
    )

    # En production, Vercel/Neon fournit une URL complète. Les champs séparés restent disponibles
    # pour Docker Compose et le développement local.
    database_dsn: SecretStr | None = Field(default=None, validation_alias="DATABASE_URL")
    db_user: str | None = None
    db_password: SecretStr | None = None
    db_name: str | None = None
    db_port: int | None = None
    db_host: str = DEFAULT_DB_HOST

    frontend_url: str = DEFAULT_FRONTEND_URL
    # Sûr par défaut : mettre COOKIE_SECURE=false uniquement en développement local (HTTP).
    cookie_secure: bool = True

    @model_validator(mode="after")
    def require_database_configuration(self) -> "Settings":
        if self.database_dsn is not None:
            return self
        missing = [
            name
            for name, value in (
                ("DB_USER", self.db_user),
                ("DB_PASSWORD", self.db_password),
                ("DB_NAME", self.db_name),
                ("DB_PORT", self.db_port),
            )
            if value is None
        ]
        if missing:
            raise ValueError(f"configuration PostgreSQL manquante : {', '.join(missing)}")
        return self

    @property
    def database_url(self) -> URL:
        if self.database_dsn is not None:
            source = make_url(self.database_dsn.get_secret_value())
            # asyncpg reçoit SSL via `connect_args`. Les options libpq de Neon ne doivent pas être
            # transmises telles quelles au pilote Python.
            query = {
                key: value
                for key, value in source.query.items()
                if key not in {"sslmode", "channel_binding"}
            }
            return source.set(drivername=ASYNC_DB_DRIVER, query=query)

        assert self.db_user is not None
        assert self.db_password is not None
        assert self.db_name is not None
        assert self.db_port is not None
        return URL.create(
            ASYNC_DB_DRIVER,
            username=self.db_user,
            password=self.db_password.get_secret_value(),
            host=self.db_host,
            port=self.db_port,
            database=self.db_name,
        )

    @property
    def database_connect_args(self) -> dict[str, str]:
        if self.database_dsn is None:
            return {}
        source = make_url(self.database_dsn.get_secret_value())
        sslmode = source.query.get("sslmode")
        return {"ssl": "require"} if sslmode not in (None, "disable") else {}


class SeedSettings(BaseSettings):
    """Compte de démonstration du seed (`python -m app.seed`, étape `users`).

    Séparé de `Settings` : l'API n'en a pas besoin, elle ne charge donc jamais ce mot de passe, et une
    valeur invalide ici ne l'empêche pas de démarrer. Lue seulement par le seed, quand l'étape tourne.
    """

    model_config = SettingsConfigDict(
        env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore"
    )

    seed_user_email: EmailStr
    # Mêmes bornes que l'inscription : le compte doit pouvoir passer `UserCreate`.
    seed_user_password: SecretStr = Field(
        min_length=PASSWORD_MIN_LENGTH, max_length=PASSWORD_MAX_LENGTH
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]  # les champs requis viennent de l'environnement
