from __future__ import annotations

import sys
import unittest
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from hla_data_model.limit_serum_patients import limit_patients, patient_ids  # noqa: E402


def rows_for(patient_id: str, profile: str, tests: int = 2) -> list[dict[str, str]]:
    return [
        {"patient_id": patient_id, "test_date": f"202{index}-04-01", "profile": profile}
        for index in range(tests)
    ]


def dataset() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for patient_id, profile in (
        ("P-A1", "A"), ("P-C1", "C"), ("P-A2", "A"), ("P-A3", "A"), ("P-C2", "C"), ("P-A4", "A"),
    ):
        rows += rows_for(patient_id, profile)
    return rows


class LimitSerumPatientsTests(unittest.TestCase):
    def test_the_last_constant_patients_are_removed_down_to_the_target(self) -> None:
        result, removed = limit_patients(dataset(), target=4, protected=frozenset())

        self.assertEqual(removed, ["P-A4", "P-A3"])
        self.assertEqual(patient_ids(result), ["P-A1", "P-C1", "P-A2", "P-C2"])
        # Toutes les lignes d'un patient retiré partent avec lui.
        self.assertEqual(len(result), 4 * 2)

    def test_fluctuating_patients_are_never_removed(self) -> None:
        result, _ = limit_patients(dataset(), target=2, protected=frozenset())

        self.assertEqual(patient_ids(result), ["P-C1", "P-C2"])

    def test_protected_patients_stay(self) -> None:
        _, removed = limit_patients(dataset(), target=5, protected=frozenset({"P-A4"}))

        self.assertEqual(removed, ["P-A3"])

    def test_at_or_below_the_target_nothing_changes_and_the_input_is_not_mutated(self) -> None:
        original = dataset()
        snapshot = [dict(row) for row in original]

        result, removed = limit_patients(original, target=6, protected=frozenset())

        self.assertEqual(removed, [])
        self.assertEqual(result, snapshot)
        self.assertEqual(original, snapshot)

    def test_too_few_removable_patients_is_an_error(self) -> None:
        with self.assertRaises(ValueError):
            limit_patients(dataset(), target=1, protected=frozenset())


if __name__ == "__main__":
    unittest.main()
