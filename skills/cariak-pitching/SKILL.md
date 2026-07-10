---
name: cariak-pitching
description: Pre-research problem exploration. Use BEFORE cariak-grinding when the research problem is unformed or needs exploration. Guides diverge→converge with structured brainstorming methods (from brainstorming-methods.csv) and LLM-to-LLM advisor curation (advisor tool), then produces a pitch exploration doc with problem statement and 2-3 research directions. Trigger on "cariak", "research this", "I want to explore", "deep research", or when no clear research problem definition exists yet.
---

# Cariak Pitching

<!-- CARIAK SKILL: cariak-pitching - v1.1 -->

**Core Principle:** "Diverge first, converge second. Never propose research directions until the problem is fully explored."

## Entry Criteria

| Use When | Do NOT Use |
|---|---|
| Problem vague, unformed, needs exploration | Problem clearly defined → `cariak-grinding` |
| User says "cariak", "research this", "explore this" | `research-spec.md` exists → `cariak-grinding`/`-planning` |
| New project, no clear direction | "brainstorm" keyword alone → `cariak-grinding` |
| No `pitch-exploration.md` in `docs/cariak/spec/` | Pitch exists & wants refinement → `cariak-grinding` |

## Boundaries

| vs cariak-grinding | vs cariak-advising |
|---|---|
| Purpose: explore problem space → specify questions | Pitching calls advising in Phase 3; advisors return counsel, pitching owns converge |
| Output: 2-3 directions → BDD GWT spec | |
| Input: user intent → pitch-exploration.md | |

## Hard Gates

**G0 — PREFLIGHT:** Scan `docs/cariak/spec/`, query memory MCP, load `brainstorming-methods.csv`, `advisor-personas.csv`, `pitch-brief-template.md`. Degrade gracefully on missing files.

**G1 — CONFIRMATION:** User must explicitly confirm problem statement in own words. Vague approval not enough.

**G2 — ANTITHESIS:** Mandatory dialectic: Phase 2=THESIS, Phase 2d=ANTITHESIS (Devil's Advocate), Phase 3=SYNTHESIS. Never skip antithesis.

**G3 — APPROVAL:** Present pitch-exploration.md, ask "Approve? (yes/modify/reject)". No grinding without approval.

## Phase 0: Preflight

Silently: scan `docs/cariak/spec/` for existing docs, `memory_search_nodes()` for `ResearchProject` entities, load `brainstorming-methods.csv`, `advisor-personas.csv`, `pitch-brief-template.md`. Degrade gracefully.

## Phase 1: Clarify

Ask ONE AT A TIME: Intent → Scope → Audience → Depth → Doc-routing. Synthesize problem statement:
```
**Problem:** [1-2 sentences]  **Scope:** in/out  **Audience:**  **Depth:**  **Docs:**
```
**G1:** User must confirm or correct explicitly.

## Phase 2: Diverge

Select 3-5 methods from `brainstorming-methods.csv` (match `best_for` column). Run each:
```
### Method: [name]  **Row:** [N]  **Output:** [method output]
```
Output all to conversation. Do not filter.

## Phase 2d: Advisor Challenge (ANTITHESIS)

Dispatch Devil's Advocate via `cariak-advising` (different persona, not self-critique). Challenges: right question? untested assumptions? missing angles? biases? counter-perspectives? Returns: blind spots, missing angles, assumptions, recommendations. **G2:** all method results must output before challenge.

## Phase 3: Advisor Counsel (SYNTHESIS)

Select 3-5 personas from `advisor-personas.csv` (≥1 skeptic, ≥1 domain expert). Call `cariak-advising` with: problem statement + method outputs + challenge + personas. Each returns: blind spots, directions (explore/drop), missed questions.

## Phase 4: Converge

Synthesize → 2-3 research directions (exactly):
```
### Direction [N]: [name]  **Angle:**  **RQ:**  **Pros:**  **Cons:**  **Risk:**  **Advisors:**  **Sources:**
```

## Phase 5: Pitch Doc

Write to `docs/cariak/spec/YYYY-MM-DD-[slug]/pitch-exploration.md` using `pitch-brief-template.md`:
```
# Pitch: [Topic]  ## Problem  ## Scope  ## Brainstorming Methods |Method|Purpose|Output|
## Advisor Summary  ## Directions (1-3)  ## Output Plan  ## Handoff→cariak-grinding
```
**G3:** Present path, get explicit approval.

## Phase 6: Handoff

```
1. Grind → cariak-grinding (ask which direction)
2. Iterate → return to Phase 2 or 4
3. Save → cariak-remembering
```

## Reference Triggers

| Reference | When |
|---|---|
| `references/brainstorming-methods.csv` | Phase 2: method selection |
| `references/method-selection.md` | Phase 2: selection criteria & fallback |
| `references/advisor-personas.csv` | Phase 3: persona selection |
| `references/pitch-brief-template.md` | Phase 5: doc format |
| Memory MCP | Phase 0: project context |

## Output

`docs/cariak/spec/YYYY-MM-DD-[slug]/pitch-exploration.md`
