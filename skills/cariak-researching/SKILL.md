---
name: cariak-researching
description: Execute research by dispatching 5 parallel sub-agents across internet, social, academic, news, and market domains. Use AFTER cariak-planning produces a research-plan.md. Each sub-agent searches its domain, cites every source, and produces a findings.md file. Trigger on "execute research", "run research", "start research", "jalankan riset", "eksekusi riset", or when cariak-planning hands off with an approved plan.
---

# cariak-researching / Kemampuan-Penelitian-Cariak

<!-- CARIAK SKILL: cariak-researching - v1.1 -->

## English

### Core Principle

**Parallel lenses, convergent synthesis. Every source cited, every claim traced.**

Research is not a single-threaded Google search. It is the simultaneous deployment of multiple specialized lenses—each with its own source taxonomy, citation standards, and bias profile—whose findings are later reconciled into a single coherent report. No finding enters the synthesis without a source. No source enters without a citation.

### Structural Method

This phase uses real methods:
- **OSINT Cycle** (NATO, 2001 — Direction → Collection → Processing → Analysis → Dissemination) for multi-source intelligence gathering across surface web, deep web, social media, academic databases, news, and market data.
- **Cochrane Systematic Search** (Higgins & Green, 2011, Cochrane Handbook Chapter 4) for reproducible database search strategy.



Load references/research-methods.csv during preflight.

### When to Use

- `cariak-planning` has produced an approved `research-plan.md`
- User explicitly says "execute research", "run the plan", "start searching"
- A previous research round failed quality gates and `cariak-reflecting` triggered a re-research loop
- User wants to re-run a specific sub-agent with adjusted queries

### Do NOT Use

- No `research-plan.md` exists (use `cariak-planning` first)
- The research question is still vague (use `cariak-pitching` → `cariak-grinding`)
- User only wants a quick answer, not a deep research cycle
- Only one source domain is relevant (call the specific sub-agent directly)

### Boundary Table

| Adjacent Skill | Relationship | Boundary Rule |
|---|---|---|
| `cariak-planning` | **Upstream** — provides the plan | Cannot start without approved `research-plan.md` |
| `cariak-synthesizing` | **Downstream** — consumes findings | Hands off all 5 findings files |
| `cariak-reflecting` | **Loop target** — may send back | Re-research loops return here, max 2 iterations |
| `cariak-advising` | **Orthogonal** — can be called mid-research | Only if sub-agent findings reveal a critical perspective gap |
| Sub-agents | **Children** — dispatched by this skill | This skill orchestrates; sub-agents execute |

### Hard Gates

```
GATE 0: PLAN VERIFICATION
  The research-plan.md MUST exist and MUST contain:
    - At least one research question with assigned sub-agents
    - Source taxonomy references
    - Output path defined
  If MISSING → halt and invoke cariak-planning

GATE 1: ALL SUB-AGENTS DISPATCHED IN ONE PARALLEL CALL
  All 5 sub-agents (internet, social, academic, news, market) MUST be
  dispatched in a SINGLE message with parallel tool calls.
  If dispatched sequentially → ABORT and re-dispatch in parallel.
  Rationale: parallelism is the entire point. Sequential execution
  defeats the multi-lens design and wastes wall-clock time.

GATE 2: NO SILENT BLOCK
  If a sub-agent cannot find results, it MUST return a findings.md
  stating "No results found" with the queries attempted.
  It MUST NOT silently return empty or skip the output file.
  Missing findings files will block cariak-synthesizing GATE 0.

GATE 3: EVERY FINDING MUST CITE SOURCE
  Every claim in every findings.md MUST have an inline citation
  pointing to a source in the bibliography.
  Uncited claims → findings rejected, sub-agent re-run.

GATE 4: PER-FINDING ADVISOR REVIEW MANDATORY (ANTITHESIS)
  For each sub-agent's findings file, a Domain Expert advisor
  MUST independently review the output for bias, source quality,
  missing counter-evidence, and confidence assessment.
  All advisor reviews MUST be dispatched in PARALLEL in a single message.
  Advisor reviews MUST cite sources for their challenges.
  If an advisor flags findings for re-research → re-dispatch the
  sub-agent with adjusted queries BEFORE handoff to synthesizing.
```

### Phase 0: Preflight

**Objective:** Verify all prerequisites before dispatching sub-agents.

1. Check Memory MCP (`memory_search_nodes`) for the current project context
2. Verify `docs/cariak/spec/YYYY-MM-DD-slug/research-plan.md` exists
3. Parse the plan to extract:
   - Research questions
   - Assigned sub-agents per question
   - Query templates
   - Implementation Evidence Plan (if present)
   - Output directory path
