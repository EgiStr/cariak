# Structural Research Methods

Cariak v1.3.1 adds an explicit structural method layer to every phase. This prevents deep research from becoming a generic web-search summary and makes each skill auditable.

## Why this exists

A user should be able to say:

```text
cariak tolong deep research terkait weight estimator by computer vision
```

and receive a report that explains:

- what the problem really is,
- what methods exist in academic literature,
- what industry actually uses,
- what can be implemented,
- what data and calibration are required,
- what can fail in production,
- what alternatives exist,
- what should be built first.

## Method registry

See: `references/structural-research-methods.csv`.

| ID | Method | Phase |
|---|---|---|
| M01 | Structured Brainstorming Matrix | pitching |
| M02 | BDD Research Specification | grinding |
| M03 | Engineering Lens Canvas | grinding |
| M04 | Source Taxonomy Planning | planning |
| M05 | Multi-Lens Parallel Research | researching |
| M06 | Implementation Evidence Harvest | researching |
| M07 | Cross-Source Synthesis | synthesizing |
| M08 | Expert Technical Report | synthesizing |
| M09 | Falsification Validation | validating |
| M10 | Quality Reflection Rubric | reflecting |
| M11 | Research Knowledge Closure | closing |

## Engineering Lens Canvas

Technical topics must include this canvas in the spec and final report:

1. First principles
2. State of the art
3. Field practice
4. Implementation architecture
5. Data strategy
6. Evaluation protocol
7. Failure modes
8. Tradeoffs
9. Alternatives
10. Unknowns / required experiments

## Implementation Evidence Harvest

Technical research plans must search for:

- repositories,
- official docs,
- benchmarks,
- datasets / model cards,
- standards / patents,
- commercial products,
- field practice / deployment reports.

If evidence is not found, the report must say so explicitly. Do not invent implementation guidance.

## Expert Technical Report quality bar

The final report should let a practitioner answer:

- What should we build first?
- What method should we avoid and why?
- What data do we need?
- How do we know it works?
- What breaks in production?
- What simpler / cheaper / commercial alternatives exist?
- Which claims are strong, weak, or uncertain?

## Files changed by this method layer

- `references/structural-research-methods.csv`
- `references/structural-research-methods.md`
- `skills/cariak-pitching/SKILL.md`
- `skills/cariak-grinding/SKILL.md`
- `skills/cariak-planning/SKILL.md`
- `skills/cariak-researching/SKILL.md`
- `skills/cariak-synthesizing/SKILL.md`
- `skills/cariak-validating/SKILL.md`
- `skills/cariak-reflecting/SKILL.md`
- `skills/cariak-closing/SKILL.md`
- `templates/technical-report.md`
