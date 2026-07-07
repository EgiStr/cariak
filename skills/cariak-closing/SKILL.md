---
name: cariak-closing
description: Terminal pipeline stage. User invokes after cariak-reflecting marks research PHASE_REVIEWED or after cariak-validating produces verdicts. Reconciles research outcomes against quality thresholds, gates on verdict status (CONFIRMED/REFUTED/INCONCLUSIVE), advances ResearchProject status to COMPLETED via cariak-remembering, and emits a closeout summary. Trigger on "close research", "finalize research", "tutup riset", "closeout", or when a research pipeline reaches its end.
---

# CariaK Closing / Penutupan CariaK

<!-- CARIAK SKILL: cariak-closing - v1.1 -->

## English

### Core Principle

**"Research is not closed until it is archived, summarized, and learnable. A half-closed research project is a knowledge leak."**

Closing is the terminal stage. It does not re-evaluate, re-validate, or re-reflect — it reads what reflection and validation produced, gates closure on their outcomes, and translates them into an archive-and-close or a block. No clean verdict, no close. No memory update, no close.

### Position in Cariak Pipeline

```
pitching → grinding → advising → planning → researching → synthesizing → validating → reflecting → CLOSING
                                                                                                      ↑
                                                                                        User invokes — or
                                                                                        reflecting hands off
                                                                                        (PASS → close)
```

Closing runs after cariak-reflecting returns `PASS` (or after cariak-validating produces verdicts on a reflected project). It is the final skill invoked by the user to seal the research.

### When to Use

- All research phases are complete and reflection has passed
- cariak-reflecting produced `reflection-report.md` with decision: `PASS`
- cariak-validating produced `validation-report.md` with verdicts reconciled
- User says "close research", "finalize", "complete", "tutup riset", "closeout"
- The last active skill (reflecting or validating) hands off
- User wants to export or archive the research

### Do NOT Use

- If reflection is still in progress (run cariak-reflecting first)
- If reflection returned `RE-RESEARCH` — fix gaps first, then re-reflect
- If validation returned `REFUTED` on critical claims without resolution
- If the research project has no `research-report.md` (incomplete pipeline)
- If the user explicitly says "keep it open" or "not done yet"

### Boundary Table

| Adjacent Skill      | Relationship | Handoff Rule                                         |
|---------------------|-------------|------------------------------------------------------|
| cariak-reflecting   | Upstream    | Provides reflection-report.md with PASS/RE-RESEARCH  |
| cariak-validating   | Upstream    | Provides validation-report.md with verdicts          |
| cariak-synthesizing | Upstream    | Provides research-report.md and references.json      |
| cariak-remembering  | Sub-routine | Called to update entity graph (Phase 2)              |
| (Export tools)      | Downstream  | User may export PDFs/ZIP after closing (Phase 4)     |

### Structural Method

This phase uses the real knowledge-preservation method:
- **FAIR Data Principles** (Wilkinson et al., 2016, Scientific Data/Nature) — Findable, Accessible, Interoperable, Reusable.



Load references/research-methods.csv during preflight.

### Hard Gates

#### GATE 0: PREFLIGHT MUST COMPLETE BEFORE CLOSING

Verify all prerequisite artifacts exist:
- `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.md`
- `docs/cariak/synthesized/YYYY-MM-DD-slug/validation-report.md`
- `docs/cariak/synthesized/YYYY-MM-DD-slug/reflection-report.md`
- `docs/cariak/synthesized/YYYY-MM-DD-slug/references.json`

Verify reflection-report.md status is `PASS`.

If any artifact is missing → `CLOSE_BLOCKED: "Missing artifact: <name>. Run the corresponding phase first."`
If reflection status is `RE-RESEARCH` → `CLOSE_BLOCKED: "Reflection returned RE-RESEARCH. Fix gaps and re-reflect before closing."`

#### GATE 1: VERDICT GATE

If any critical claim in validation-report.md is `REFUTED` without documented resolution → `CLOSE_BLOCKED`.

**"Research cannot close with unresolved refutations."**

For each REFUTED claim, check validation-report.md for:
- A documented resolution (e.g., "Claim refuted but scope narrowed", "Refutation accepted — finding removed")
- An explicit note that the refutation has been addressed
If neither exists → the claim blocks closure.

