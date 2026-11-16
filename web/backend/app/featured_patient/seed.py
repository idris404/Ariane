"""Ingestion du patient mis en avant (étape `featured` de `python -m app.seed`).

Un dossier fictif décrit dans `constants/featured_patient.py`, hors CSV : le patient, ses prélèvements
sériques et son événement d'historique. L'étape ne dépend d'aucune autre : elle crée d'abord le
patient, puis ce qui pointe vers lui par `patient_id`. Rejouable : les `id` sont déduits (`patient_id`,
`patient_id|date`, `patient_id|code`), un dossier déjà présent n'est pas dupliqué.
"""

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Protocol

from app.constants.featured_patient import FEATURED_PATIENT, FeaturedPatient
from app.constants.serum_tests import SERUM_POSITIVE_THRESHOLD
from app.patient_history.seed import history_uuid_for
from app.patients.seed import patient_uuid_for
from app.serum_tests.seed import serum_test_uuid_for


class RowRepository(Protocol):
    """Ce que l'étape demande à chaque dépôt (patients, tests sériques, historique)."""

    async def add_many_ignoring_existing(self, values: Sequence[Mapping[str, object]]) -> int: ...


@dataclass(frozen=True)
class FeaturedSeedReport:
    patients: int
    serum_tests: int
    history: int


def positive(value: int) -> int:
    """`*_output` : 1 quand la valeur de l'antigène atteint le seuil, 0 sinon."""
    return 1 if value >= SERUM_POSITIVE_THRESHOLD else 0


def build_patient_values(featured: FeaturedPatient) -> dict[str, object]:
    return {
        "id": patient_uuid_for(featured.patient_id),
        "patient_id": featured.patient_id,
        "firstname": featured.firstname,
        "lastname": featured.lastname,
        "birth": featured.birth,
        "gender": featured.gender,
        "city": featured.city,
        "country": featured.country,
    }


def build_serum_values(featured: FeaturedPatient) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for test in featured.serum_tests:
        row: dict[str, object] = {
            "id": serum_test_uuid_for(featured.patient_id, test.test_date),
            "patient_id": featured.patient_id,
            "graft_date": featured.graft_date,
            "test_date": test.test_date,
            "profile": featured.profile.value,
        }
        for antigen in ("b12", "b13", "dr53", "dr51", "dq10"):
            value = getattr(test, antigen)
            row[antigen] = value
            row[f"{antigen}_output"] = positive(value)
        rows.append(row)
    return rows


def build_history_values(featured: FeaturedPatient) -> list[dict[str, object]]:
    return [
        {
            "id": history_uuid_for(featured.patient_id, event.code),
            "patient_id": featured.patient_id,
            "kind": event.kind,
            "title": event.title,
            "detail": event.detail,
            "occurred_on": event.occurred_on,
        }
        for event in featured.events
    ]


async def seed_featured_patient(
    patients: RowRepository,
    serum_tests: RowRepository,
    history: RowRepository,
    featured: FeaturedPatient = FEATURED_PATIENT,
) -> FeaturedSeedReport:
    # Le patient d'abord : les prélèvements et l'événement ont une clé étrangère vers lui.
    inserted_patients = await patients.add_many_ignoring_existing([build_patient_values(featured)])
    return FeaturedSeedReport(
        patients=inserted_patients,
        serum_tests=await serum_tests.add_many_ignoring_existing(build_serum_values(featured)),
        history=await history.add_many_ignoring_existing(build_history_values(featured)),
    )
