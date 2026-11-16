from __future__ import annotations

import sys
import unittest
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from hla_data_model.fluctuate_serum_profiles import (  # noqa: E402
    ANTIGENS,
    POSITIVE_THRESHOLD,
    fluctuate,
    fluctuating_values,
    profile_counts,
    varying_antigens,
)

DATES = ("2021-04-01", "2022-04-01", "2023-04-01", "2024-04-01")


def series(patient_id: str, profile: str, varying: int, tests: int = 4) -> list[dict[str, str]]:
    """`tests` prélèvements dont les `varying` premiers antigènes varient (100, 600, 100, 600)."""
    rows = []
    for index, test_date in enumerate(DATES[:tests]):
        row = {"patient_id": patient_id, "graft_date": "2020-01-01", "test_date": test_date}
        for position, name in enumerate(ANTIGENS):
            value = (100, 600, 100, 600)[index] if position < varying else 300
            row[name] = str(value)
            row[f"{name}_output"] = str(int(value >= POSITIVE_THRESHOLD))
        row["profile"] = profile
        rows.append(row)
    return rows


def dataset() -> list[dict[str, str]]:
    return (
        series("P-A", "A", 0)
        + series("P-B1", "B", 1)
        + series("P-B2", "B", 2)
        + series("P-B0", "B", 0)
        + series("P-C", "C", 3)
        + series("P-B-ONE-TEST", "B", 0, tests=1)
    )


class FluctuateSerumProfilesTests(unittest.TestCase):
    def test_every_intermediate_patient_becomes_fluctuating(self) -> None:
        result, converted = fluctuate(dataset())

        counts = profile_counts(result)
        self.assertEqual((counts["A"], counts["B"], counts["C"]), (1, 0, 5))
        self.assertEqual(converted, ["P-B1", "P-B2", "P-B0", "P-B-ONE-TEST"])

    def test_a_converted_patient_ends_with_three_varying_antigens(self) -> None:
        result, _ = fluctuate(dataset())

        for patient_id in ("P-B1", "P-B2", "P-B0"):
            rows = [row for row in result if row["patient_id"] == patient_id]
            self.assertEqual(len(varying_antigens(rows)), 3, patient_id)

    def test_outputs_follow_the_values_and_the_variation_crosses_the_threshold(self) -> None:
        result, _ = fluctuate(dataset())
        rows = [row for row in result if row["patient_id"] == "P-B0"]

        for row in rows:
            for name in ANTIGENS:
                self.assertEqual(row[f"{name}_output"], str(int(int(row[name]) >= POSITIVE_THRESHOLD)))
        for name in varying_antigens(rows):
            self.assertEqual({int(row[f"{name}_output"]) for row in rows}, {0, 1}, name)

    def test_the_first_test_keeps_its_values_and_dates_never_change(self) -> None:
        original = dataset()
        result, _ = fluctuate(original)
        by_key = {(row["patient_id"], row["test_date"]): row for row in result}

        first = by_key[("P-B0", DATES[0])]
        self.assertEqual({name: first[name] for name in ANTIGENS}, {name: "300" for name in ANTIGENS})
        self.assertEqual(
            [(row["patient_id"], row["test_date"], row["graft_date"]) for row in original],
            [(row["patient_id"], row["test_date"], row["graft_date"]) for row in result],
        )

    def test_a_single_test_patient_only_changes_label(self) -> None:
        original = series("P-ONE", "B", 0, tests=1)
        result, converted = fluctuate(original)

        self.assertEqual(converted, ["P-ONE"])
        self.assertEqual({k: v for k, v in result[0].items() if k != "profile"}, {k: v for k, v in original[0].items() if k != "profile"})
        self.assertEqual(result[0]["profile"], "C")

    def test_constant_and_fluctuating_patients_are_left_alone_and_the_input_is_not_mutated(self) -> None:
        original = dataset()
        snapshot = [dict(row) for row in original]

        result, _ = fluctuate(original)

        self.assertEqual(original, snapshot)
        untouched = {"P-A", "P-C"}
        self.assertEqual(
            [row for row in result if row["patient_id"] in untouched],
            [row for row in snapshot if row["patient_id"] in untouched],
        )

    def test_it_is_deterministic_and_replayable(self) -> None:
        first, _ = fluctuate(dataset())
        second, _ = fluctuate(dataset())
        replay, converted = fluctuate(first)

        self.assertEqual(first, second)
        self.assertEqual(converted, [])
        self.assertEqual(replay, first)

    def test_values_stay_in_range_with_a_crossing_of_the_threshold(self) -> None:
        for tests in (2, 3, 6):
            values = fluctuating_values("P-X", "DR53", 300, tests)
            self.assertEqual(values[0], 300)
            self.assertTrue(all(0 <= value <= 9999 for value in values))
            self.assertEqual({value >= POSITIVE_THRESHOLD for value in values}, {True, False})


if __name__ == "__main__":
    unittest.main()
