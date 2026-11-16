# HLA Twin data model

Current deterministic data pipeline for the synthetic kidney-transplant
demonstrator. The active dataset is patient-profile v3. The application also
uses a deterministic synthetic serum history, while the data workspace retains
the profile-history generator and longitudinal validation contracts.

## Active layout

```text
data-model/
├── data/
│   ├── raw/
│   │   └── patients_synthetiques_v3.csv.gz
│   ├── patients_synthetiques_v3.csv
│   ├── serum_test_history.csv
│   ├── processed/patient-profiles/
│   │   ├── profile-source-cases.jsonl.gz
│   │   ├── profile-scores.jsonl.gz
│   │   ├── profile-outcomes.jsonl.gz
│   │   └── profile-import-report.json
│   ├── scenarios/
│   └── dictionary.csv
├── protocols/
│   └── ruleset-profile-1.0.0.json
├── schemas/
├── src/hla_data_model/
│   ├── profile_normalization.py
│   ├── profile_importer.py
│   ├── profile_analyzer.py
│   ├── history_analyzer.py
│   ├── case_analyzer.py
│   └── validator.py
└── tests/
```

Legacy v1/v2 imports and committed generated demo artifacts have been removed.
Regenerable tools remain available for contract and future serum testing.

## Import patient profiles

From `data-model/`:

```bash
PYTHONPATH=src python3 -m hla_data_model.profile_importer \
  --input data/raw/patients_synthetiques_v3.csv.gz \
  --sources data/processed/patient-profiles/profile-source-cases.jsonl.gz \
  --profiles data/processed/patient-profiles/profile-scores.jsonl.gz \
  --outcomes data/processed/patient-profiles/profile-outcomes.jsonl.gz \
  --report data/processed/patient-profiles/profile-import-report.json
```

The import is deterministic and kidney-only. Generation truth, injected anomaly
labels, and simulated future outcomes never enter patient-profile scoring.

## Patient scoring

`PROFILE-1.0.0` calculates eleven explicit factors and maps the total to:

- `minimal`: 0–1;
- `moderate`: 2–3;
- `medium`: 4–5;
- `high`: 6–7;
- `very_high`: 8 or more;
- `uncertain`: a required scoring input is missing or contradictory.

Every output retains `human_validation_required=true`. The demonstrator is
decision support, not autonomous clinical validation.

## Serum/MFI status

The application seed consumes `data/serum_test_history.csv`, which contains
deterministic synthetic values. The data workspace also provides
`profile_history_generator.py`, `history_analyzer.py`, and the source contract
for longitudinal test scenarios. These simulated values and interpretations
remain subject to human validation and must not be presented as clinical
results.

## Profile balance

`serum_test_history.csv` holds one serum profile per patient: `A` no antigen varies, `B` one or two
vary, `C` three vary. `fluctuate_serum_profiles.py` turns every intermediate (`B`) patient into a
fluctuating (`C`) one, leaving constant (`A`) and fluctuating patients, dates and other columns
untouched. Relabelling alone would leave a `C` profile with one or two varying antigens, so the
missing ones are made to vary up to three: the first test keeps its value, the following ones get
synthetic values (seeded per patient and antigen) that cross the 500 positivity threshold. A patient
with a single test cannot vary: only its label changes. It is deterministic and replayable. Current
split of the file: 713 `A`, 286 `C` (999 patients).

```bash
PYTHONPATH=src python3 -m hla_data_model.fluctuate_serum_profiles
```

`limit_serum_patients.py` removes the last constant (`A`) patients, never the demonstration patients with
an event history, down to a target (999). The application adds its own featured `A` patient, so it
holds 1 000 patients: 714 to sign and 286 to consult. Fluctuating patients are never removed.

```bash
PYTHONPATH=src python3 -m hla_data_model.limit_serum_patients [--patients 999]
```

After changing the CSV, re-seed the application database with `uv run python -m app.seed --reset`
(from `web/backend/`).

## Checks

```bash
PYTHONPATH=src python3 -m unittest discover -s tests -v
PYTHONPATH=src python3 -m hla_data_model.validator data/scenarios
```
