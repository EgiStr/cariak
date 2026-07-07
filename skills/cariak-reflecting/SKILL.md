---
name: cariak-reflecting
description: Post-synthesis quality gate. Use AFTER cariak-synthesizing (and optionally after cariak-validating) to assess coverage gaps, confidence thresholds, and source diversity before delivery. Decides whether to PASS (proceed to document generation) or RE-RESEARCH (loop back to cariak-researching, max 2 iterations). Trigger on "reflect", "quality check", "evaluate research", "cek kualitas", "refleksi", or when synthesizing/validating hands off.
---

# CariaK Reflecting / Refleksi CariaK

<!-- CARIAK SKILL: cariak-reflecting - v1.1 -->

## English

### Core Principle

**"Reflection is the quality gate between research and delivery. It checks not just what was found, but what was missed."**

Reflection is not a summary. It is a critical self-assessment that asks: Did we answer the questions? Are we confident? Are the sources diverse enough? What did we miss? If the research does not meet quality thresholds, we loop back — not proceed to delivery.

---

### Structural Method

This phase uses real review-quality methods:
- **AMSTAR 2** (Shea et al., 2017, BMJ) — 16-item checklist assessing methodological quality of completed reviews.
- **PRISMA 2020 Checklist** (Page et al., 2021, BMJ) — 27-item standard for reporting completeness of systematic reviews.


### When to Use

- After cariak-synthesizing produces research-report.md
- After cariak-validating produces validation-report.md (optional, but recommended)
- When the user asks "is this research good enough?"
- When confidence feels low but you cannot articulate why
- Before any document generation or delivery to the user

### Do NOT Use When

- No research-report.md exists (use cariak-researching first)
- The user wants a quick summary, not a quality assessment
- You are still in the researching phase (reflect after, not during)
- The user explicitly says "just deliver what we have" (respect this — skip reflection)

---

### Boundary Table

| If the user wants to... | Use this skill |
|---|---|
| Synthesize findings into a report | cariak-synthesizing |
| Validate specific claims | cariak-validating |
| Check quality and coverage gaps | **cariak-reflecting** (this skill) |
| Save session state | cariak-remembering |
| Generate final documents | (document generation skill, downstream) |

---

### Hard Gates

#### GATE 0: RESEARCH-REPORT MUST EXIST

**REFLECTION REQUIRES ARTIFACTS.** Before beginning reflection, verify:
- `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.md` exists and is non-empty
- `docs/cariak/synthesized/YYYY-MM-DD-slug/references.json` exists and is valid JSON
- If validation was run: `validation-report.md` exists

If artifacts do not exist → ABORT. Tell user: "Reflection requires synthesized research. Run cariak-synthesizing first."

#### GATE 1: MAX 2 RE-RESEARCH LOOPS

**RE-RESEARCH IS NOT INFINITE.** Maximum 2 re-research iterations per project.
- Iteration 0: Original research
- Iteration 1: First re-research (triggered by reflection)
- Iteration 2: Second re-research (triggered by reflection)
- Iteration 3: **MANUAL GATE** — do NOT auto-trigger. Ask user.

Track iteration count in the reflection report. If count >= 2, set decision to MANUAL_REVIEW instead of RE-RESEARCH.

#### GATE 2: MANUAL GATE ON 3RD ITERATION

**HUMAN JUDGMENT REQUIRED.** If re-research iteration count reaches 3:
- DO NOT auto-invoke cariak-researching
- Present the situation to the user with: coverage gaps, confidence scores, source diversity
- Ask: "Research has been re-run 2 times. Quality thresholds are still not met. Options: (a) accept as-is, (b) one more iteration with refined questions, (c) abort."
- Wait for user decision

---

### Quality Thresholds

These thresholds determine PASS vs RE-RESEARCH:

