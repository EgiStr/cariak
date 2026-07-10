---
name: cariak-planning
description: Decompose a research spec into executable sub-agent tasks. Use AFTER cariak-grinding when the research-spec.md exists and before cariak-researching. Routes output documents from Clarify Gate responses, maps every research question to specific sources and sub-agents, then builds a research plan. Trigger on "plan research", "research plan", "decompose research", or when cariak-grinding hands off.
---

# Research Planning

<!-- CARIAK SKILL: cariak-planning - v1.1 -->

### When to Use

- cariak-grinding produced research-spec.md and handed off
- User says "plan research", "research plan", "decompose"
- Spec exists but no plan built yet
- Re-planning after cariak-reflecting triggered re-research loop

### Do NOT Use

- No research-spec.md → use cariak-grinding first
- User wants to refine problem → use cariak-pitching
- Spec and plan exist, user wants execution → use cariak-researching
- User wants advisor counsel on spec → use cariak-advising

### Boundary Table

| Skill | Relationship | Rule |
|---|---|---|
| cariak-grinding | Upstream | Produces research-spec.md. Planning doesn't modify it. |
| cariak-researching | Downstream | Consumes research-plan.md. Researching doesn't deviate. |
| cariak-advising | Lateral | May be called to validate source selection. |
| cariak-reflecting | Feedback | May trigger re-planning if coverage gaps found. |

### Hard Gates

**GATE 0: Spec Verification.** research-spec.md must exist with ≥1 RQ block (GWT format), Scope section, Success Metrics section. Technical topics need Engineering Lens section. If any missing, STOP.

**GATE 1: Every RQ must have assigned sub-agent with ≥1 query.**

**GATE 1.5: Advisor Coverage Challenge mandatory (ANTITHESIS) before final plan.** System Architect + Ops Reviewer must check task independence, granularity, hidden dependencies.

**GATE 2: User must approve plan before dispatch.**

### Phase 0: Preflight

1. Check Memory MCP: `memory_search_nodes(query: "research project <slug>")`
2. Scan for existing research-spec.md in `docs/cariak/spec/`
3. Load references: source-taxonomy.csv, citation-standards.csv
4. Identify working directory slug

**Gate 0 check:** Verify spec exists and is well-formed.

### Phase 1: Parse Spec

1. Read research-spec.md
2. Extract: RQs with GWT blocks, scope constraints, success metrics, Clarify Gate responses
3. Build internal question registry: RQ-1, RQ-2, ...
4. If Engineering Lens exists, build implementation evidence registry mapping each lens to source types (e.g., First principles → academic + official docs + standards)

### Phase 2: Route Output Documents

Based on Clarify Gate responses, determine which documents to produce:

| Document | Primary | Fallback |
|---|---|---|
| research-report | .docx | .md |
| executive-summary | .docx | .md |
| technical-deep-dive | .docx | .md |
| comparison-matrix | .docx | .md |
| feasibility-study | .docx | .md |
| prd | .docx | .md |
| tech-spec | .docx | .md |
| adr | .docx | .md |
| risk-register | .docx | .md |
| literature-review | .docx | .md |
| experiment-design | .docx | .md |
| implementation-roadmap | .docx | .md |
| research-proposal | .docx | .md |

Generation: `npx cariak-pi report --template [template]`

### Phase 3: Decompose to Sub-agent Tasks

Per RQ:
- "How does X work?" → internet-researcher, academic-researcher
- "What do people think?" → social-researcher, news-researcher
- "Market size?" → market-researcher, news-researcher
- "Academic evidence?" → academic-researcher
- "Latest developments?" → news-researcher, social-researcher

Craft 2-4 queries per agent per RQ using keywords, synonyms, alternative phrasings.

**Gate 1 check:** Every RQ has ≥1 assignment with queries.

### Phase 3.1: Implementation Evidence Plan (Technical Only)

If spec has Engineering Lens, add evidence plan:

| Evidence type | Sources | Example |
|---|---|---|
| Repositories | GitHub, GitLab, SDKs | `topic implementation github` |
| Official docs | vendor docs, standards | `topic calibration guide` |
| Benchmarks | papers, MLPerf, vendors | `topic benchmark accuracy` |
| Datasets/model cards | Kaggle, HF, portals | `topic dataset` |
| Standards/patents | ISO, IEEE, WIPO | `topic standard` |
| Commercial products | product pages, pricing | `topic industrial system` |
| Field practice | case studies, ops docs | `topic production failure` |

### Phase 3.5: Advisor Coverage Check (ANTITHESIS)

1. Dispatch System Architect + Ops Reviewer via cariak-advising (different model/persona)
2. Advisor checks: task independence, granularity, hidden dependencies, parallel safety, <10 min per task
3. Output feeds into Phase 4

### Phase 4: Build Research Plan

Write `docs/cariak/spec/YYYY-MM-DD-slug/research-plan.md`:

```markdown
# Research Plan: [Topic]
**Spec:** docs/cariak/spec/YYYY-MM-DD-slug/research-spec.md

## Output Documents
- [ ] research-report.docx
- [ ] research-report.md
- [ ] references.json

## Sub-agent Assignments
### RQ-1: [Question]
- **internet-researcher**: queries: ["q1", "q2"], sources: blogs, engineering posts
- **academic-researcher**: queries: ["q1", "q2"], sources: arXiv, Semantic Scholar

### RQ-2: ...

## Implementation Evidence Plan

## Execution Order
All sub-agents dispatched in parallel.
```

Store plan path in Memory MCP (ResearchArtifact type: plan).

### Phase 5: Handoff

Present to user: "Research plan ready: [path]. [X sub-agents, Y queries, Z sources]. Options: 1. Execute → cariak-researching, 2. Modify, 3. Save and stop."

**Gate 2 check:** Wait for user confirmation.

### Reference Triggers

| File | Phase |
|---|---|
| references/source-taxonomy.csv | 3 |
| references/citation-standards.csv | 4 |
| subagents/*.md | 3 |
| research-spec.md | 1 |

### Handoff Artifact

- Primary: `docs/cariak/spec/YYYY-MM-DD-slug/research-plan.md`
- Memory MCP: ResearchArtifact entity
- Target: cariak-researching (on user confirmation)
