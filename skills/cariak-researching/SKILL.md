---
name: cariak-researching
description: Execute research by dispatching 6 parallel sub-agents across internet, social, academic, news, market, and domain-expert domains. Use AFTER cariak-planning produces a research-plan.md. Each sub-agent searches its domain, cites every source, and produces a findings.md file. Trigger on "execute research", "run research", "start research", or when cariak-planning hands off with an approved plan.
---

# cariak-researching

<!-- CARIAK SKILL: cariak-researching - v1.1 -->

### When to Use

- cariak-planning produced approved research-plan.md
- User says "execute research"/"run the plan"/"start searching"
- Previous research failed quality gates; cariak-reflecting triggered re-research loop
- Re-run specific sub-agent with adjusted queries

### Do NOT Use

- No research-plan.md (use cariak-planning first)
- Vague question (use cariak-pitching → cariak-grinding)
- Quick answer needed
- Single domain needed (call sub-agent directly)

### Boundary Table

| Skill | Relationship |
|---|---|
| cariak-planning | Upstream — provides plan |
| cariak-synthesizing | Downstream — consumes findings |
| cariak-reflecting | Loop target (max 2 iterations) |
| cariak-advising | Orthogonal — mid-research if needed |
| Sub-agents | Children — dispatched by this skill |

### Hard Gates

**GATE 0:** research-plan.md must exist with ≥1 RQ, source taxonomy, output path.
**GATE 1:** All sub-agents dispatched in ONE parallel call. Sequential → ABORT.
**GATE 2:** No silent block. Empty results → return findings.md with "No results found" + attempted queries.
**GATE 3:** Every finding must cite source. Uncited → rejected.
**GATE 4:** Per-finding advisor review mandatory (ANTITHESIS). Domain Expert reviews each findings file in parallel. If flagged → re-dispatch before handoff.

### Phase 0: Preflight

Check Memory MCP. Verify research-plan.md exists. Parse: RQs, sub-agents, queries, Implementation Evidence Plan, output path. Create `docs/cariak/research/YYYY-MM-DD-slug/`. Check re-research flag from cariak-reflecting.

### Phase 1: Load Plan

Build dispatch payloads per sub-agent: questions, queries, source_taxonomy, citation_standard, output_path, depth. If Implementation Evidence Plan exists, add targets (repos, docs, benchmarks, datasets, standards, products, field practice).

### Phase 2: Dispatch 6 Sub-Agents IN PARALLEL

| Agent | Domain | Tools |
|---|---|---|
| internet-researcher | Blogs, articles | search_web, search_exa, fetch_web_page, tavily_search |
| social-researcher | X, Reddit, GitHub, HN, SO | search_reddit, search_hackernews, search_github, search_x |
| academic-researcher | arXiv, PubMed, Semantic Scholar, CrossRef, OpenAlex, DOAJ | search_arxiv, search_pubmed, search_semantic, search_crossref, search_openalex, search_doaj |
| news-researcher | News, industry reports | search_web (news), tavily_search |
| market-researcher | Market data, competitors | search_web, search_exa, tavily_search |
| domain-expert-researcher | Domain science | search_web, search_arxiv, paper-search, tavily_search |

Each: execute searches, deduplicate, extract findings with inline citations, write findings.md, return summary.

### Phase 3: Collect Results

Verify all 6 files exist. Check: non-empty (GATE 2), ≥1 cited source (GATE 3), bibliography. Missing/empty → re-dispatch. If re-dispatch fails → mark "NO RESULTS".

### Phase 4: Quick Audit

Per file: citation coverage (every claim cited), source diversity (≥3 unique), query coverage (all RQs addressed), contradiction/bias flags noted, implementation evidence present for technical topics.

### Phase 4.5: Per-Finding Advisor Review (ANTITHESIS)

For each findings file, dispatch Domain Expert advisor IN PARALLEL (different model/persona). Check bias, source quality, missing counter-evidence, confidence. Advisor must cite sources. Returns: bias assessment, missing evidence, confidence reassessment, accept/re-research/supplement recommendation.

### Phase 5: Handoff

Present: "Research complete — 6 findings files. Output: [path]. [1] Synthesize [2] Re-run sub-agent [3] Save." If all complete with no flags → auto-invoke cariak-synthesizing behind confirmation.

### Reference Triggers

| File | Phase | Purpose |
|---|---|---|
| references/source-taxonomy.csv | 1 | Allowed sources per sub-agent |
| subagents/*.md | 2 | Tool lists, output formats |
| research-plan.md | 0, 1 | Queries and assignments |
| Memory MCP | 0 | Project context, re-research flags |
