# Structural Research Methods — Sourced

Cariak v1.3.1 uses only real, cited research methodologies. Zero synthetic/AI-hallucinated methods.

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

## Method Registry

See: `references/research-methods.csv` (17 methods with full citations appended to existing catalog).

| Phase | Methods |
|---|---|
| **pitching** | SCAMPER (Eberle 1996), Five Whys (Ohno 1988), Design Thinking (Brown 2008, HBR) |
| **grinding** | PICO Framework (Richardson et al. 1995, ACP Journal Club), PRISMA-P 2015 (Moher et al. 2015, Systematic Reviews) |
| **planning** | Systematic Review Protocol (Kitchenham & Charters 2007, EBSE TR), Cochrane Handbook (Higgins & Green 2011) |
| **researching** | OSINT Cycle (NATO 2001; Williams & Blum 2018, RAND), Cochrane Systematic Search (Higgins & Green 2011) |
| **synthesizing** | Thematic Synthesis (Thomas & Harden 2008, BMC Med Res Methodol), Framework Synthesis (Carroll et al. 2013, BMC Med Res Methodol) |
| **synthesizing output** | Technology Assessment (US GAO 2021, GAO-21-347G), Feasibility Study (USACE 2023, ER 1105-2-100) |
| **validating** | GRADE (Guyatt et al. 2008, BMJ), CASP Checklists (UK NHS 2018, casp-uk.net) |
| **reflecting** | AMSTAR 2 (Shea et al. 2017, BMJ j4008), PRISMA 2020 Checklist (Page et al. 2021, BMJ n71) |
| **closing** | FAIR Data Principles (Wilkinson et al. 2016, Scientific Data/Nature) |

## Engineering Heuristic (not a novel method)

The technical report structure below is a *practical synthesis* of Technology Assessment + Feasibility Study + Engineering Design Review, not a claimed novel method:

1. Executive Summary
2. Problem Framing
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

Every section above traces to a source method — see the full mapping in `references/research-methods.csv`.

## Key References

1. **Brown, T. (2008).** Design Thinking. HBR. → Problem exploration
2. **Richardson, W.S., et al. (1995).** PICO. ACP Journal Club. → Research question formulation
3. **Kitchenham, B., & Charters, S. (2007).** SLR Guidelines. EBSE TR. → Search protocol
4. **NATO (2001).** OSINT Handbook. → Multi-source collection
5. **Thomas, J., & Harden, A. (2008).** Thematic Synthesis. BMC Med Res Methodol. → Evidence synthesis
6. **US GAO (2021).** Technology Assessment. GAO-21-347G. → Technical evaluation
7. **Guyatt, G.H., et al. (2008).** GRADE. BMJ. → Evidence quality
8. **Shea, B.J., et al. (2017).** AMSTAR 2. BMJ. → Review quality
9. **Wilkinson, M.D., et al. (2016).** FAIR Principles. Scientific Data. → Knowledge preservation
