# Structural Research Methods

Cariak uses explicit research methods per phase. This keeps every skill from becoming a generic prompt and makes the pipeline auditable.

## Method stack

| Method | Primary phase | Purpose |
|---|---|---|
| M01 Structured Brainstorming Matrix | pitching | Explore vague topics using structured academic/industry brainstorming methods. |
| M02 BDD Research Specification | grinding | Convert broad directions into testable research questions. |
| M03 Engineering Lens Canvas | grinding | Force technical topics to include implementation, field constraints, alternatives, and failure modes. |
| M04 Source Taxonomy Planning | planning | Map every RQ to source domains and queries. |
| M05 Multi-Lens Parallel Research | researching | Collect evidence from internet, social, academic, news, and market lenses. |
| M06 Implementation Evidence Harvest | researching | Gather repos, docs, benchmarks, datasets, standards, patents, and deployment examples for engineering topics. |
| M07 Cross-Source Synthesis | synthesizing | Merge findings into cited claims, resolve contradictions, grade confidence. |
| M08 Expert Technical Report | synthesizing | Produce an implementation-ready technical report. |
| M09 Falsification Validation | validating | Try to disprove key claims before accepting them. |
| M10 Quality Reflection Rubric | reflecting | Check if research is complete enough to deliver. |
| M11 Research Knowledge Closure | closing | Archive artifacts and memory so findings are reusable. |

Source of truth: `references/structural-research-methods.csv`.

## Engineering Lens Canvas

Use this canvas whenever the topic is technical, scientific, product, hardware, ML, data, infrastructure, or implementation-heavy.

Every technical research spec and report must answer:

1. **First principles** — what physical, mathematical, or system mechanism makes this possible?
2. **State of the art** — what methods are used in papers, products, and mature engineering teams?
3. **Field practice** — what is actually done in industry, not only what is possible in papers?
4. **Implementation architecture** — components, data flow, interfaces, deployment target.
5. **Data strategy** — required data, labels, calibration data, sampling plan, data quality risks.
6. **Evaluation protocol** — metrics, baselines, acceptance thresholds, validation design.
7. **Failure modes** — lighting, sensor drift, distribution shift, operator error, privacy/security, cost.
8. **Tradeoffs** — accuracy vs cost vs latency vs complexity vs maintainability.
9. **Alternatives** — simpler methods, non-AI methods, commercial options, hybrid approaches.
10. **Unknowns** — what must be prototyped, measured, or validated before commitment.

## Expert Technical Report sections

For deep technical research, the final report must include:

1. Executive Summary
2. Problem Framing: what decision the research supports
3. First-Principles Explanation
4. State of the Art
5. Methods Used in the Field
6. Method Comparison Matrix
7. Recommended Architecture
8. Implementation Roadmap
9. Data Strategy
10. Evaluation Protocol
11. Failure Modes & Mitigations
12. Alternatives and Build-vs-Buy Options
13. Gaps / Unknowns / Required Experiments
14. Final Recommendation
15. References

## Quality bar

A report is not complete until a domain practitioner can answer:

- What should we build first?
- What method should we avoid and why?
- What data do we need?
- How do we know it works?
- What can fail in production?
- What cheaper or simpler alternatives exist?
- Which claims are strong, weak, or uncertain?
