# From Demonstrator to Pilot

## Purpose

Ariane currently provides product proof: a local, reproducible, tested workflow that prepares immunological review from synthetic data while keeping human validation explicit.

The next step is not to deploy the demonstrator unchanged. It is to determine, in an authorized and supervised setting, whether this preparation can genuinely restore team capacity without reducing review quality.

Moving an accumulated backlog from **six months toward one month** is an operational target to be measured. It is not an achieved result, contractual promise, or clinical performance claim.

## What has already been demonstrated

- a complete workflow from simulated import to human validation;
- a longitudinal view of synthetic profiles;
- separate queues for prepared validation and deeper review;
- a deterministic backend that remains the source of truth;
- an interface that exposes missing data and limitations;
- local execution, automated tests, and a reproducible scenario;
- the **Best Patient Solution Award** at the AI for Health hackathon.

## What the pilot must measure

### Operational capacity

- time required to prepare and review a record;
- number of records reviewed over a defined period;
- backlog size and age before, during, and after the evaluation;
- manual rework required before validation.

### Quality and safety

- detected missing or contradictory data;
- differences between Ariane's preparation and professional review;
- corrections made before any validation;
- traceability of triggered rules, their versions, and human actions.

### Adoption

- understanding of displayed information and limitations;
- perceived user workload;
- reasons for non-use, correction, or return to the usual workflow.

This repository defines no success threshold. Criteria, definitions, and expected values must be agreed with professionals, quality leads, and legal stakeholders before evaluation.

## Proposed pathway

### 1. Scoping

- validate vocabulary, rules, counterexamples, and responsibilities;
- define the evaluation protocol and indicators;
- document governance, security, and the data-use framework.

### 2. Supervised retrospective evaluation

- work only in an authorized environment;
- compare Ariane's preparation with reference professional review;
- document every disagreement, missing item, and observed limitation.

This phase is not implemented in the repository and must not use real data without appropriate authorization and governance.

### 3. Supervised pilot

- use Ariane as a preparation tool, never as a decision-maker;
- preserve professional validation at every step;
- monitor the indicators defined during scoping;
- provide immediate shutdown and return to the usual process when uncertainty arises.

### 4. Continuation decision

Pilot results should determine whether to stop, correct, extend the evaluation, or prepare a professional version. Future development could include versioned protocols, stronger auditing, access management, and deployment adapted to the target environment.

## Non-negotiable conditions

- no autonomous transplant decision;
- no clinical-validation claim without formal evaluation;
- no real patient data in this repository;
- no new medical rule without professional validation;
- no third-party integration without documentation and authorization;
- visible, traceable human validation through the final decision.

See also [Responsible Use](RESPONSIBLE_USE.md), [Product Vision](PRODUCT.md), and [Architecture](ARCHITECTURE.md).
