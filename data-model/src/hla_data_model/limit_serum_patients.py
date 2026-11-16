#!/usr/bin/env python3
"""Limite le nombre de patients de ``serum_test_history.csv``.

Le générateur produit mille patients ; l'application y ajoute son patient mis en avant (constant,
backend ``constants/featured_patient.py``). Pour que le total reste de mille, ce script retire les
derniers patients constants (``A``) du fichier jusqu'à la cible, hors patients de démonstration
dotés d'un historique : 999 patients ici, plus le patient mis en avant, font 1 000. Les patients
fluctuants (``C``) ne sont jamais retirés, de sorte que leur nombre ne change pas. Déterministe et
rejouable : à la cible ou en dessous, il ne fait rien.

    PYTHONPATH=src python3 -m hla_data_model.limit_serum_patients [--patients 999]
"""

from __future__ import annotations

import argparse
import csv
from collections import Counter
from collections.abc import Sequence
from pathlib import Path

DEFAULT_CSV_PATH = Path(__file__).resolve().parents[2] / "data" / "serum_test_history.csv"
DEFAULT_PATIENT_TARGET = 999

CONSTANT = "A"

# Patients de démonstration dotés d'un historique d'événements
# (backend `constants/patient_history.py`) : ils restent dans le fichier.
PROTECTED_PATIENT_IDS = frozenset(
    {
        "HIS-00055", "SYN-0038", "HIS-00355", "HIS-00073", "HIS-00407",
        "SYN-0712", "HIS-00584", "HIS-00485", "HIS-00047", "HIS-00230",
    }
)

Row = dict[str, str]


def patient_ids(rows: Sequence[Row]) -> list[str]:
    """Les `patient_id` dans l'ordre du fichier, sans doublon."""
    return list(dict.fromkeys(row["patient_id"] for row in rows))


def limit_patients(
    rows: Sequence[Row],
    target: int,
    protected: frozenset[str] = PROTECTED_PATIENT_IDS,
) -> tuple[list[Row], list[str]]:
    """Les lignes d'au plus `target` patients, et les `patient_id` retirés (derniers d'abord)."""
    ordered = patient_ids(rows)
    surplus = len(ordered) - target
    if surplus <= 0:
        return [dict(row) for row in rows], []

    profile = {row["patient_id"]: row["profile"] for row in rows}
    candidates = [pid for pid in reversed(ordered) if profile[pid] == CONSTANT and pid not in protected]
    if len(candidates) < surplus:
        raise ValueError(f"{surplus} patients à retirer mais seulement {len(candidates)} retirables")

    removed = candidates[:surplus]
    gone = set(removed)
    return [dict(row) for row in rows if row["patient_id"] not in gone], removed


def main(argv: Sequence[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV_PATH)
    parser.add_argument("--patients", type=int, default=DEFAULT_PATIENT_TARGET)
    args = parser.parse_args(argv)

    with args.csv.open(newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    result, removed = limit_patients(rows, args.patients)
    if removed:
        with args.csv.open("w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames, lineterminator="\n")
            writer.writeheader()
            writer.writerows(result)

    counts = Counter({row["patient_id"]: row["profile"] for row in result}.values())
    print(f"{len(removed)} patients retirés : {', '.join(removed) or '-'}")
    print(f"{len(patient_ids(result))} patients ; profils : {dict(sorted(counts.items()))}")


if __name__ == "__main__":
    main()
