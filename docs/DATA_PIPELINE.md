# Synthetic Data Pipeline

## Purpose

The pipeline provides deterministic data for developing, testing, and demonstrating Ariane without using real patient data.

## Contents

```text
data-model/
├── data/                    synthetic profiles and histories
├── protocols/               versioned demonstrator configuration
├── schemas/                 JSON contracts
├── src/hla_data_model/      normalization, analysis, and validation
└── tests/                   nominal, missing-data, and contradiction cases
```

## Principles

- identical inputs produce identical outputs;
- stable synthetic identifiers;
- separation between input data and generator ground truth;
- structure validation before consumption;
- no network dependency in the core demonstration workflow;
- human validation remains mandatory in every output.

## Application usage

By default, the backend seed loads 999 profiles with serum history plus one featured synthetic record, for a total of 1,000 scenario profiles. It also loads fictional events into PostgreSQL. The `--all-patients` option loads all 51,000 source profiles. The frontend retrieves this data only after the simulated import finishes.

The visible import explains the product workflow. The browser currently sends no patient file to the backend.

## Verification

From `data-model/`:

```bash
PYTHONPATH=src python3 -m unittest discover -s tests -v
PYTHONPATH=src python3 -m hla_data_model.validator data/scenarios
```

## Interpretation

Pipeline results demonstrate product behavior. They do not establish sensitivity, specificity, clinical performance, or generalizability.
