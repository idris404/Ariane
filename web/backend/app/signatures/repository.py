import uuid

from sqlalchemy import ColumnElement, Select, exists, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.constants.signatures import SIGN_QUEUE_PROFILE
from app.patients.entity import Patient
from app.serum_tests.entity import SerumTest
from app.signatures.entity import PatientSignature
from app.signatures.exceptions import PatientAlreadySignedError


def _eligible_conditions() -> list[ColumnElement[bool]]:
    """Un cas synthétique pas encore signé avec un profil sérique constant."""
    return [
        exists().where(
            SerumTest.patient_id == Patient.patient_id, SerumTest.profile == SIGN_QUEUE_PROFILE
        ),
        ~exists().where(PatientSignature.patient_id == Patient.patient_id),
    ]


class SignatureRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def eligible(self, limit: int) -> list[Patient]:
        """Return the first unsigned constant-profile cases in stable identifier order."""
        query: Select[tuple[Patient]] = (
            select(Patient)
            .where(*_eligible_conditions())
            .options(selectinload(Patient.serum_tests), selectinload(Patient.history))
            .order_by(Patient.patient_id)
            .limit(limit)
        )
        return list(await self._session.scalars(query))

    async def count_eligible(self) -> int:
        total = await self._session.scalar(
            select(func.count()).select_from(Patient).where(*_eligible_conditions())
        )
        return total or 0

    async def add(self, patient_id: str, user_id: uuid.UUID) -> PatientSignature:
        """Enregistre la signature. Une seconde signature du même patient est refusée."""
        signature = PatientSignature(patient_id=patient_id, signed_by=user_id)
        self._session.add(signature)
        try:
            await self._session.commit()
        except IntegrityError as error:
            await self._session.rollback()
            raise PatientAlreadySignedError from error
        await self._session.refresh(signature)
        return signature