| Metric | Threshold | If Below |
|---|---|---|
| Confidence Score | >= 0.7 | RE-RESEARCH |
| Source Count | >= 5 unique sources | RE-RESEARCH |
| Sub-agent Coverage | All 5 sub-agents returned findings | RE-RESEARCH (re-dispatch missing) |
| Contradiction Count | <= 3 unresolved contradictions | RE-RESEARCH |
| Question Coverage | >= 80% of research questions answered | RE-RESEARCH |
| Technical Depth | Technical reports include first principles, methods, architecture, data, metrics, failure modes, alternatives | RE-RESEARCH |
| Implementation Actionability | Report answers what to build first, how to test it, and what to avoid | RE-RESEARCH |

**If ANY threshold is below minimum → decision = RE-RESEARCH**

**If ALL thresholds are met → decision = PASS**

---

### Phase 0: Preflight

Before beginning reflection:

1. **Verify artifacts exist** (GATE 0)
2. **Load structural method references:**
   - `references/quality-thresholds.yaml`
   - `references/reflection-template.md`
3. **Check memory MCP** for project context:
   - Search for project entity: `memory_search_nodes(query="{project_name}")`
   - Retrieve session history
4. **Load research artifacts:**
   - Read `research-report.md`
   - Read `references.json`
   - Read `validation-report.md` if it exists
   - Read original `research-spec.md` and `research-plan.md` for comparison
4. **Determine re-research iteration count** from memory or file system (check for `-iter1`, `-iter2` suffixes)
5. **Initialize reflection checklist:**
   ```
   Project: [name]
   Iteration: [0/1/2/3]
   Artifacts loaded: [list]
   ```

**Output:** Preflight complete — ready to assess.

---

### Phase 1: Load Research Report + Validation

Load and parse the research artifacts:

1. **Parse research-report.md:**
   - Extract key claims and findings
   - Extract confidence score (if computed by synthesizing)
   - Extract source count
   - Extract contradiction mentions

2. **Parse validation-report.md (if exists):**
   - Extract verdicts: Confirmed / Refuted / Inconclusive
   - Count each category
   - Identify refuted claims (these are red flags)

3. **Parse references.json:**
   - Count unique sources
   - Check source diversity (by type: academic, news, social, market, internet)
   - Identify any sources with low credibility markers

4. **Parse original research-spec.md:**
   - Extract the list of research questions
   - These are the benchmark for coverage assessment

---

### Phase 2: Assess Coverage Gaps

Compare what was asked vs what was answered:

1. **Question-by-question audit:**
   For each research question from research-spec.md:
   - Was it addressed in the research report? (Y/N)
   - Was it answered with evidence? (Y/N)
   - Was it answered with sufficient depth? (Y/N/Partial)
   - Confidence level for this answer (0.0-1.0)

2. **Identify gaps:**
   - Questions not addressed at all
   - Questions addressed but without evidence
   - Questions with confidence < 0.5
   - Sub-topics that emerged during research but were not explored

3. **Source coverage map:**
   ```
   | Source Type | Sources Found | Coverage |
   |---|---|---|
   | Academic | [count] | [Good/Sparse/None] |
   | News | [count] | [Good/Sparse/None] |
   | Social | [count] | [Good/Sparse/None] |
   | Market | [count] | [Good/Sparse/None] |
   | Internet | [count] | [Good/Sparse/None] |
   ```

4. **Temporal coverage:**
   - What date range do the sources cover?
   - Are there recent developments (< 6 months) that were missed?
   - Are there historical precedents that were missed?

---

### Phase 3: Check Confidence Thresholds

1. **Overall confidence score** (from synthesizing or recomputed):
   - If >= 0.7: PASS this threshold
   - If < 0.7: FAIL this threshold

2. **Per-question confidence:**
   - Compute average confidence per question
   - Identify questions with confidence < 0.5 (high risk)

3. **Per-source-type confidence:**
   - Are findings overly reliant on one source type?
   - Example: if 90% of citations are from social media, confidence in academic rigor is low

4. **Validation verdict distribution:**
   - If validation was run:
     - Confirmed: [count] — good
     - Refuted: [count] — red flag, each refutation needs addressing
     - Inconclusive: [count] — moderate risk
   - If > 30% of claims are Inconclusive → FAIL this threshold

