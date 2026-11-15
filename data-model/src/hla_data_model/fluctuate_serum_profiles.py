#!/usr/bin/env python3
"""Rend fluctuants tous les patients non constants de ``serum_test_history.csv``.

Le profil d'un patient décrit la stabilité de son suivi : ``A`` aucun antigène ne varie, ``B`` un ou
deux antigènes varient, ``C`` trois antigènes varient. Ce script garde les patients constants (``A``)
et les patients fluctuants (``C``) tels quels, et fait de chaque patient ``B`` un patient ``C``.

Changer l'étiquette seule laisserait un profil ``C`` dont un ou deux antigènes seulement varient :
on fait donc varier les antigènes manquants jusqu'à trois. Le premier prélèvement garde sa valeur ;
les suivants prennent des valeurs synthétiques, tirées au hasard avec une graine propre à
(patient, antigène), qui passent le seuil de positivité. Un patient d'un seul prélèvement ne peut
pas varier : seule son étiquette change. Dates et autres colonnes ne bougent pas. Déterministe et
rejouable (une fois les ``B`` convertis, il ne reste rien à faire).

    PYTHONPATH=src python3 -m hla_data_model.fluctuate_serum_profiles
"""

from __future__ import annotations

import argparse
import csv
import random
from collections import Counter, defaultdict
from collections.abc import Sequence
from pathlib import Path

DEFAULT_CSV_PATH = Path(__file__).resolve().parents[2] / "data" / "serum_test_history.csv"

ANTIGENS = ("B12", "B13", "DR53", "DR51", "DQ10")
CONSTANT, INTERMEDIATE, FLUCTUATING = "A", "B", "C"
# Un profil fluctuant fait varier trois antigènes.
FLUCTUATING_VARYING_ANTIGENS = 3
POSITIVE_THRESHOLD = 500  # `*_output` vaut 1 quand la valeur atteint ce seuil (miroir du backend)
MAX_VALUE = 9999
POSITIVE_SHARE = 0.5  # part des valeurs tirées au-dessus du seuil

Row = dict[str, str]


def varying_antigens(rows: Sequence[Row]) -> list[str]:
    """Les antigènes dont la valeur change d'un prélèvement à l'autre, dans l'ordre de ANTIGENS."""
    return [name for name in ANTIGENS if len({row[name] for row in rows}) > 1]


def profile_counts(rows: Sequence[Row]) -> Counter[str]:
    """Le nombre de patients par profil (chaque patient a un seul profil)."""
    return Counter({profile: 0 for profile in (CONSTANT, INTERMEDIATE, FLUCTUATING)}) + Counter(
        {row["patient_id"]: row["profile"] for row in rows}.values()
    )


def draw_value(rng: random.Random, positive: bool) -> int:
    low, high = (POSITIVE_THRESHOLD, MAX_VALUE) if positive else (0, POSITIVE_THRESHOLD - 1)
    return rng.randint(low, high)


def fluctuating_values(patient_id: str, antigen: str, first_value: int, count: int) -> list[int]:
    """`count` valeurs dont la première est `first_value` et qui passent le seuil de positivité."""
    rng = random.Random(f"{patient_id}|{antigen}")
    values = [first_value]
    values += [draw_value(rng, rng.random() < POSITIVE_SHARE) for _ in range(count - 1)]
    sides = {value >= POSITIVE_THRESHOLD for value in values}
    if len(sides) == 1:  # toutes du même côté du seuil : la dernière passe de l'autre côté
        values[-1] = draw_value(rng, positive=first_value < POSITIVE_THRESHOLD)
    return values


def fluctuate(rows: Sequence[Row]) -> tuple[list[Row], list[str]]:
    """Les lignes sans patient `B`, et les `patient_id` convertis (ordre du fichier)."""
    result = [dict(row) for row in rows]
    by_patient: dict[str, list[Row]] = defaultdict(list)
    for row in result:
        by_patient[row["patient_id"]].append(row)

    converted = []
    for patient_id, series in by_patient.items():
        if series[0]["profile"] != INTERMEDIATE:
            continue
        series.sort(key=lambda row: row["test_date"])
        missing = FLUCTUATING_VARYING_ANTIGENS - len(varying_antigens(series))
        steady = [name for name in ANTIGENS if name not in varying_antigens(series)]
        if len(series) > 1:
            for antigen in steady[: max(missing, 0)]:
                values = fluctuating_values(patient_id, antigen, int(series[0][antigen]), len(series))
                for row, value in zip(series, values):
                    row[antigen] = str(value)
                    row[f"{antigen}_output"] = str(int(value >= POSITIVE_THRESHOLD))
        for row in series:
            row["profile"] = FLUCTUATING
        converted.append(patient_id)
    return result, converted


def main(argv: Sequence[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV_PATH)
    args = parser.parse_args(argv)

    with args.csv.open(newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    result, converted = fluctuate(rows)
    if converted:
        with args.csv.open("w", newline="", encoding="utf-8") as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames, lineterminator="\n")
            writer.writeheader()
            writer.writerows(result)

    counts = profile_counts(result)
    print(f"{len(converted)} patients passés de B à C")
    print(f"profils : A={counts[CONSTANT]} B={counts[INTERMEDIATE]} C={counts[FLUCTUATING]}")


if __name__ == "__main__":
    main()
