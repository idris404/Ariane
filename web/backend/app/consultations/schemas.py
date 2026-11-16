from pydantic import BaseModel, ConfigDict, Field

from app.constants.pagination import DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE


class ConsultQueueQuery(BaseModel):
    """Entrée : query params de la file « À consulter » (pagination seulement)."""

    # Un paramètre inconnu (faute de frappe : `pagesize=`) est refusé au lieu d'être ignoré en silence.
    model_config = ConfigDict(extra="forbid")

    page: int = Field(default=DEFAULT_PAGE, ge=1)
    page_size: int = Field(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE)
