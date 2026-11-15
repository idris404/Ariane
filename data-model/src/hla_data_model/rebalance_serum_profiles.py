#!/usr/bin/env python3
"""Ajuste la répartition des profils sériques de ``serum_test_history.csv``.

Le profil d'un patient décrit la stabilité de son suivi : ``A`` aucun antigène ne varie, ``B`` un ou
deux antigènes varient, ``C`` trois antigènes varient. Le générateur tire les profils au hasard ; ce
script amène le nombre de patients fluctuants (``C``) à une cible précise, sans toucher aux
patients constants (``A``), aux dates ni aux autres colonnes.

Les patients en trop deviennent ``B`` : on gèle, à sa valeur du premier prélèvement, le troisième
antigène qui variait (le profil reste donc cohérent avec les valeurs, qui n'ont rien de clinique).
Les patients retenus sont les derniers par ``patient_id``, hors patients de démonstration, de sorte
que le résultat est déterministe. Rejouable : sous la cible, il ne fait rien.

    PYTHONPATH=src python3 -m hla_data_model.rebalance_serum_profiles [--fluctuating 86]
"""

from __future__ import annotations

import argparse
import csv
from collections import Counter, defaultdict
from collections.abc import Sequence
from pathlib import Path

DEFAULT_CSV_PATH = Path(__file__).resolve().parents[2] / "data" / "serum_test_history.csv"

# Les 100 patients fluctuants de départ : 86 après ajustement, auxquels l'application ajoute son
# patient mis en avant (backend `constants/featured_patient.py`) pour afficher 87.
DEFAULT_FLUCTUATING_TARGET = 86

ANTIGENS = ("B12", "B13", "DR53", "DR51", "DQ10")
CONSTANT, INTERMEDIATE, FLUCTUATING = "A", "B", "C"
# Un profil fluctuant fait varier trois antigènes ; geler le troisième en laisse deux (profil B).
FLUCTUATING_VARYING_ANTIGENS = 3
POSITIVE_THRESHOLD = 500  # `*_output` vaut 1 quand la valeur atteint ce seuil (miroir du backend)

# Patients de démonstration dotés d'un historique d'événements
# (backend `constants/patient_history.py`) : leur profil ne change pas.
PROTECTED_PATIENT_IDS = frozenset(
    {
        "HIS-00055", "SYN-0038", "HIS-00355", "HIS-00073", "HIS-00407",
        "SYN-0712", "HIS-00584", "HIS-00485", "HIS-00047", "HIS-00230",
    }
)

Row = dict[str, str]


def varying_antigens(rows: Sequence[Row]) -> list[str]:
    """Les antigènes dont la valeur change d'un prélèvement à l'autre, dans l'ordre de ANTIGENS."""
    return [name for name in ANTIGENS if len({row[name] for row in rows}) > 1]


def profile_counts(rows: Sequence[Row]) -> Counter[str]:
    """Le nombre de patients par profil (chaque patient a un seul profil)."""
    return Counter({profile: 0 for profile in (CONSTANT, INTERMEDIATE, FLUCTUATING)}) + Counter(
        {row["patient_id"]: row["profile"] for row in rows}.values()
    )


def rebalance(
    rows: Sequence[Row],
    fluctuating_target: int,
    protected: frozenset[str] = PROTECTED_PATIENT_IDS,
) -> tuple[list[Row], list[str]]:
    """Les lignes avec au plus `fluctuating_target` patients `C`, et les `patient_id` convertis."""
    result = [dict(row) for row in rows]
    by_patient: dict[str, list[Row]] = defaultdict(list)
    for row in result:
        by_patient[row["patient_id"]].append(row)

    fluctuating = [pid for pid, series in by_patient.items() if series[0]["profile"] == FLUCTUATING]
    surplus = len(fluctuating) - fluctuating_target
    if surplus <= 0:
        return result, []

    candidates = [
        pid
        for pid in sorted(fluctuating, reverse=True)
        if pid not in protected
        and len(varying_antigens(by_patient[pid])) == FLUCTUATING_VARYING_ANTIGENS
    ]
    if len(candidates) < surplus:
        raise ValueError(
            f"{surplus} patients à convertir mais seulement {len(candidates)} convertibles"
        )

    converted = candidates[:surplus]
    for pid in converted:
        series = sorted(by_patient[pid], key=lambda row: row["test_date"])
        frozen = varying_antigens(series)[-1]
        first_value = series[0][frozen]
        for row in series:
            row[frozen] = first_value
            row[f"{frozen}_output"] = str(int(int(first_value) >= POSITIVE_THRESHOLD))
            row["profile"] = INTERMEDIATE
    return result, converted


def main(argv: Sequence[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV_PATH)
    parser.add_argument("--fluctuating", type=int, default=DEFAULT_FLUCTUATING_TARGET)
    args = parser.parse_args(argv)

    with args.csv.open(newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    result, converted = rebalance(rows, args.fluctuating)
    if converted:
        with args.csv.open("w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames, lineterminator="\n")
            writer.writeheader()
            writer.writerows(result)

    counts = profile_counts(result)
    print(f"{len(converted)} patients passés de C à B")
    print(f"profils : A={counts[CONSTANT]} B={counts[INTERMEDIATE]} C={counts[FLUCTUATING]}")


if __name__ == "__main__":
    main()
