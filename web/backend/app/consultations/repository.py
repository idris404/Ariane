from sqlalchemy import ColumnElement, Select, exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.constants.consultations import CONSULT_QUEUE_PROFILE
from app.patients.entity import Patient
from app.serum_tests.entity import SerumTest


def _consult_conditions() -> list[ColumnElement[bool]]:
    """Un patient dont un prélèvement est de profil sérique fluctuant. La signature n'entre pas en
    compte : ces cas ne se signent pas, ils se consultent."""
    return [
        exists().where(
            SerumTest.patient_id == Patient.patient_id, SerumTest.profile == CONSULT_QUEUE_PROFILE
        )
    ]


class ConsultationRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def fluctuating(self, offset: int, limit: int) -> list[Patient]:
        """Une page de cas fluctuants, en ordre stable de `patient_id`."""
        query: Select[tuple[Patient]] = (
            select(Patient)
            .where(*_consult_conditions())
            .options(selectinload(Patient.serum_tests), selectinload(Patient.history))
            .order_by(Patient.patient_id)
            .offset(offset)
            .limit(limit)
        )
        return list(await self._session.scalars(query))

    async def count_fluctuating(self) -> int:
        total = await self._session.scalar(
            select(func.count()).select_from(Patient).where(*_consult_conditions())
        )
        return total or 0
