# Ariane — Product Vision

## The problem

Immunological review in transplantation requires professionals to compare results produced at different times, reconstruct histories, and identify missing data or changes requiring deeper review.

The demonstrator explores an operational question: **how can this review be prepared so that expert time is focused first on the records that require it?**

## The proposal

Ariane brings together a synthetic record history, makes its evolution readable, and routes it to one of two prototype queues:

- **Ready to sign**: the record is prepared for a final check;
- **Needs review**: the history requires deeper review.

This routing organizes work. It is not a clinical decision. A professional checks the data and explicitly initiates every signature.

## Demonstrated workflow

1. The user signs in to the local environment.
2. They start an explicitly simulated import and analysis.
3. They open the synthetic record dashboard.
4. They review a record's history and serum evolution.
5. They open either the prepared-record queue or the deeper-review queue.
6. They check the data before any signature.

## Demonstrated value

- longitudinal review instead of isolated results;
- a clear distinction between routine preparation and deeper review;
- an interface that exposes missing data and limitations;
- traceability of human action;
- a local, reproducible demonstration workflow.

## Operational ambition

The field need presented during the hackathon described an estimated six-month accumulated backlog. Ariane aims to help the team move toward one month by preparing repetitive records while keeping cases requiring deeper review immediately visible.

This **6 → 1 month** trajectory is a value hypothesis to be measured. It is not an achieved result, contractual promise, or clinical performance claim.

## Potential professional development

Further development would require formal validation of rules, counterexamples, and vocabulary, followed by retrospective evaluation using authorized data. Time savings must be timed and errors measured before any real-world evaluation.

Potential developments include:

- professionally reviewed, versioned protocols;
- more detailed auditing of triggered factors;
- review-time measurement;
- a supervised pilot with local validation;
- integration studies only after the target system is documented and authorized.

The proposed pathway from product proof to impact proof is detailed in [From Demonstrator to Pilot](PILOT.md).

## Outside the prototype scope

- diagnosis;
- treatment recommendations;
- autonomous transplant decisions;
- clinical rejection prediction;
- complete autonomous interpretation of anti-HLA antibodies;
- a real LymFIP connection;
- use of real patient data.
