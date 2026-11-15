"""Requête de la file « À consulter » (profil fluctuant, paginée), sur SQLite en mémoire."""

import uuid
from collections.abc import AsyncIterator

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.conftest import make_patient, make_serum_test
from app.consultations.repository import ConsultationRepository
from app.patient_history.entity import PatientHistory
from app.patients.entity import Patient
from app.serum_tests.entity import SerumTest
from app.signatures.entity import PatientSignature
from app.users.entity import User

pytestmark = pytest.mark.anyio

SIGNER = uuid.UUID(int=99)


def with_profile(patient_id: str, profile: str) -> list[object]:
    patient = make_patient(patient_id=patient_id)
    return [patient, make_serum_test(patient, profile=profile)]


@pytest.fixture
async def session() -> AsyncIterator[AsyncSession]:
    engine = create_async_engine("sqlite+aiosqlite://")
    async with engine.begin() as connection:
        for table in (User, Patient, SerumTest, PatientHistory, PatientSignature):
            await connection.run_sync(table.__table__.create)
    async with async_sessionmaker(engine, expire_on_commit=False)() as session:
        session.add(User(id=SIGNER, email="signer@example.com", hashed_password="x"))
        session.add_all(
            [
                *with_profile("P-C-2", "C"),
                *with_profile("P-C-0", "C"),
                *with_profile("P-C-1", "C"),
                *with_profile("P-A", "A"),
                *with_profile("P-B", "B"),
            ]
        )
        session.add(make_patient(patient_id="P-NO-TEST"))
        # Un cas fluctuant déjà signé reste consultable : la signature ne le concerne pas.
        session.add(PatientSignature(patient_id="P-C-0", signed_by=SIGNER))
        await session.commit()
        yield session
    await engine.dispose()


@pytest.fixture
def repository(session: AsyncSession) -> ConsultationRepository:
    return ConsultationRepository(session)


async def codes(repository: ConsultationRepository, offset: int = 0, limit: int = 10) -> list[str]:
    return [patient.patient_id for patient in await repository.fluctuating(offset, limit)]


async def test_only_fluctuating_profiles_are_listed_in_a_stable_order(repository) -> None:
    assert await codes(repository) == ["P-C-0", "P-C-1", "P-C-2"]
    assert await repository.count_fluctuating() == 3


async def test_the_list_is_paginated_and_the_total_ignores_the_page(repository) -> None:
    assert await codes(repository, offset=0, limit=2) == ["P-C-0", "P-C-1"]
    assert await codes(repository, offset=2, limit=2) == ["P-C-2"]
    assert await codes(repository, offset=3, limit=2) == []
    assert await repository.count_fluctuating() == 3
