# Dataset v2 sources

Every published or real-world figure referenced by `generer_patients.py` and
`verite_cachee.py` carries a source tag in code. This document indexes those
tags and states how external evidence is used.

All quotations and figures were checked against the downloaded source—PubMed
abstract, full text, or official report—using a verification script separate
from the original literature search. Published associations inform synthetic
generation only. No source patient record is copied into Ariane.

| Tag | Meaning |
| --- | --- |
| `[SOURCE: key]` | verified published or official figure |
| `[REAL: key]` | relationship learned from public real-patient data |
| `[CALIBRATED]` | value computed to reproduce a sourced target; see `calage.json` |
| `[ASSUMPTION]` | team choice pending professional review |

The generator source still uses the historical French spellings `[REEL]`,
`[CALE]`, and `[HYPOTHESE]`. They have the same meanings as the English labels
above.

## Public real-world datasets

| Key | Dataset | License | Use |
| --- | --- | --- | --- |
| `bresil_waitlist` | 48,153 kidney-transplant candidates on the São Paulo state waiting list; Kaggle `waitlist-kidney-brazil`, derived from a 2021 PLOS ONE paper | CC BY-NC 4.0 | Effects only: logistic regression of cPRA positivity against transfusion, pregnancy, previous transplant, sex, and age for 46,690 adults. No patient is copied. |
| `mendeley_uk` | 436 kidney recipients from a UK center, 2014–2019; [Mendeley Data](https://doi.org/10.17632/3vdszzmz2n.1) | CC BY 4.0 | Held out from construction and used only for final model testing. |
| `eurotransplant` | HLA-A, HLA-B, and HLA-DR antigen frequencies from the R package `histoc` | Source-specific | Synthetic recipient and donor HLA typing. |

Raw licensed files are stored separately from generated patients. They must
never be merged into the synthetic patient dataset.

## Published and official references

The exact extracted figures, populations, and code locations remain attached
to their tags in the generator source. This index provides the stable key and
primary reference used for verification.

| Key | Reference |
| --- | --- |
| `heaphy2014` | [PMID 24731101](https://pubmed.ncbi.nlm.nih.gov/24731101/) |
| `kamburova2018` | [PMID 29464832](https://pubmed.ncbi.nlm.nih.gov/29464832/) |
| `abm2025` | [French Biomedicine Agency 2025 kidney-transplant report](https://rams-back.agence-biomedecine.fr/uploads/30921_ABM_PG_Organes_Rein2025_b3123a20d8.pdf) |
| `ali2026` | [PMID 41492942](https://pubmed.ncbi.nlm.nih.gov/41492942/) |
| `amico2009` | [PMID 19502960](https://pubmed.ncbi.nlm.nih.gov/19502960/) |
| `anzdata2026` | [PMID 42627662](https://pubmed.ncbi.nlm.nih.gov/42627662/) |
| `augustine2012` | [PMID 22955228](https://pubmed.ncbi.nlm.nih.gov/22955228/) |
| `azegami2023` | [PMID 36705051](https://pubmed.ncbi.nlm.nih.gov/36705051/) |
| `balzer2020` | [PMID 31705694](https://pubmed.ncbi.nlm.nih.gov/31705694/) |
| `betjes2023` | [PMID 38188697](https://pubmed.ncbi.nlm.nih.gov/38188697/) |
| `betjes2026` | [PMID 42170034](https://pubmed.ncbi.nlm.nih.gov/42170034/) |
| `bunnapradist2006` | [PMID 16969282](https://pubmed.ncbi.nlm.nih.gov/16969282/) |
| `buttigieg2019` | [PMID 30508114](https://pubmed.ncbi.nlm.nih.gov/30508114/) |
| `chen2026` | [PMID 42508609](https://pubmed.ncbi.nlm.nih.gov/42508609/) |
| `cochrane2024` | [PMID 39698949](https://pubmed.ncbi.nlm.nih.gov/39698949/) |
| `dekervel2025` | [PMID 41141529](https://pubmed.ncbi.nlm.nih.gov/41141529/) |
| `divat2012` | [PMID 23110130](https://pubmed.ncbi.nlm.nih.gov/23110130/) |
| `gupta2024` | [PMID 38463548](https://pubmed.ncbi.nlm.nih.gov/38463548/) |
| `hill2023` | [PMID 36748802](https://pubmed.ncbi.nlm.nih.gov/36748802/) |
| `johal2017` | [PMID 28510327](https://pubmed.ncbi.nlm.nih.gov/28510327/) |
| `katalinic2017` | [PMID 29225816](https://pubmed.ncbi.nlm.nih.gov/29225816/) |
| `kotry2024` | [PMID 39055708](https://pubmed.ncbi.nlm.nih.gov/39055708/) |
| `lan2021` | [PMID 33495290](https://pubmed.ncbi.nlm.nih.gov/33495290/) |
| `leeaphorn2018` | [PMID 29685925](https://pubmed.ncbi.nlm.nih.gov/29685925/) |
| `lefaucheur2010` | [PMID 20634297](https://pubmed.ncbi.nlm.nih.gov/20634297/) |
| `leffell2014` | [PMID 24300013](https://pubmed.ncbi.nlm.nih.gov/24300013/) |
| `lopes2015` | [PMID 26036480](https://pubmed.ncbi.nlm.nih.gov/26036480/) |
| `lucisano2020` | [PMID 31529621](https://pubmed.ncbi.nlm.nih.gov/31529621/) |
| `mohan2012` | [PMID 23160511](https://pubmed.ncbi.nlm.nih.gov/23160511/) |
| `pernin2017` | [American Transplant Congress 2017 abstract C68](https://atcmeetingabstracts.com/abstract/hla-alloimmunization-according-to-the-different-immunization-events-and-consequences-on-access-to-kidney-transplantation/) |
| `pipeleers2025` | [PMID 39716692](https://pubmed.ncbi.nlm.nih.gov/39716692/) |
| `rein2024` | [REIN 2024 annual report](https://rams-back.agence-biomedecine.fr/uploads/RAPPORT_REIN_2024_dcb0163359_a2dc2cb72f.pdf) |
| `srtr2023` | [PMID 39947805](https://pubmed.ncbi.nlm.nih.gov/39947805/) |
| `stcs2021` | [PMID 33930037](https://pubmed.ncbi.nlm.nih.gov/33930037/) |
| `tomita2019` | [PMID 31644555](https://pubmed.ncbi.nlm.nih.gov/31644555/) |
| `triulzi2009` | [PMID 19453983](https://pubmed.ncbi.nlm.nih.gov/19453983/) |
| `williams2016` | [PMID 26901078](https://pubmed.ncbi.nlm.nih.gov/26901078/) |
| `wissing2008` | [PMID 18322434](https://pubmed.ncbi.nlm.nih.gov/18322434/) |
| `yabu2013` | [PMID 24009295](https://pubmed.ncbi.nlm.nih.gov/24009295/) |

`pernin2017` is a conference abstract, not an indexed full paper. Its figures
were checked against the abstract and match the values referenced in code.

## Assumptions pending professional review

The generator marks every unsourced choice with `[HYPOTHESE]`. These choices
include:

- the distribution of the 1,000 current synthetic cases;
- disease-subtype distributions not reported by the source material;
- post-transplant diabetes, retransplant, graft-duration, and prior-organ
  distributions;
- pregnancy counts, transfusion-product mix, CAR-T prevalence, and simulated
  desensitization or antibody proportions;
- simulated false alerts, missing-data rates, data splits, and the DR-to-DQ
  approximation;
- low or strong antibody generation, virtual-crossmatch escape cases, donor
  relationship assumptions, and probability-shape choices;
- the simulated MFI boundary and any downstream interpretation attached to it.

These values exist to generate deterministic test data. They are not validated
clinical thresholds or recommendations and must remain labeled as simulated or
pending review. The authoritative inventory is the set of `[HYPOTHESE]` tags in
`generer_patients.py` and `verite_cachee.py`; a code change must update this
document and receive professional review before any assumption is presented as
validated.
