from collections.abc import Mapping, Sequence
from datetime import date

import pytest

from app.conftest import (
    FakePatientHistoryRepository,
    FakePatientRepository,
    FakeSerumTestRepository,
)
from app.constants.featured_patient import FEATURED_PATIENT
from app.constants.patient_history import HistoryKind
from app.constants.patients import Gender
from app.constants.serum_tests import SERUM_POSITIVE_THRESHOLD, SerumProfile
from app.featured_patient.seed import (
    FeaturedSeedReport,
    build_history_values,
    build_patient_values,
    build_serum_values,
    positive,
    seed_featured_patient,
)
from app.patient_history.seed import history_uuid_for
from app.patients.seed import patient_uuid_for
from app.serum_tests.seed import serum_test_uuid_for

pytestmark = pytest.mark.anyio

ANTIGENS = ("b12", "b13", "dr53", "dr51", "dq10")


def age_on(day: date, birth: date) -> int:
    return day.year - birth.year - ((day.month, day.day) < (birth.month, birth.day))


def test_the_featured_patient_is_28_and_opens_every_list_sorted_by_patient_id() -> None:
    assert age_on(date(2026, 11, 15), FEATURED_PATIENT.birth) == 28
    # Les patients du CSV sont « HIS-… » et « SYN-… » : « DEMO-… » se classe avant eux.
    assert FEATURED_PATIENT.patient_id < "HIS-00001"
    assert FEATURED_PATIENT.patient_id < "SYN-0001"


def test_the_patient_row_has_the_identity_and_a_stable_id() -> None:
    values = build_patient_values(FEATURED_PATIENT)

    assert (values["firstname"], values["lastname"]) == ("Kylian", "Mbappé")
    assert values["gender"] is Gender.MALE
    assert values["patient_id"] == FEATURED_PATIENT.patient_id
    assert values["id"] == patient_uuid_for(FEATURED_PATIENT.patient_id)


def test_the_serum_follow_up_is_fluctuating_with_outputs_from_the_threshold() -> None:
    rows = build_serum_values(FEATURED_PATIENT)

    assert len(rows) == len(FEATURED_PATIENT.serum_tests)
    assert {row["profile"] for row in rows} == {SerumProfile.FLUCTUATING.value}
    for row in rows:
        assert row["patient_id"] == FEATURED_PATIENT.patient_id
        assert row["graft_date"] == FEATURED_PATIENT.graft_date
        assert row["id"] == serum_test_uuid_for(FEATURED_PATIENT.patient_id, row["test_date"])
        for antigen in ANTIGENS:
            assert row[f"{antigen}_output"] == int(row[antigen] >= SERUM_POSITIVE_THRESHOLD)
    # Fluctuant : au moins un antigène passe du négatif au positif d'un prélèvement à l'autre.
    assert {row["b12_output"] for row in rows} == {0, 1}


def test_a_patient_has_one_serum_test_per_date() -> None:
    dates = [row["test_date"] for row in build_serum_values(FEATURED_PATIENT)]

    assert len(set(dates)) == len(dates)


def test_the_history_is_a_single_dated_event_with_a_derived_id() -> None:
    (event,) = build_history_values(FEATURED_PATIENT)

    assert event["kind"] is HistoryKind.CONSULTATION
    assert event["id"] == history_uuid_for(FEATURED_PATIENT.patient_id, "followup")
    assert event["patient_id"] == FEATURED_PATIENT.patient_id
    assert event["occurred_on"] == date(2026, 10, 5)


@pytest.mark.parametrize(("value", "expected"), [(0, 0), (SERUM_POSITIVE_THRESHOLD - 1, 0), (SERUM_POSITIVE_THRESHOLD, 1)])
def test_an_antigen_is_positive_from_the_threshold(value: int, expected: int) -> None:
    assert positive(value) == expected


async def test_the_seed_inserts_the_whole_record_once() -> None:
    patients = FakePatientRepository()
    serum = FakeSerumTestRepository()
    history = FakePatientHistoryRepository()

    first = await seed_featured_patient(patients, serum, history)
    second = await seed_featured_patient(patients, serum, history)

    assert first == FeaturedSeedReport(
        patients=1, serum_tests=len(FEATURED_PATIENT.serum_tests), history=1
    )
    assert second == FeaturedSeedReport(patients=0, serum_tests=0, history=0)
    assert len(patients.stored) == 1 and len(history.stored) == 1


async def test_the_patient_is_created_before_what_points_to_it() -> None:
    calls: list[str] = []

    class Recorder:
        def __init__(self, name: str) -> None:
            self.name = name

        async def add_many_ignoring_existing(self, values: Sequence[Mapping[str, object]]) -> int:
            calls.append(self.name)
            return len(values)

    await seed_featured_patient(Recorder("patients"), Recorder("serum"), Recorder("history"))

    assert calls[0] == "patients"
    assert set(calls) == {"patients", "serum", "history"}