If all claims are `CONFIRMED` or `INCONCLUSIVE` with documented assumptions → gate passes.

#### GATE 2: MEMORY GATE

Must update the Memory MCP before closing. Specifically:
- The ResearchProject entity's `status` field must be set to `COMPLETED`
- All ResearchArtifact entities must have valid file paths on disk
- A relation `ResearchProject` "`has_final_output`" → each ResearchArtifact must exist
- A ResearchSession entity must be created for the closing phase

If memory MCP is unavailable → warn user and proceed with file-only closeout. Do not block.

#### GATE 3: ADVISOR PHASE GATE

Before closing, verify that EVERY phase had its advisor gate passed:

1. Query ResearchSession entities for `advisor_phase` entries for this project.
2. Verify that each Cariak phase that requires an advisor (pitching, grinding, planning, researching, synthesizing, validating, reflecting) has at least one `advisor_phase` session.
3. Check the dialectic for each phase:
   - Pitching: Phase 2d (Devil's Advocate challenge) executed? 
   - Grinding: Phase 2.5 (Methodologist granularity check) executed?
   - Planning: Phase 3.5 (System Architect coverage check) executed?
   - Researching: Phase 4.5 (Per-finding Domain Expert advisor review) executed?
   - Synthesizing: Phase 3.5 (Contradiction Hunter challenge) executed?
   - Validating: Phase 4.5 (Falsificationist challenge) executed?
   - Reflecting: Phase 5.5 (Blind Spot Auditor) executed?

If ANY phase skipped the advisor → `CLOSE_BLOCKED: "Missing advisor gate for phase: <phase_name>. Run the missing advisor challenge before closing."`

**"No close without complete dialectic. Every thesis must have met its antithesis."**

---

### Phase 0: Preflight (Silent Scan)

Run all steps before changing any state. Any failure blocks closure.

1. **Resolve project directory:**
   - Scan `docs/cariak/synthesized/` for the latest project directory (YYYY-MM-DD-slug).
   - If user specifies a slug, use that directory.
   - If no directories exist → `CLOSE_BLOCKED: "No synthesized research found."`

2. **Verify artifact existence (GATE 0):**
   ```
   [ ] research-report.md  — exists, non-empty
   [ ] validation-report.md — exists
   [ ] reflection-report.md — exists
   [ ] references.json      — exists, valid JSON
   ```

3. **Load reflection report:**
   - Extract `decision` field → must be `PASS`.
   - Extract `iteration` count for the closeout summary.
   - If `decision` is `RE-RESEARCH` → GATE 0 blocks.

4. **Load validation report:**
   - Extract all claims and their verdicts.
   - Count: CONFIRMED, REFUTED, INCONCLUSIVE.
   - Identify any REFUTED claims → these are gate candidates.

5. **Load references.json:**
   - Extract total source count.
   - Extract source type distribution (academic, news, social, market, internet).

6. **Load structural method references:**
   - `references/closeout-template.md`

**Output:** Preflight report (silent unless blocked).

---

### Phase 1: Verdict Gate

Reconcile all validation verdicts before allowing close.

1. **Build verdict table from validation-report.md:**
   ```
   | # | Claim                          | Verdict      | Confidence | Resolution |
   |---|--------------------------------|--------------|------------|------------|
   | 1 | "X causes Y in Z context"      | CONFIRMED    | 0.85       | —          |
   | 2 | "A is always preferable to B"  | REFUTED      | 0.72       | Accepted scope limitation |
   | 3 | "C and D are correlated"       | INCONCLUSIVE | 0.45       | Needs longitudinal data |
   ```

2. **Gate on REFUTED claims:**
   For each `REFUTED` claim:
   - Is there a documented resolution in the validation report?
   - If YES → note the resolution and pass.
   - If NO → `CLOSE_BLOCKED: "Claim #N ('<claim text>') is REFUTED with no resolution. Address or acknowledge before closing."`

3. **Gate on criticality:**
   - Critical claim = a claim marked as foundational or high-priority in the research spec.
   - Non-critical REFUTED claims with documented resolutions → pass with a warning.
   - Critical REFUTED claims without resolution → `CLOSE_BLOCKED`.

4. **Build final verdict summary:**
   ```
   Total claims:  N
   CONFIRMED:     X (XX%)
   REFUTED:       Y (YY%) — all resolved
   INCONCLUSIVE:  Z (ZZ%) — documented assumptions
   ```

**Output:** Verdict summary (passes to Phase 2, or blocks).

---

### Phase 2: Memory Close

Update the Memory MCP entity graph to reflect project completion.

1. **Search for existing project entity:**
   ```
   memory_search_nodes(query="{project_slug}")
   ```
   If no entity exists → create one with status `COMPLETED`.
   If entity exists → update it.

2. **Update ResearchProject entity:**
   - Set `status` → `"COMPLETED"`
   - Set `date_completed` → current date (YYYY-MM-DD)
   - Set `confidence_score` → from reflection report
   - Add observation: "Project closed on {date}. Final verdicts: {X} CONFIRMED, {Y} REFUTED (resolved), {Z} INCONCLUSIVE."

3. **Link final artifacts:**
   For each artifact file (research-report.md, validation-report.md, reflection-report.md, references.json):
   - Verify the file exists on disk.
   - Create or update ResearchArtifact entity with:
     - `path`: absolute or relative path
     - `type`: report / validation / reflection / references
     - `phase`: "COMPLETED"
   - Create relation: `ResearchProject "has_final_output" → ResearchArtifact`

4. **Create closing session:**
   - Create ResearchSession entity:
     - `phase`: "CLOSING"
     - `timestamp`: current ISO 8601 datetime
     - `summary`: "Research pipeline closed. See closeout.md for full summary."
   - Create relation: `ResearchProject "HAS_SESSION" → ResearchSession`

5. **If memory MCP unavailable:**
   - Warn: "Memory MCP unavailable. Project status not updated in entity graph. File artifacts are complete."
   - This is graceful degradation — do not block closure.

**Output:** Memory graph updated (or warning issued).

---

### Phase 3: Closeout Summary

Write the terminal artifact: `docs/cariak/synthesized/YYYY-MM-DD-slug/closeout.md`

```
# Research Closeout — [project_name]

**Date:** YYYY-MM-DD
**Status:** COMPLETED
**Pipeline Version:** v1.1

---

## Pipeline Summary

| Phase   | Skill              | Status         | Artifact                    |
|---------|--------------------|----------------|-----------------------------|
| 1       | cariak-pitching    | COMPLETED      | pitch-exploration.md        |
| 2       | cariak-grinding    | COMPLETED      | research-spec.md            |
| 3       | cariak-advising    | COMPLETED      | advisor-counsel.md          |
| 4       | cariak-planning    | COMPLETED      | research-plan.md            |
| 5       | cariak-researching | COMPLETED      | sub-agent findings          |
| 6       | cariak-synthesizing| COMPLETED      | research-report.md          |
| 7       | cariak-validating  | COMPLETED      | validation-report.md        |
| 8       | cariak-reflecting  | PASS           | reflection-report.md        |
| 9       | cariak-closing     | COMPLETED      | closeout.md (this file)     |

---

## Research Outcomes

- **Research Questions:** N total — M fully answered, K partially answered, L unanswered
- **Sources:** N total (Academic: X, Web: Y, Social: Z, News: W, Market: V)
- **Confidence Score:** X.XX / 1.0 (from reflection)
- **Iterations:** N (0 = original research)

---

## Verdict Summary

| # | Claim                                      | Verdict      | Confidence | Resolution                        |
|---|--------------------------------------------|--------------|------------|-----------------------------------|
| 1 | [claim text from validation]               | CONFIRMED    | X.XX       | —                                 |
| 2 | [claim text]                               | REFUTED      | X.XX       | [resolution from validation]      |
| 3 | [claim text]                               | INCONCLUSIVE | X.XX       | [assumption or gap documented]    |

---

## Key Insights

1. [Most important finding — one sentence, evidence-backed]
2. [Second finding]
3. [Third finding]
4. [Fourth finding]
5. [Fifth finding]

---

## Research Gaps

- [Gap 1: description, priority, status]
- [Gap 2: description, priority, status]
- [Gap 3: description, priority, status]

---

## Artifacts Produced

| File                        | Type         | Phase          |
|-----------------------------|--------------|----------------|
| pitch-exploration.md        | pitch        | PITCHING       |
| research-spec.md            | spec         | GRINDING       |
| advisor-counsel.md          | counsel      | ADVISING       |
| research-plan.md            | plan         | PLANNING       |
| research-report.md          | report       | SYNTHESIZING   |
| references.json             | references   | SYNTHESIZING   |
| validation-report.md        | validation   | VALIDATING     |
| reflection-report.md        | reflection   | REFLECTING     |
| closeout.md                 | closeout     | CLOSING        |

---

## Memory Snapshot

- **ResearchProject:** [entity name or ID]
- **Artifacts:** N entities created/updated
- **Sessions:** N sessions recorded
- **Insights:** N insights stored
- **Gaps:** N research gaps identified

---

## Archived

**Date:** YYYY-MM-DD
**Status:** COMPLETED
**Closed by:** cariak-closing v1.1

All artifacts are located in: `docs/cariak/synthesized/YYYY-MM-DD-slug/`
```

---

### Phase 4: Handoff (3-Option Menu)

After the closeout summary is written, present the user with:

```
─────────────────────────────────────────────────
Research closeout written to:
  docs/cariak/synthesized/YYYY-MM-DD-slug/closeout.md

What would you like to do next?
  1. Export all artifacts (generate PDFs or ZIP)
  2. Start new research on a related topic (pitch → close)
  3. Save and exit — research is archived
─────────────────────────────────────────────────
```

- **Option 1:** Triggers export tools (PDF generation via `pdf` skill or ZIP via shell).
- **Option 2:** Prompts the user for a related topic and invokes `cariak-pitching`.
- **Option 3:** Ends the session. Research is fully archived.

---

### Output States

| State            | Meaning                                                                 |
|------------------|-------------------------------------------------------------------------|
| `CLOSED`         | All gates passed, memory updated, closeout.md written                   |
| `CLOSE_BLOCKED`  | Preflight failed, verdict gate blocked, or critical refutation unresolved |
| `ALREADY_CLOSED` | A closeout.md already exists and ResearchProject status is COMPLETED    |

---

### Iron Laws

```
1. NO CLOSE WITH UNRESOLVED REFUTATIONS
   Any REFUTED critical claim without documented resolution → CLOSE_BLOCKED.
   WHY: Closing over an unresolved refutation archives known-false findings as fact.

2. NO CLOSE WITHOUT REFLECTION PASS
   If reflection-report.md decision is RE-RESEARCH → CLOSE_BLOCKED.
   WHY: Reflection is the quality gate. Skipping it ships sub-threshold research.

3. NO CLOSE WITHOUT MEMORY UPDATE
   The ResearchProject entity MUST transition to COMPLETED.
   If memory MCP is down, warn but do NOT block — file artifacts are the source of truth.
   WHY: An open entity in the graph leaks context into future sessions.

4. NO SILENT BLOCK
   Every CLOSE_BLOCKED states: what blocked, why, and what would unblock.
   WHY: "Can't close" without a reason creates deadlock.

5. NO RE-EVALUATION
   Closing reads verdicts and reflection decisions — it never re-reviews claims.
   WHY: Re-evaluating during closing duplicates validating/reflecting and corrupts the audit trail.

6. NO CLOSE WITHOUT COMPLETE DIALECTIC
   Every Cariak phase must have its advisor gate (ANTITHESIS step) passed before close.
   Query ResearchSession entities for advisor_phase entries. Any missing advisor challenge → CLOSE_BLOCKED.
   WHY: Closing without verifying every thesis met its antithesis archives incomplete research. The dialectic is what separates Cariak research from single-perspective search.
```

### Reference Triggers

| Reference                          | When to Load                               |
|------------------------------------|--------------------------------------------|
| `references/closeout-template.md`  | Phase 3: format closeout summary           |
| memory MCP tools                   | Phase 2: update entity graph               |
| `cariak-remembering` skill         | Phase 2: if direct memory tools unavailable |

### Output

- `docs/cariak/synthesized/YYYY-MM-DD-slug/closeout.md`
- Memory MCP entities updated (ResearchProject status → COMPLETED, artifacts linked, closing session created)

---
