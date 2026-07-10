---
name: cariak-closing
description: Terminal pipeline stage. Invoke after cariak-reflecting marks PASS or after cariak-validating produces verdicts. Reconciles outcomes against quality thresholds, gates on verdict status, advances project to COMPLETED, emits closeout summary.
---

# Cariak Closing

## Triggers

| Trigger | When |
|---|---|
| User says | "close research", "finalize", "closeout", pipeline end |
| Prerequisite | reflecting returned `PASS` or validating produced verdicts |
| Blockers | reflecting `RE-RESEARCH`, unresolved REFUTED claims, missing artifacts |

## Boundary

| Skill | Handoff |
|---|---|
| cariak-reflecting | reflection-report.md (PASS/RE-RESEARCH) |
| cariak-validating | validation-report.md with verdicts |
| cariak-synthesizing | research-report.md, references.json |
| cariak-remembering | Sub-routine: update entity graph |

## Gates Overview

| # | Gate | Block Condition | Unblock |
|---|---|---|---|
| 0 | Preflight | Missing artifact or reflection != PASS | Run missing phase or re-reflect |
| 1 | Verdict | REFUTED critical claim w/o resolution | Document resolution or acknowledge |
| 2 | Memory | Failed to update entity graph | Warn + proceed (degradation OK) |
| 3 | Advisor | Any phase skipped its advisor challenge | Run missing advisor challenge |

---

### Phase 0: Preflight

1. Resolve project dir: `docs/cariak/synthesized/YYYY-MM-DD-slug/`
2. Verify artifacts exist:
   - `research-report.md` — non-empty
   - `validation-report.md` — exists
   - `reflection-report.md` — decision = `PASS`
   - `references.json` — valid JSON
3. Missing → `CLOSE_BLOCKED: "Missing artifact: <name>. Run corresponding phase first."`
4. Reflection != PASS → `CLOSE_BLOCKED: "Reflection returned RE-RESEARCH. Fix gaps and re-reflect."`

---

### Phase 1: Verdict Gate

1. Extract claims from validation-report.md
2. For each REFUTED claim: documented resolution? → pass, else → `CLOSE_BLOCKED: "Claim #N '<text>' REFUTED with no resolution."`
3. Critical REFUTED w/o resolution → block; non-critical with resolution → pass with warning
4. Build verdict summary: total claims, CONFIRMED / REFUTED (resolved) / INCONCLUSIVE counts

---

### Phase 2: Memory Close

1. `memory_search_nodes(query="{project_slug}")` — find or create ResearchProject entity
2. Set status → `COMPLETED`, date_completed → YYYY-MM-DD, confidence_score from reflection
3. Add observation: "Project closed on {date}. Final verdicts: X CONFIRMED, Y REFUTED, Z INCONCLUSIVE."
4. For each artifact: create/update ResearchArtifact entity (path, type, phase=COMPLETED), link via `has_final_output`
5. Create ResearchSession (phase=CLOSING, timestamp=ISO8601), link via `HAS_SESSION`
6. Memory MCP unavailable → warn, proceed without block

---

### Phase 3: Closeout Summary

Write `docs/cariak/synthesized/YYYY-MM-DD-slug/closeout.md`:

| Section | Content |
|---|---|
| Pipeline Summary | 9 phases: skill → status → artifact |
| Research Outcomes | Questions answered (all/partial/none), source breakdown, confidence, iterations |
| Verdict Summary | Claim #, text, verdict, confidence, resolution |
| Key Insights | 5 one-line evidence-backed findings |
| Research Gaps | Description, priority, status |
| Artifacts Produced | File path → type → phase |
| Memory Snapshot | Project entity ID, artifact/session/insight/gap counts |

---

### Phase 4: Handoff

Present 3 options:
1. Export artifacts (PDF/ZIP)
2. Start new related research (→ cariak-pitching)
3. Save and exit

---

### Advisor Gate (Gate 3) Check

Before closing, verify every phase had its advisor/antithesis challenge:

| Phase | Required Advisor Challenge |
|---|---|
| Pitching | Devil's Advocate challenge (Phase 2d) |
| Grinding | Methodologist granularity check (Phase 2.5) |
| Planning | System Architect coverage check (Phase 3.5) |
| Researching | Per-finding Domain Expert review (Phase 4.5) |
| Synthesizing | Contradiction Hunter challenge (Phase 3.5) |
| Validating | Falsificationist challenge (Phase 4.5) |
| Reflecting | Blind Spot Auditor (Phase 5.5) |

Any missing → `CLOSE_BLOCKED: "Missing advisor gate for phase: <name>. Run before closing."`

## Iron Laws

1. **No close with unresolved refutations** — REFUTED critical claim w/o resolution → CLOSE_BLOCKED
2. **No close without reflection PASS** — RE-RESEARCH → CLOSE_BLOCKED
3. **No close without memory update** — status must → COMPLETED. Memory down? Warn, don't block.
4. **No silent block** — every CLOSE_BLOCKED states what, why, how to unblock
5. **No re-evaluation** — closing reads verdicts, never re-reviews claims
6. **No close without complete dialectic** — every phase must have its advisor gate passed

## Output States

| State | Meaning |
|---|---|
| `CLOSED` | All gates passed, memory updated, closeout.md written |
| `CLOSE_BLOCKED` | Preflight/verdict/advisor gate failed |
| `ALREADY_CLOSED` | closeout.md exists and status = COMPLETED |

## Output

- `docs/cariak/synthesized/YYYY-MM-DD-slug/closeout.md`
- Memory MCP: ResearchProject → COMPLETED, artifacts linked, closing session created

## Reference Triggers

| Reference | When |
|---|---|
| `references/closeout-template.md` | Phase 3: format closeout |
| memory MCP tools | Phase 2: update graph |
| `cariak-remembering` | Phase 2 fallback |
