---
name: cariak-validating
description: Falsification-based verification of research findings. Use AFTER cariak-synthesizing when research-report.md exists. Extracts key claims, frames them as falsifiable questions, selects research methods (at least one must seek refutation), executes validation, and grades verdicts (Confirmed/Refuted/Inconclusive). Trigger on "validate", "verify findings", "check claims", or when cariak-synthesizing hands off.
---

# Validating

<!-- CARIAK SKILL: cariak-validating - v1.1 -->

### Iron Laws

**LAW 1: NO VERDICT WITHOUT EVIDENCE.** Must cite source. Default Inconclusive if not citable.

**LAW 2: SEEK REFUTATION.** ≥1 method per claim must actively seek refutation. All confirm only → invalid.

**LAW 3: CITE SOURCES.** Every evidence traceable. URLs live/archived. Papers include DOI/arXiv.

**LAW 4: ADVISOR FALSIFICATION MANDATORY.** Falsificationist advisor (Phase 4.5) required for every grade-A claim.

### When to Use / Do NOT Use

Use: cariak-synthesizing handed off, user says "validate"/"verify findings"/"check claims", high-stakes claims.
Skip: no research-report.md (return to cariak-synthesizing), want reflection (use cariak-reflecting), quick fact-check (use search), research in progress.

### Hard Gates

**GATE 0:** Report must exist at `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.md`.
**GATE 1:** ≥1 refutation-seeking method per claim.
**GATE 2:** Verdicts graded (Confirmed/Refuted/Inconclusive), each with confidence level + rationale.
**GATE 3:** All evidence cited. Uncited → removed. If verdict unsupported → Inconclusive.

### Phase 0: Preflight

Check Memory MCP. Verify report exists (GATE 0). Load references/research-methods.csv. Set output: `validation-report.md`.

### Phase 1: Extract Key Claims

Extract claims meeting: high-stakes, contested, surprising, quantitative, causal. Record: text, source RQ, citations, type.

### Phase 2: Frame as Falsifiable Questions

Factual: "Is [claim] true? What contradicts?" Causal: "Does [X] cause [Y]?" Quantitative: "Is [N] accurate?" Predictive: "Has [prediction] come true?" Normative: "Is [judgment] widely shared?"

### Phase 3: Select Research Methods

2-4 per claim. Methods: source-verification (confirm), counter-source-search (refute), expert-counsel (both), temporal-check (refute), methodology-audit (refute), replication-check (confirm), bias-check (refute), cross-reference (both). **GATE 1 check:** ≥1 refutation per claim.

### Phase 4: Execute Validation

Per claim: re-fetch source, search contradicting sources (negation queries), invoke cariak-advising (≥2 personas, ≥1 skeptic), check dates, audit methodology, check bias, cross-reference databases. May invoke sub-agents.

### Phase 4.5: Falsificationist Challenge (ANTITHESIS)

Per grade-A claim, dispatch Falsificationist advisor via cariak-advising (Popper-style, different model): design falsification tests, find strongest counter-argument (cited), assess verdict impact. **LAW 4:** if skipped for any grade-A claim → incomplete, loop back.

### Phase 5: Grade Verdict

Confirmed (multiple independent sources, refutation failed) / Refuted (counter-evidence found) / Inconclusive (mixed/insufficient). Each High/Medium/Low confidence.

### Phase 6: Write Validation Report

Write to `validation-report.md`: Iron Laws compliance, per-claim verdicts (claim text, RQ, type, falsifiable question, methods, evidence, refutation, verdict, confidence, rationale), summary stats, implications.

### Phase 7: Handoff

Present: path, stats (X/Y/Z), Iron Laws compliance. Options: 1. Reflect → cariak-reflecting [RECOMMENDED], 2. Re-synthesize (loop), 3. Save.

Auto-invoke: no refuted + ≥70% Confirmed High/Medium → cariak-reflecting behind confirmation. Any Refuted → recommend re-synthesize.

Memory: store ResearchArtifact (validation), ResearchDecision per verdict.

### Failure Modes

No refutation method → Inconclusive. Counter-ev search empty → supports Confirmed (with note). Expert unavailable → skip, note. Source retracted → Refuted High.

### Reference Triggers

| File | Phase | Purpose |
|---|---|---|
| references/research-methods.csv | 3 | Method selection |
| references/citation-standards.csv | 4, 6 | Citation format |
| research-report.md | 1 | Claim source |
| subagents/*.md | 4 | Evidence gathering |
| Memory MCP | 0, 7 | Context |