---

### Phase 4: Evaluate Source Diversity

1. **Source type distribution:**
   ```
   Academic: [X] sources ([X%])
   News: [X] sources ([X%])
   Social: [X] sources ([X%])
   Market: [X] sources ([X%])
   Internet: [X] sources ([X%])
   ```

2. **Diversity assessment:**
   - Is any source type > 60% of total? → Over-reliance risk
   - Is any source type 0? → Coverage gap
   - Are sources from diverse publishers/platforms? (not all from same blog)

3. **Geographic and linguistic diversity:**
   - Are all sources from one country/region?
   - Are all sources in one language?
   - Could relevant non-English sources exist?

4. **Temporal diversity:**
   - Are all sources from the same time period?
   - Is there a recency bias (only last 6 months)?
   - Is there a legacy bias (only old, established sources)?

---

### Phase 4.1: Technical Report Quality Audit

If the report is technical, audit whether it is implementation-ready:

| Check | Pass condition |
|---|---|
| First principles | Explains why the method can work, not just that it works |
| Field methods | Covers what industry or operators actually use |
| Architecture | Shows components, data flow, deployment target, integration points |
| Data strategy | Lists data, labels, calibration, sampling, and quality risks |
| Evaluation | Defines metrics, baseline, thresholds, validation design |
| Failure modes | Lists production risks and mitigations |
| Alternatives | Includes simpler, non-AI, commercial, and hybrid options |
| Roadmap | Gives phases, exit criteria, and first build step |

If any check fails, decision = RE-RESEARCH unless the user explicitly accepts the limitation.

### Phase 5: Decision — PASS or RE-RESEARCH

Based on all assessments:

#### PASS Conditions (ALL must be true):
- Confidence >= 0.7
- Source count >= 5
- All 5 sub-agents returned findings
- Unresolved contradictions <= 3
- Question coverage >= 80%
- No critical gaps identified
- Blind Spot Audit (Phase 5.5) completed and findings incorporated

→ **Decision: PASS. Proceed to document generation or delivery.**

#### RE-RESEARCH Conditions (ANY one triggers):
- Confidence < 0.7
- Source count < 5
- Any sub-agent missing
- Unresolved contradictions > 3
- Question coverage < 80%
- Critical gaps identified

→ **Decision: RE-RESEARCH. Loop back to cariak-researching with refined questions.**

#### MANUAL_REVIEW Conditions:
- Re-research iteration count >= 2
- Thresholds still not met after 2 iterations

→ **Decision: MANUAL_REVIEW. Ask user.** (GATE 2)

---

### Phase 5.5: Blind Spot Audit (ANTITHESIS)

**Goal:** Dispatch a Blind Spot Auditor advisor to identify what was NOT researched and what source types are under-represented.

This is the THESIS → ANTITHESIS step. The quality assessment (Phases 1-5) is the thesis. Now an independent advisor must audit what the assessment itself missed.

1. **Dispatch a Blind Spot Auditor advisor sub-agent** (via `cariak-advising`):
   - The advisor is a **different model/persona**, not self-critique.
   - The advisor's job: find research areas, source types, and perspectives that were never explored.
   - The advisor MUST cite specific examples of missing research angles.
2. **Advisor challenge questions:**
   - "What did we NOT research? What questions did we never ask?"
   - "What source types are under-represented or completely absent?"
   - "What perspectives (geographic, demographic, ideological) are missing from the research?"
   - "What is the single weakest finding that needs re-research?"
   - "If we had to re-do this research with unlimited resources, what would we investigate differently?"
3. **Advisor returns:**
   - List of un-researched questions and angles.
   - Source types absent from the research.
   - Missing perspectives and their potential impact on findings.
   - Ranked list of weakest findings (with reasoning).
   - Go/no-go recommendation on re-research for each weak finding.

**Output:** Blind Spot Audit report — un-researched areas, missing source types, weakest findings ranked. This feeds directly into the re-research decision: if the audit finds critical blind spots, the decision may flip from PASS to RE-RESEARCH.

