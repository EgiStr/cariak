# Structural Research Methods — Sourced from Academic & Industry Literature

Cariak v1.3.1 uses real, cited research methodologies. Every method below maps to a published paper, government standard, or established industry framework. No synthetic/hallucinated methods.

Source of truth: `references/structural-research-methods.csv` (17 methods with citations).

---

## Method → Source Mapping

### Phase: Pitching (Problem Exploration)

| Method | Source | Citation |
|---|---|---|
| **SCAMPER** — 7 creative operators (Substitute, Combine, Adapt, Modify, Put, Eliminate, Reverse) | Eberle, B. (1996). *Scamper: Games for Imagination Development*. | Based on Osborn (1953) brainstorming principles. |
| **Five Whys** — recursive root-cause questioning | Ohno, T. (1988). *Toyota Production System*. | Toyota Production System; also documented in Serrat (2017), ADB. |
| **Design Thinking** — Empathize → Define → Ideate | Brown, T. (2008). Design Thinking. *Harvard Business Review*. | IDEO Field Guide (2015) operationalizes this. |

### Phase: Grinding (Research Question Formulation)

| Method | Source | Citation |
|---|---|---|
| **PICO Framework** — Population, Intervention, Comparison, Outcome | Richardson, W.S., et al. (1995). The well-built clinical question. *ACP Journal Club*, 123(3). | Extension: PICOC (+Context), SPIDER (Cooke et al., 2012, *Qualitative Health Research*). |
| **PRISMA-P 2015** — protocol for systematic reviews before execution | Moher, D., et al. (2015). *Systematic Reviews*, 4(1), 1. | 17-item checklist for protocol registration and planning. |

### Phase: Planning (Source Strategy)

| Method | Source | Citation |
|---|---|---|
| **Systematic Review Protocol** (Kitchenham & Charters) — reproducible search strategy | Kitchenham, B., & Charters, S. (2007). *EBSE Technical Report EBSE-2007-01*. | Widely cited in software engineering SLR. Also: Cochrane Handbook (Higgins & Green, 2011). |

### Phase: Researching (Evidence Collection)

| Method | Source | Citation |
|---|---|---|
| **OSINT Cycle** — Direction → Collection → Processing → Analysis → Dissemination | NATO (2001). *Open Source Intelligence Handbook*. Also: Williams & Blum (2018), *RAND Corporation*. | Multi-source: surface web, deep web, social media, academic databases, news, market data. |
| **Cochrane Systematic Search** — structured database search across multiple sources | Higgins, J.P.T., & Green, S. (2011). *Cochrane Handbook*, Chapter 4. | Deduplicate, screen by title/abstract, screen full-text, extract data. |

### Phase: Synthesizing (Evidence Integration)

| Method | Source | Citation |
|---|---|---|
| **Thematic Synthesis** — code findings → descriptive themes → analytical themes | Thomas, J., & Harden, A. (2008). *BMC Medical Research Methodology*, 8(1), 45. | Primary method for qualitative evidence synthesis; endorsed by Cochrane. |
| **Framework Synthesis** — "best fit" framework adopted from literature, refined with new data | Carroll, C., et al. (2013). *BMC Medical Research Methodology*, 13(1), 37. | Used when a conceptual framework already exists; index findings against it. |

### Phase: Output (Technical Report Production)

| Method | Source | Citation |
|---|---|---|
| **Technology Assessment** — systematic evaluation of technology status, feasibility, and implications | U.S. GAO (2021). *Technology Assessment Design Handbook*. GAO-21-347G. | Structured format: describe technology → assess TRL → opportunities/challenges → policy → alternatives. |
| **Feasibility Study** — multi-dimensional viability assessment | USACE (2023). *Feasibility Report Format and Content Guide*. ER 1105-2-100. | Technical → economic → operational → schedule → environmental → risk → recommendation. |

### Phase: Validating (Claim Verification)

| Method | Source | Citation |
|---|---|---|
| **GRADE** — Grading of Recommendations Assessment, Development and Evaluation | Guyatt, G.H., et al. (2008). *BMJ*, 336(7650), 924-926. | Rates evidence quality: High / Moderate / Low / Very Low. Widely adopted by WHO, Cochrane, NICE. |
| **CASP Checklists** — Critical Appraisal Skills Programme | CASP UK (2018). *casp-uk.net/casp-tools-checklists*. UK National Health Service. | 10-12 questions per study type; covers validity, results, local applicability. |

### Phase: Reflecting (Quality Gate)