4. Create the output directory: `docs/cariak/research/YYYY-MM-DD-slug/`
5. Check for re-research flag from `cariak-reflecting` (if re-research, load reflection report for adjusted queries)
6. Log session start to Memory MCP

**Preflight checklist:**
- [ ] `research-plan.md` exists and is approved
- [ ] Output directory created
- [ ] All 5 sub-agent query templates prepared
- [ ] Re-research iteration count checked (max 2)

### Phase 1: Load Plan

**Objective:** Parse the research plan into sub-agent dispatch payloads.

Extract from `research-plan.md`:

| Field | Purpose |
|---|---|
| Research questions | Core queries each sub-agent must address |
| Sub-agent assignments | Which sub-agents cover which questions |
| Query templates | Pre-formatted search strings per sub-agent |
| Source taxonomy | Allowed/disallowed sources per domain |
| Citation standard | APA, IEEE, or inline-numbered |
| Depth setting | Number of results per source (from Clarify Gate) |
| Implementation Evidence Plan | Technical evidence targets: repos, docs, benchmarks, datasets, patents, products, field practice |

For each sub-agent, construct a dispatch payload:

```
sub-agent: internet-researcher
questions: [Q1, Q2, Q3]
queries: ["query string 1", "query string 2", ...]
source_taxonomy: [allowed sources]
citation_standard: inline-numbered
output_path: docs/cariak/research/YYYY-MM-DD-slug/internet-findings.md
depth: 10
```

Repeat for all 5 sub-agents.

If the plan contains `## Implementation Evidence Plan`, add an `implementation_evidence_targets` block to each relevant payload:

```yaml
implementation_evidence_targets:
  repositories: [queries]
  official_docs: [queries]
  benchmarks: [queries]
  datasets_model_cards: [queries]
  standards_patents: [queries]
  commercial_products: [queries]
  field_practice: [queries]
required_output_section: "Implementation Evidence"
```

For non-technical topics, omit this block.

### Phase 2: Dispatch 5 Sub-Agents IN PARALLEL

**Objective:** Launch all 5 research sub-agents simultaneously.

**THIS IS THE CRITICAL PHASE.** All 5 sub-agents MUST be dispatched in a single message with parallel tool calls.

| Sub-Agent | Domain | Primary Tools |
|---|---|---|
| `internet-researcher` | Blogs, Medium, engineering blogs, articles | `search_web`, `search_exa`, `fetch_web_page`, `tavily_search`, `tavily_extract` |
| `social-researcher` | X/Twitter, Reddit, GitHub, HN, Stack Overflow | `search_reddit`, `search_hackernews`, `search_github`, `search_x` |
| `academic-researcher` | arXiv, PubMed, Semantic Scholar, CrossRef, OpenAlex, DOAJ | `search_arxiv`, `search_pubmed`, `search_semantic`, `search_crossref`, `search_openalex`, `search_doaj` |
| `news-researcher` | News articles, industry reports, press releases | `search_web` (news type), `tavily_search` |
| `market-researcher` | Market data, competitor info, pricing, industry analysis | `search_web`, `search_exa`, `tavily_search`, `tavily_extract` |

**Dispatch protocol:**

```
[SINGLE MESSAGE - PARALLEL CALLS]

→ internet-researcher.md    (with dispatch payload)
→ social-researcher.md      (with dispatch payload)
→ academic-researcher.md    (with dispatch payload)
→ news-researcher.md        (with dispatch payload)
→ market-researcher.md      (with dispatch payload)
```

Each sub-agent:
1. Executes its searches across multiple sources
2. Deduplicates results
3. Extracts key findings with inline citations
4. Writes `findings.md` to the output path
5. Returns a summary + file path

**GATE 1 enforcement:** If any sub-agent is dispatched in a separate message, ABORT and re-dispatch all 5 in parallel.

### Phase 3: Collect Results

**Objective:** Gather all 5 findings files and verify completeness.

After all sub-agents return:

1. Verify all 5 files exist:
   - `docs/cariak/research/YYYY-MM-DD-slug/internet-findings.md`
   - `docs/cariak/research/YYYY-MM-DD-slug/social-findings.md`
   - `docs/cariak/research/YYYY-MM-DD-slug/academic-findings.md`
   - `docs/cariak/research/YYYY-MM-DD-slug/news-findings.md`
   - `docs/cariak/research/YYYY-MM-DD-slug/market-findings.md`

2. Check each file for:
   - Non-empty content (GATE 2: no silent block)
   - At least one cited source (GATE 3: every finding cites source)
   - Bibliography section present

3. If any file is missing or empty:
   - Re-dispatch the failed sub-agent
   - Log the failure in Memory MCP
   - If re-dispatch also fails, mark that domain as "NO RESULTS" and proceed

### Phase 4: Quick Audit per Sub-Agent

