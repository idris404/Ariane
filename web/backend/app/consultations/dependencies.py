from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.consultations.repository import ConsultationRepository
from app.consultations.services import ConsultationService
from app.core.database import get_async_session


def get_consultation_service(
    session: AsyncSession = Depends(get_async_session),
) -> ConsultationService:
    return ConsultationService(ConsultationRepository(session))