### Phase 6: Write Reflection Report

Write to: `docs/cariak/synthesized/YYYY-MM-DD-slug/reflection-report.md`

**Template:**
```markdown
# Reflection Report: [Project Name]

**Date:** YYYY-MM-DD
**Iteration:** [0/1/2/3]
**Decision:** [PASS / RE-RESEARCH / MANUAL_REVIEW]

## Executive Summary

[1-2 paragraph summary of assessment]

## Quality Assessment

### Confidence Score
- Overall: [X.XX] (threshold: 0.7)
- Per-question average: [X.XX]
- Status: [PASS/FAIL]

### Source Count
- Total unique sources: [X] (threshold: 5)
- Source type distribution:
  - Academic: [X]
  - News: [X]
  - Social: [X]
  - Market: [X]
  - Internet: [X]
- Status: [PASS/FAIL]

### Question Coverage
- Questions addressed: [X/[total]]
- Coverage rate: [X%] (threshold: 80%)
- Questions not addressed:
  1. [question text]
  2. [question text]
- Status: [PASS/FAIL]

### Contradiction Resolution
- Unresolved contradictions: [X] (threshold: 3)
- Resolved contradictions: [X]
- Status: [PASS/FAIL]

### Validation Results (if applicable)
- Confirmed claims: [X]
- Refuted claims: [X]
- Inconclusive claims: [X]
- Status: [PASS/FAIL]

## Coverage Gaps

[List of identified gaps with priority: High/Medium/Low]

## Source Diversity Assessment

[Assessment of over-reliance, geographic bias, temporal bias]

## Recommendations

[If PASS: recommendations for document generation]
[If RE-RESEARCH: specific questions to re-run, sources to target, sub-agents to re-dispatch]

## Decision

**[PASS / RE-RESEARCH / MANUAL_REVIEW]**

[Reasoning for decision]
```

---

### Phase 7: Handoff

After writing the reflection report, present the decision to the user:

#### If PASS:
"The research has passed quality assessment. 
- Confidence: [X.XX]
- Sources: [X]
- Coverage: [X%]

Options:
1. **Proceed to document generation** — generate final deliverable
2. **Validate findings** — run cariak-validating for claim verification
3. **Save and stop** — archive research"

#### If RE-RESEARCH:
"The research did not pass quality assessment.
- Issue: [confidence/coverage/sources/contradictions]
- Iteration: [current] of max 2

Options:
1. **Re-research** — loop back to cariak-researching with refined questions (auto-invoke behind confirmation)
2. **Accept as-is** — proceed despite quality issues
3. **Save and stop** — archive for later"

#### If MANUAL_REVIEW (GATE 2):
"Research has been re-run [2] times. Quality thresholds are still not met.
- Remaining issues: [list]

This requires human judgment:
1. **Accept as-is** — proceed with current research
2. **One more iteration** — with manually refined questions
3. **Abort** — stop research"

---

### Reference Triggers

| Trigger | Location | Used in Phase |
|---|---|---|
| `references/quality-thresholds.yaml` | references/ | Phase 5 (Decision) |
| `references/reflection-template.md` | references/ | Phase 6 (Write Report) |
| `references/coverage-matrix.csv` | references/ | Phase 2 (Coverage) |
| `references/clear-questions.md` | references/ | Phase 1 (Question Review) |
| `research-spec.md` | `docs/cariak/spec/` | Phase 1 (Load) |
| `research-report.md` | `docs/cariak/synthesized/` | Phase 1 (Load) |
| `validation-report.md` | `docs/cariak/synthesized/` | Phase 1 (Load) |

---

### Output Path

```
docs/cariak/synthesized/YYYY-MM-DD-slug/
  ├── research-report.md       (from synthesizing)
  ├── references.json          (from synthesizing)
  ├── validation-report.md     (from validating, optional)
  └── reflection-report.md     ← THIS SKILL OUTPUT
```

---
