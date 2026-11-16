import pytest
from fastapi.testclient import TestClient

from app.conftest import AUTH_URL, make_patient, make_serum_test
from app.constants.consultations import CONSULT_QUEUE_PATH, CONSULTATIONS_ROUTER_PREFIX
from app.constants.http import API_V1_PREFIX
from app.constants.pagination import DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
from app.consultations.dependencies import get_consultation_service
from app.consultations.services import ConsultationService
from app.main import app
from app.patients.entity import Patient

QUEUE_URL = f"{API_V1_PREFIX}{CONSULTATIONS_ROUTER_PREFIX}{CONSULT_QUEUE_PATH}"
CASE_COUNT = DEFAULT_PAGE_SIZE + 3


class FakeConsultationRepository:
    """Remplace ConsultationRepository. La requête est testée à part
    (`consultations/test_repository.py`) : ici, tous les patients fournis sont à consulter."""

    def __init__(self, patients: list[Patient]) -> None:
        self.patients = patients
        self.last_window: tuple[int, int] | None = None

    async def fluctuating(self, offset: int, limit: int) -> list[Patient]:
        self.last_window = (offset, limit)
        return self.patients[offset : offset + limit]

    async def count_fluctuating(self) -> int:
        return len(self.patients)


def fluctuating_patient(number: int) -> Patient:
    patient = make_patient(patient_id=f"P-C-{number:03d}")
    patient.serum_tests = [make_serum_test(patient, profile="C")]
    return patient


@pytest.fixture
def repository() -> FakeConsultationRepository:
    return FakeConsultationRepository([fluctuating_patient(n) for n in range(CASE_COUNT)])


@pytest.fixture
def logged_in(
    client: TestClient, repository: FakeConsultationRepository, registered_user: dict[str, str]
) -> TestClient:
    app.dependency_overrides[get_consultation_service] = lambda: ConsultationService(repository)
    assert client.post(f"{AUTH_URL}/login", json=registered_user).status_code == 204
    return client


def test_the_queue_requires_authentication(client: TestClient) -> None:
    assert client.get(QUEUE_URL).status_code == 401


def test_the_queue_returns_the_first_page_and_the_total(
    logged_in: TestClient, repository: FakeConsultationRepository
) -> None:
    body = logged_in.get(QUEUE_URL).json()

    assert repository.last_window == (0, DEFAULT_PAGE_SIZE)
    assert (body["total"], body["page"], body["page_size"]) == (
        CASE_COUNT,
        DEFAULT_PAGE,
        DEFAULT_PAGE_SIZE,
    )
    assert len(body["items"]) == DEFAULT_PAGE_SIZE
    assert body["items"][0]["serum_evolution"]["profile"] == "C"


def test_the_next_page_holds_the_remaining_cases(
    logged_in: TestClient, repository: FakeConsultationRepository
) -> None:
    body = logged_in.get(QUEUE_URL, params={"page": 2}).json()

    assert repository.last_window == (DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE)
    assert len(body["items"]) == CASE_COUNT - DEFAULT_PAGE_SIZE
    assert body["total"] == CASE_COUNT


@pytest.mark.parametrize(
    "params",
    [
        {"page": 0},
        {"page_size": 0},
        {"page_size": MAX_PAGE_SIZE + 1},
        {"page": "abc"},
        {"pagesize": 5},
    ],
)
def test_invalid_query_parameters_are_a_422(logged_in: TestClient, params: dict[str, object]) -> None:
    assert logged_in.get(QUEUE_URL, params=params).status_code == 422
