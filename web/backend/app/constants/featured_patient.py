from dataclasses import dataclass
from datetime import date
from typing import Final

from app.constants.patient_history import HistoryKind
from app.constants.patients import Gender
from app.constants.serum_tests import SerumProfile


@dataclass(frozen=True)
class FeaturedSerumTest:
    """Un prélèvement sérique : date et valeurs des cinq antigènes (les `*_output` se calculent)."""

    test_date: date
    b12: int
    b13: int
    dr53: int
    dr51: int
    dq10: int


@dataclass(frozen=True)
class FeaturedEvent:
    """Un événement d'historique, daté tel quel (pas calé sur la greffe comme `HISTORY_EVENTS`)."""

    code: str
    kind: HistoryKind
    title: str
    detail: str
    occurred_on: date


@dataclass(frozen=True)
class FeaturedPatient:
    """Un dossier écrit ici, hors CSV : le patient, ses prélèvements sériques et son historique."""

    patient_id: str
    firstname: str
    lastname: str
    birth: date
    gender: Gender
    city: str
    country: str
    graft_date: date
    profile: SerumProfile
    serum_tests: tuple[FeaturedSerumTest, ...]
    events: tuple[FeaturedEvent, ...]


# Un prélèvement par an ; profil A (constant) : chaque antigène garde la même valeur à tous les prélèvements.
FEATURED_TEST_DATES: Final = (
    date(2021, 4, 12),
    date(2022, 4, 11),
    date(2023, 4, 10),
    date(2024, 4, 8),
    date(2025, 4, 14),
    date(2026, 4, 13),
)
FEATURED_STABLE_VALUES: Final = {"b12": 120, "b13": 640, "dr53": 365, "dr51": 1180, "dq10": 290}

# Dossier fictif de démonstration, mis en avant : le nom est un nom d'affichage choisi par l'équipe,
# aucune valeur ci-dessous ne provient d'une personne réelle ni d'un résultat clinique.
# `patient_id` : « DEMO- » se classe avant « HIS- » et « SYN- », donc ce patient ouvre toute liste
# triée par `patient_id` (la file « À signer »). Âgé de 28 ans à la date de naissance ci-dessous
# (jusqu'au 19 juin 2027). Profil `A` (constant) : il fait partie des cas « À signer ».
FEATURED_PATIENT: Final = FeaturedPatient(
    patient_id="DEMO-0001",
    firstname="Kylian",
    lastname="Mbappé",
    birth=date(1998, 6, 20),
    gender=Gender.MALE,
    city="Paris",
    country="France",
    graft_date=date(2020, 9, 14),
    profile=SerumProfile.CONSTANT,
    serum_tests=tuple(
        FeaturedSerumTest(test_date, **FEATURED_STABLE_VALUES)
        for test_date in FEATURED_TEST_DATES
    ),
    events=(
        FeaturedEvent(
            code="followup",
            kind=HistoryKind.CONSULTATION,
            title="Consultation de suivi",
            detail="Contrôle immunologique de routine · exemple fictif",
            occurred_on=date(2026, 10, 5),
        ),
    ),
)