| Method | Source | Citation |
|---|---|---|
| **AMSTAR 2** — A MeaSurement Tool to Assess systematic Reviews | Shea, B.J., et al. (2017). *BMJ*, 358, j4008. | 16-item checklist: PICO, protocol, search, selection, extraction, bias, synthesis, conflict. |
| **PRISMA 2020 Checklist** — 27-item reporting completeness standard | Page, M.J., et al. (2021). *BMJ*, 372, n71. | Title → abstract → intro → methods → results → discussion → other. |

### Phase: Closing (Knowledge Preservation)

| Method | Source | Citation |
|---|---|---|
| **FAIR Data Principles** — Findable, Accessible, Interoperable, Reusable | Wilkinson, M.D., et al. (2016). *Scientific Data*, 3, 160018. | DOI, metadata, open formats, provenance, persistent repository. |

---

## Engineering Heuristic: Technical Research Structure

While the *structure* below is a heuristic (not a named method from a paper), every element is grounded in the methodologies above:

```
Technical Report Structure (derived from Technology Assessment + Feasibility Study):

1. Executive Summary
2. Problem Framing — PICO framework
3. First-Principles Explanation — Five Whys / root cause
4. State of the Art — OSINT + Cochrane Search across academic/social/internet
5. Methods Used in the Field — OSINT field practice lens
6. Method Comparison Matrix — Technology Assessment alternatives analysis
7. Recommended Architecture — Feasibility Study technical assessment
8. Implementation Roadmap — Feasibility Study schedule/cost
9. Data Strategy — Systematic Review data extraction
10. Evaluation Protocol — GRADE evidence quality
11. Failure Modes & Mitigations — Feasibility Study risk analysis
12. Alternatives — Technology Assessment comparative analysis
13. Gaps / Unknowns — AMSTAR 2 / PRISMA completeness check
14. Final Recommendation — GRADE recommendation strength
15. References — FAIR Data (persistent identifiers)
```

This structure is presented as a **practical synthesis** of multiple established methods, not as a novel method. Every section traces to a source.

---

## Quality Bar

The final report should let a practitioner answer:

- What should we build first? *(Feasibility Study — recommendation with phasing)*
- What method should we avoid and why? *(GRADE — low-quality evidence)*
- What data do we need? *(Systematic Review — data extraction)*
- How do we know it works? *(GRADE — evidence quality)*
- What can fail in production? *(Feasibility Study — risk analysis)*
- What cheaper alternatives exist? *(Technology Assessment — alternatives analysis)*
- Which claims are strong/weak/uncertain? *(GRADE + CASP — graded evidence)*

---

## References (by method)

1. Eberle, B. (1996). *Scamper: Games for Imagination Development*. Prufrock Press. → **SCAMPER**
2. Ohno, T. (1988). *Toyota Production System*. Productivity Press. → **Five Whys**
3. Brown, T. (2008). Design Thinking. *Harvard Business Review*, 86(6), 84-92. → **Design Thinking**
4. Richardson, W.S., et al. (1995). The well-built clinical question. *ACP Journal Club*, 123(3), A12-A13. → **PICO**
5. Moher, D., et al. (2015). PRISMA-P 2015 statement. *Systematic Reviews*, 4(1), 1. → **PRISMA-P**
6. Kitchenham, B., & Charters, S. (2007). *EBSE Technical Report EBSE-2007-01*. → **SLR Protocol**
7. NATO (2001). *Open Source Intelligence Handbook*. → **OSINT Cycle**
8. Higgins, J.P.T., & Green, S. (2011). *Cochrane Handbook*, Ch.4. Wiley. → **Systematic Search**
9. Thomas, J., & Harden, A. (2008). *BMC Medical Research Methodology*, 8(1), 45. → **Thematic Synthesis**
10. Carroll, C., et al. (2013). *BMC Medical Research Methodology*, 13(1), 37. → **Framework Synthesis**
11. U.S. GAO (2021). *Technology Assessment Design Handbook*. GAO-21-347G. → **Technology Assessment**
12. USACE (2023). *Feasibility Report Format and Content Guide*. ER 1105-2-100. → **Feasibility Study**
13. Guyatt, G.H., et al. (2008). *BMJ*, 336(7650), 924-926. → **GRADE**
14. CASP UK (2018). *casp-uk.net/casp-tools-checklists*. → **CASP Checklists**
15. Shea, B.J., et al. (2017). *BMJ*, 358, j4008. → **AMSTAR 2**
16. Page, M.J., et al. (2021). *BMJ*, 372, n71. → **PRISMA 2020**
17. Wilkinson, M.D., et al. (2016). *Scientific Data*, 3, 160018. → **FAIR Principles**