**Objective:** Rapid quality check before handoff to synthesizing.

For each findings file, check:

| Check | Pass Criteria | Fail Action |
|---|---|---|
| Citation coverage | Every claim has [N] citation | Flag for re-run |
| Source diversity | ≥3 unique sources cited | Note in handoff |
| Query coverage | All assigned questions addressed | Flag for re-run |
| Contradiction flag | Internal contradictions noted | Pass to synthesizing |
| Bias flag | Source bias noted | Pass to synthesizing |
| Implementation evidence | Technical topics include repos/docs/benchmarks/datasets/standards/products/field practice, or explicitly state none found | Flag for re-run |

This is a QUICK audit, not a deep review. The deep review happens in `cariak-synthesizing` and `cariak-validating`.

### Phase 4.5: Per-Finding Advisor Review (ANTITHESIS)

**Objective:** For each sub-agent's findings, dispatch a Domain Expert advisor to independently review the output.

This is the THESIS → ANTITHESIS step for each research lens. Each sub-agent's findings are the thesis. Now an independent Domain Expert advisor must review them.

1. **For each sub-agent's findings file, dispatch a Domain Expert advisor in PARALLEL:**
   - The advisor is a **different model/persona**, not self-critique.
   - The advisor's job: check bias, source quality, missing counter-evidence, confidence assessment.
   - The advisor MUST cite sources for their challenges (Iron Law: no claim without source).
   - **IMPORTANT:** These advisor reviews run IN PARALLEL with each other — dispatch all 5 (or however many sub-agents had findings) in a single message.
2. **Advisor challenge questions for each findings file:**
   - "Is this finding biased? What perspective is over-represented or under-represented?"
   - "What sources contradict this finding? What counter-evidence was missed?"
   - "What is the actual confidence level of these findings based on source quality?"
   - "What source types are missing from this domain's findings?"
3. **Advisor returns (for each findings file):**
   - Bias assessment with specific examples.
   - List of missing counter-evidence or contradicting sources.
   - Confidence reassessment per finding.
   - Recommendation: accept as-is, flag for re-research, or supplement with additional sources.

**GATE 4 check:** All advisor reviews dispatched in parallel and returned? Are there any findings flagged for re-research? If yes → re-dispatch the flagged sub-agent with adjusted queries.

**Output:** Per-finding advisor review reports — bias flags, missing evidence, confidence reassessment. These feed into the handoff summary to `cariak-synthesizing`.

### Phase 5: Handoff to Synthesizing

**Objective:** Transfer all findings to `cariak-synthesizing`.

**Handoff artifact:** All 5 findings files + audit summary.

Present the user with the handoff menu:

```
┌─────────────────────────────────────────────────────────┐
│  RESEARCH COMPLETE — 5 findings files generated         │
│  Output: docs/cariak/research/YYYY-MM-DD-slug/          │
├─────────────────────────────────────────────────────────┤
│  Sub-agent       │ Sources │ Findings │ Status          │
│  internet        │    12   │    8     │ ✓ Complete      │
│  social          │    15   │    6     │ ✓ Complete      │
│  academic        │     8   │    5     │ ✓ Complete      │
│  news            │     7   │    4     │ ✓ Complete      │
│  market          │     5   │    3     │ ⚠ Low coverage  │
├─────────────────────────────────────────────────────────┤
│  NEXT STEP:                                             │
│  [1] Synthesize findings → research-report.md           │
│  [2] Re-run a specific sub-agent with adjusted queries  │
│  [3] Save and stop                                      │
└─────────────────────────────────────────────────────────┘
```

**Default action:** If user selects [1], invoke `cariak-synthesizing`.

**Auto-invoke condition:** If all 5 sub-agents returned complete results with no flags, auto-invoke `cariak-synthesizing` behind a confirmation prompt.

### Reference Triggers

| Trigger | Location | Purpose |
|---|---|---|
| `references/source-taxonomy.csv` | Phase 1 | Determines allowed sources per sub-agent |
| Sub-agent definitions (`subagents/*.md`) | Phase 2 | Provides tool lists and output formats |
| `research-plan.md` | Phase 0, 1 | Source of queries and assignments |
| Memory MCP | Phase 0 | Project context and re-research flags |

### Sub-Agent Dispatch Details

Each sub-agent is defined in `D:\programming\automation\cariak\subagents\`:

| Sub-Agent File | Domain | Output File |
|---|---|---|
| `internet-researcher.md` | General web | `internet-findings.md` |
| `social-researcher.md` | Social platforms | `social-findings.md` |
| `academic-researcher.md` | Academic papers | `academic-findings.md` |
| `news-researcher.md` | News & media | `news-findings.md` |
| `market-researcher.md` | Market & competitor | `market-findings.md` |