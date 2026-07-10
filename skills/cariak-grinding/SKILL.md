---
name: cariak-grinding
description: Refine a pitch into a precise research specification. Use AFTER cariak-pitching (or when a pitch-exploration.md exists) to convert divergent directions into sharp, testable research questions. Produces a research-spec.md with BDD-style Given/When/Then research questions, scope boundaries, and success metrics. Trigger on "refine research", "grind research", "research spec", "spec riset", or when cariak-pitching hands off.
---

# cariak-grinding

<!-- CARIAK SKILL: cariak-grinding - v1.1 -->

### When to Use

- pitch-exploration.md exists and user wants to refine into research questions
- cariak-pitching hands off with confirmed pitch brief
- User says "refine", "grind", "make a spec", "sharpen the questions"
- Research directions lack testable specificity

### Do NOT Use

- No pitch-exploration.md → invoke cariak-pitching first
- User wants broad exploration → use cariak-pitching
- research-spec.md exists and needs execution → use cariak-planning

### Boundary Table

| Adjacent Skill | Relationship |
|---|---|
| cariak-pitching | Predecessor — provides pitch-exploration.md |
| cariak-advising | Parallel — can stress-test research questions |
| cariak-planning | Successor — consumes research-spec.md |
| cariak-remembering | Throughout — stores decisions and state |

### Hard Gates

**GATE 0:** Scan project context (spec dirs, memory MCP) before parsing pitch.
**GATE 1:** Pitch MUST exist with ≥1 confirmed research direction. If not, STOP and invoke cariak-pitching.
**GATE 2:** Every GWT must trace back to a pitch research direction. No orphan questions.
**GATE 2.5:** Methodologist + Skeptic advisor challenge mandatory before scope definition. Do not skip antithesis step.
**GATE 3:** User must approve spec before handoff to planning.

### Phase 0: Preflight

1. Check memory MCP: `memory_search_nodes(query: "research project")`
2. Scan `docs/cariak/spec/` for existing pitch-exploration.md
3. If pitch exists, extract: problem statement, research directions (2-3), advisor counsel notes, user confirmed direction
4. If no pitch, invoke cariak-pitching

### Phase 1: Parse Pitch

1. Read pitch-exploration.md
2. Extract confirmed research direction(s)
3. Identify implicit assumptions and unknowns
4. List knowledge gaps research must address

### Phase 2: Refine Research Questions (BDD GWT)

Transform each direction into BDD-style questions:

```
GIVEN [context]
WHEN [research action]
THEN [expected finding]
```

Produce 3-5 GWT per direction. Use question-frameworks.csv: 5W1H, PESTLE, First Principles, MECE, Hypothesis-Driven.

### Phase 2.1: Engineering Lens Canvas (Technical Topics Only)

Mandatory for: CV, weight estimation, edge inference, sensors, production ML, data pipelines, APIs, databases, security, DevOps.

| Lens | Required answer |
|---|---|
| First principles | What mechanism makes the solution possible? |
| State of the art | What methods appear in papers/products/practice? |
| Field practice | What is actually done in industry? |
| Implementation architecture | Components, data flow, interfaces, deployment targets |
| Data strategy | Data, labels, calibration, sampling required |
| Evaluation protocol | Metrics, baselines, acceptance thresholds |
| Failure modes | What breaks in production? |
| Tradeoffs | Accuracy vs cost vs latency vs complexity |
| Alternatives | Simpler, non-AI, commercial, hybrid approaches |
| Unknowns | What must be prototyped before commitment? |

**Gate:** If report wouldn't let an engineer plan implementation, spec is incomplete.

### Phase 2.5: Advisor Granularity Check (ANTITHESIS)

1. Dispatch Methodologist + Skeptic advisor via cariak-advising (different model/persona)
2. Advisor checks: granularity, testability, edge cases, implicit assumptions
3. Advisor MUST cite sources for challenges
4. Output feeds into Phase 3 scope definitions

### Phase 3: Define Scope & Success Metrics

Per RQ: in-scope, out-of-scope, success metric (e.g., "≥5 independent sources", "confidence ≥ 0.7"), failure condition.

### Phase 4: Write Spec

Write `docs/cariak/spec/YYYY-MM-DD-slug/research-spec.md`:

```markdown
# Research Specification: [Title]
**Date:** YYYY-MM-DD **Status:** Draft / Approved

## Problem Statement

## Research Questions
### RQ1: [title]
**GIVEN** [context] **WHEN** [action] **THEN** [finding]
**In-scope:** ... **Out-of-scope:** ... **Success metric:** ... **Failure condition:** ...

## Engineering Lens (technical topics)
| Lens | Research need | Source targets | Success evidence |
|---|---|---|---|

## Scope & Boundaries

## Success Metrics

## Risk Register
| Risk | Likelihood | Impact | Mitigation |

## Output Document Plan
- [ ] research-report.md
- [ ] validation-report.md

## Advisor Counsel
```

### Phase 5: Handoff

Present spec to user. Options:
1. Invoke cariak-planning
2. Iterate (loop to Phase 2)
3. Save and stop

### Reference Triggers

| File | Phase | Purpose |
|---|---|---|
| `references/question-frameworks.csv` | 2 | Frameworks for research questions |
| `references/research-spec-template.md` | 4 | Spec structure template |
| `references/advisor-personas.csv` | 2 (opt) | Advisor stress-test |
