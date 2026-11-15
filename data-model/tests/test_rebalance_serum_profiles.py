from __future__ import annotations

import sys
import unittest
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from hla_data_model.rebalance_serum_profiles import (  # noqa: E402
    ANTIGENS,
    POSITIVE_THRESHOLD,
    profile_counts,
    rebalance,
    varying_antigens,
)

YEARS = ("2021-04-01", "2022-04-01", "2023-04-01")


def series(patient_id: str, profile: str, varying: int) -> list[dict[str, str]]:
    """Trois prélèvements dont les `varying` premiers antigènes varient (100, 600, 100)."""
    rows = []
    for index, test_date in enumerate(YEARS):
        row = {"patient_id": patient_id, "graft_date": "2020-01-01", "test_date": test_date}
        for position, name in enumerate(ANTIGENS):
            value = (100, 600, 100)[index] if position < varying else 700
            row[name] = str(value)
            row[f"{name}_output"] = str(int(value >= POSITIVE_THRESHOLD))
        row["profile"] = profile
        rows.append(row)
    return rows


def dataset() -> list[dict[str, str]]:
    rows = series("P-A", "A", 0) + series("P-B", "B", 2)
    for name in ("P-C1", "P-C2", "P-C3", "P-C4"):
        rows += series(name, "C", 3)
    return rows


class RebalanceSerumProfilesTests(unittest.TestCase):
    def test_the_surplus_fluctuating_patients_become_intermediate(self) -> None:
        result, converted = rebalance(dataset(), fluctuating_target=2, protected=frozenset())

        counts = profile_counts(result)
        self.assertEqual((counts["A"], counts["B"], counts["C"]), (1, 3, 2))
        # Les derniers `patient_id` sont retenus : le résultat est déterministe.
        self.assertEqual(converted, ["P-C4", "P-C3"])

    def test_a_converted_patient_keeps_two_varying_antigens_and_consistent_outputs(self) -> None:
        result, _ = rebalance(dataset(), fluctuating_target=3, protected=frozenset())
        rows = [row for row in result if row["patient_id"] == "P-C4"]

        self.assertEqual(varying_antigens(rows), ["B12", "B13"])
        for row in rows:
            self.assertEqual(row["profile"], "B")
            self.assertEqual(row["DR53"], "100")  # gelé à la valeur du premier prélèvement
            self.assertEqual(row["DR53_output"], "0")
            for name in ANTIGENS:
                self.assertEqual(row[f"{name}_output"], str(int(int(row[name]) >= POSITIVE_THRESHOLD)))

    def test_protected_patients_and_other_profiles_are_left_alone(self) -> None:
        original = dataset()
        result, converted = rebalance(original, fluctuating_target=3, protected=frozenset({"P-C4"}))

        self.assertEqual(converted, ["P-C3"])
        untouched = [row for row in result if row["patient_id"] in {"P-A", "P-B", "P-C4"}]
        self.assertEqual(untouched, [row for row in original if row["patient_id"] in {"P-A", "P-B", "P-C4"}])

    def test_below_the_target_nothing_changes_and_the_input_is_not_mutated(self) -> None:
        original = dataset()
        snapshot = [dict(row) for row in original]

        result, converted = rebalance(original, fluctuating_target=10, protected=frozenset())

        self.assertEqual(converted, [])
        self.assertEqual(result, snapshot)
        self.assertEqual(original, snapshot)

    def test_too_few_convertible_patients_is_an_error(self) -> None:
        with self.assertRaises(ValueError):
            rebalance(dataset(), fluctuating_target=0, protected=frozenset({"P-C1", "P-C2"}))


if __name__ == "__main__":
    unittest.main()
