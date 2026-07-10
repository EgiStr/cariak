---
name: cariak-reflecting
description: Post-synthesis quality gate. Use AFTER cariak-synthesizing (and optionally after cariak-validating) to assess coverage gaps, confidence thresholds, and source diversity before delivery. Decides whether to PASS (proceed to document generation) or RE-RESEARCH (loop back to cariak-researching, max 2 iterations). Trigger on "reflect", "quality check", "evaluate research", or when synthesizing/validating hands off.
---

# CariaK Reflecting

<!-- CARIAK SKILL: cariak-reflecting - v1.1 -->

### When to Use

- After cariak-synthesizing produces research-report.md
- After cariak-validating produces validation-report.md (recommended)
- User asks "is this research good enough?"
- Before any document generation or delivery

### Do NOT Use

- No research-report.md (use cariak-researching first)
- User wants quick summary, not quality assessment
- Still in researching phase
- User explicitly says "just deliver what we have"

### Hard Gates

**GATE 0: Artifacts must exist.** Verify research-report.md, references.json (valid JSON), and validation-report.md if validation was run.

**GATE 1: Max 2 re-research loops.** Iteration 0 (original), 1 (first re-research), 2 (second re-research). Iteration 3 = MANUAL GATE.

**GATE 2: Manual gate on 3rd iteration.** Do NOT auto-invoke cariak-researching. Present options to user: accept as-is, one more iteration, abort.

### Quality Thresholds

| Metric | Threshold | If Below |
|---|---|---|
| Confidence Score | >= 0.7 | RE-RESEARCH |
| Source Count | >= 5 unique | RE-RESEARCH |
| Sub-agent Coverage | All 5 returned findings | RE-RESEARCH |
| Contradiction Count | <= 3 unresolved | RE-RESEARCH |
| Question Coverage | >= 80% answered | RE-RESEARCH |
| Technical Depth | Technical reports include principles, methods, architecture, data, metrics, failure modes, alternatives | RE-RESEARCH |
| Implementation Actionability | Report answers what to build first, how to test, what to avoid | RE-RESEARCH |

If ANY threshold below minimum → RE-RESEARCH. If ALL met → PASS.

### Phase 0: Preflight

1. Verify artifacts exist (GATE 0)
2. Load references: quality-thresholds.yaml, reflection-template.md
3. Check memory MCP for project context
4. Load research artifacts: research-report.md, references.json, validation-report.md (if exists), original research-spec.md and research-plan.md
5. Determine re-research iteration count (check for `-iter1`, `-iter2` suffixes)

### Phase 1: Load Research Report + Validation

1. Parse research-report.md: key claims, confidence score, source count, contradiction mentions
2. Parse validation-report.md (if exists): verdict counts, refuted claims (red flags)
3. Parse references.json: unique sources, source diversity by type, low-credibility sources
4. Parse original research-spec.md: research questions as coverage benchmark

### Phase 2: Assess Coverage Gaps

1. Question-by-question audit: Was each RQ addressed? Answered with evidence? Sufficient depth? Confidence 0.0-1.0?
2. Identify gaps: questions not addressed, addressed without evidence, confidence < 0.5, unexplored sub-topics
3. Source coverage map by type (Academic/News/Social/Market/Internet): Good/Sparse/None
4. Temporal coverage: date range, missed recent developments (< 6 months), missed historical precedents

### Phase 3: Check Confidence Thresholds

1. Overall confidence: >= 0.7 PASS, < 0.7 FAIL
2. Per-question confidence: identify < 0.5 (high risk)
3. Per-source-type: over-reliance on one type?
4. Validation verdict distribution: if > 30% Inconclusive → FAIL

### Phase 4: Evaluate Source Diversity

1. Source type distribution % — any type > 60%? Any type 0%?
2. Geographic/linguistic diversity: all one region/language? Non-English sources missed?
3. Temporal diversity: all same period? Recency bias? Legacy bias?

### Phase 4.1: Technical Report Quality Audit

| Check | Pass Condition |
|---|---|
| First principles | Explains WHY method works |
| Field methods | Covers industry practice |
| Architecture | Components, data flow, deployment |
| Data strategy | Data, labels, calibration, quality risks |
| Evaluation | Metrics, baseline, thresholds |
| Failure modes | Production risks and mitigations |
| Alternatives | Simpler, non-AI, commercial, hybrid |
| Roadmap | Phases, exit criteria, first build step |

If any check fails → RE-RESEARCH (unless user accepts limitation).

### Phase 5: Decision — PASS or RE-RESEARCH

**PASS:** All thresholds met, no critical gaps, Blind Spot Audit (Phase 5.5) completed.
**RE-RESEARCH:** Any threshold below minimum → loop to cariak-researching with refined questions.
**MANUAL_REVIEW:** Iteration count >= 2 and thresholds still not met → ask user.

### Phase 5.5: Blind Spot Audit (ANTITHESIS)

1. Dispatch Blind Spot Auditor advisor via cariak-advising (different model/persona)
2. Advisor identifies: un-researched questions, missing source types, missing perspectives, weakest findings ranked
3. Output: what was NOT researched, what source types are absent, go/no-go per weak finding
4. Feeds directly into re-research decision — critical blind spots may flip PASS to RE-RESEARCH

### Phase 6: Write Reflection Report

Write to `docs/cariak/synthesized/YYYY-MM-DD-slug/reflection-report.md`:

```markdown
# Reflection Report: [Project]
**Decision:** [PASS / RE-RESEARCH / MANUAL_REVIEW]

## Quality Assessment
- Confidence: [X.XX] (threshold: 0.7) — [PASS/FAIL]
- Sources: [X] total — distribution by type — [PASS/FAIL]
- Coverage: [X%] (threshold: 80%) — unanswered: [list] — [PASS/FAIL]
- Contradictions: [X] unresolved (threshold: 3) — [PASS/FAIL]

## Coverage Gaps
[Prioritized list]

## Source Diversity Assessment
[Over-reliance, geographic bias, temporal bias]

## Recommendations
[If PASS: doc generation steps. If RE-RESEARCH: specific re-run queries and sources.]

## Decision
[PASS / RE-RESEARCH / MANUAL_REVIEW]
```

### Phase 7: Handoff

**If PASS:** "Research passed quality assessment. Options: 1. Generate documents, 2. Validate findings, 3. Save and stop."

**If RE-RESEARCH:** "Research did not pass. Issue: [confidence/coverage/sources]. Iteration [X] of max 2. Options: 1. Re-research (auto-invoke behind confirmation), 2. Accept as-is, 3. Save and stop."

**If MANUAL_REVIEW:** "Research re-run [2] times, thresholds still not met. Remaining issues: [list]. Requires human judgment. Options: 1. Accept as-is, 2. One more iteration, 3. Abort."

### Reference Triggers

| File | Phase |
|---|---|
| references/quality-thresholds.yaml | 5 |
| references/reflection-template.md | 6 |
| references/coverage-matrix.csv | 2 |
| research-spec.md | 1 |
| research-report.md | 1 |
| validation-report.md | 1 |

### Output Path

```
docs/cariak/synthesized/YYYY-MM-DD-slug/
  ├── research-report.md
  ├── references.json
  ├── validation-report.md (optional)
  └── reflection-report.md ← THIS SKILL
```
