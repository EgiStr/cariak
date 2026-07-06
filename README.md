# Cariak — Open-Source Deep Research Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenCode Skill](https://img.shields.io/badge/OpenCode-Skill-blue.svg)](https://github.com/sst/opencode)
[![Version](https://img.shields.io/badge/version-v1.1.0-green.svg)](CHANGELOG.md)
[![Bilingual](https://img.shields.io/badge/language-ID%20%2B%20EN-orange.svg)](README.id.md)

> **Iron Law: NO CLAIM WITHOUT SOURCE.**
> Setiap klaim harus bersumber. Every claim must be sourced.

---

## What is Cariak?

Cariak is an open-source deep research agent built as a suite of [OpenCode](https://github.com/sst/opencode) skills, inspired by [Pocketto](https://github.com/rfxlamia/pocketto)'s skill-based agent architecture. It conducts comprehensive research across the internet, social media, academic papers, news, and market sources — then synthesizes findings into cited, confidence-graded project documents.

Rather than a single monolithic prompt, Cariak decomposes research into **9 specialized skills** that form a pipeline: from pitching (clarifying intent) through grinding (parallel research) to reflecting (quality gates) and remembering (memory persistence). Each skill has a single responsibility, a defined input/output contract, and Hard Gates that prevent phase advancement until quality criteria are met.

Cariak is **bilingual** — it operates in both Indonesian (Bahasa Indonesia) and English, matching the user's language throughout the research lifecycle.

---

## Features

- **9 Skills** — a complete research pipeline: pitching → grinding → advising → planning → researching → synthesizing → validating → reflecting → remembering
- **5 Parallel Research Sub-agents** — internet, social, academic, news, and market researchers run concurrently, each with specialized source domains and MCP tools
- **12 On-Demand Document Outputs** — PRD, tech-spec, ADR, competitive-analysis, risk-register, literature-review, experiment-design, feasibility-study, implementation-roadmap, research-proposal, technical-report, recommendation-report
- **2 Always-On Outputs** — `research-report.md` (the main synthesis) and `references.json` (structured citation graph) are produced on every run
- **Multi-Session Memory** — persists entities, relations, and observations across sessions via the Memory MCP, enabling cumulative research
- **Auto-Reflection Quality Gate** — the `reflecting` skill evaluates every output against confidence, source coverage, and bias criteria before release
- **Bilingual (Indonesian + English)** — every skill, prompt, and output template supports both languages
- **Every Claim Sourced** — the Iron Law: *NO CLAIM WITHOUT SOURCE*. Unsourced claims are flagged and rejected at the validation gate

---

## Inspiration

Inspired by [Pocketto](https://github.com/rfxlamia/pocketto) — a skill-based agent architecture featuring Hard Gates, Phase pipelines, and LLM-to-LLM advisor curation. Cariak adapts Pocketto's core patterns to the deep research domain:

| Pocketto Pattern | Cariak Adaptation |
|---|---|
| Skill = single responsibility | 9 research skills, each with one job |
| Hard Gates | Clarify Gate (pitching), Quality Gate (reflecting), Validation Gate (validating) |
| Phase pipelines | Sequential skill flow with mandatory outputs per phase |
| LLM-to-LLM advisor curation | `advising` skill generates expert personas that review the research plan |

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/EgiStr/cariak.git
```

### 2. Add to OpenCode config

Add the Cariak skills directory to your OpenCode configuration:

```json
{
  "skills": [
    "D:/programming/automation/cariak/skills"
  ]
}
```

Or, if you cloned into your OpenCode workspace, reference the relative path.

### 3. Configure MCP tools

Cariak depends on several MCP servers. Ensure the following are configured in your OpenCode environment:

| MCP Server | Purpose |
|---|---|
| `web-search-mcp` | Web search, page extraction, GitHub/Reddit/HN/X search |
| `paper-search-mcp` | Academic paper search (arXiv, PubMed, Semantic Scholar, etc.) |
| `tavily` | Deep web research, site crawling, content extraction |
| `memory` | Persistent entity-relation knowledge graph |
| `playwright` | Browser automation for dynamic/JS-rendered pages |

See [Configuration](#configuration) for details.

---

## Usage

Trigger Cariak with any of the following phrases in your OpenCode session:

| Trigger Phrase | Language | Behavior |
|---|---|---|
| `cariak` | Universal | Full pipeline run |
| `research this` | EN | Full pipeline run |
| `deep research` | EN | Full pipeline with extended depth |
| `gali ini` | ID | Full pipeline run (Indonesian output) |

### Example session

```
User: cariak — I need a feasibility study on replacing our REST API with GraphQL

Cariak: [pitching] Clarifying research intent...
        → Research question confirmed: "Is migrating from REST to GraphQL feasible for our team?"
        → Output language: English

Cariak: [grinding] Decomposing into research streams...
        → Stream 1: Technical feasibility (schema design, N+1, auth)
        → Stream 2: Team capability (learning curve, hiring)
        → Stream 3: Performance benchmarks (REST vs GraphQL)

Cariak: [advising] Generating expert personas...
        → Senior Backend Architect
        → DevOps Lead
        → API Product Manager

Cariak: [planning] Building research plan with advisor input...

Cariak: [researching] Launching 5 parallel sub-agents...
        → internet:  searching web articles, blog posts
        → social:    searching Reddit, HN, X discussions
        → academic:  searching arXiv, Semantic Scholar
        → news:      searching tech news, announcements
        → market:    searching competitor APIs, market reports

Cariak: [synthesizing] Merging 5 research streams...
        → 47 sources collected
        → 3 confidence tiers assigned (High / Medium / Low)

Cariak: [validating] Checking Iron Law compliance...
        → 0 unsourced claims ✓
        → 2 low-confidence claims flagged

Cariak: [reflecting] Quality gate evaluation...
        → Source coverage:    PASS (4+ sources per major claim)
        → Bias check:         PASS (multiple perspectives)
        → Confidence grading: PASS (appropriate hedging)

Cariak: [remembering] Persisting to memory...
        → 12 entities, 8 relations saved

✅ Output: docs/cariak/feasibility-study.md
✅ Output: docs/cariak/research-report.md
✅ Output: docs/cariak/references.json
```

---

## Pipeline

The 9 skills form a sequential pipeline. Each skill must complete and pass its Hard Gate before the next begins.

```
 ┌──────────┐
 │ PITCHING │  Clarify research intent with the user
 │  (gate)  │  → research-question.md
 └────┬─────┘
      │ Clarify Gate ✓
      ▼
 ┌──────────┐
 │ GRINDING │  Decompose question into research streams
 └────┬─────┘
      │
      ▼
 ┌──────────┐
 │ ADVISING │  Generate expert personas, review plan
 └────┬─────┘
      │
      ▼
 ┌──────────┐
 │ PLANNING │  Build detailed research plan
 └────┬─────┘
      │
      ▼
 ┌──────────────────────────────────────────────┐
 │              RESEARCHING                      │
 │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐    │
 │  │inter- │ │social │ │acade- │ │ news  │    │
 │  │ net   │ │       │ │ mic   │ │       │    │
 │  └───────┘ └───────┘ └───────┘ └───────┘    │
 │  ┌───────┐                                   │
 │  │market │  ← 5 parallel sub-agents          │
 │  └───────┘                                   │
 └──────────────────┬───────────────────────────┘
                    │
                    ▼
 ┌─────────────┐
 │ SYNTHESIZING│  Merge streams, assign confidence
 └──────┬──────┘
        │
        ▼
 ┌────────────┐
 │ VALIDATING │  Iron Law check: every claim sourced?
 │  (gate)    │  → unsourced claims rejected
 └──────┬─────┘
        │ Validation Gate ✓
        ▼
 ┌─────────────┐
 │ REFLECTING  │  Quality gate: coverage, bias, confidence
 │  (gate)     │  → pass / retry / fail
 └──────┬──────┘
        │ Quality Gate ✓
        ▼
 ┌─────────────┐
 │ REMEMBERING │  Persist to Memory MCP
 └──────┬──────┘
        │
        ▼
   ╔═══════════════════════╗
   ║  OUTPUT DOCUMENTS     ║
   ║  • research-report.md ║  (always-on)
   ║  • references.json    ║  (always-on)
   ║  • + on-demand docs   ║
   ╚═══════════════════════╝
```

---

## Skill Reference

| # | Skill | Trigger | Output | Status |
|---|---|---|---|---|
| 1 | **pitching** | User initiates research | `research-question.md` — clarified intent, scope, language | ✅ Stable |
| 2 | **grinding** | After pitching | `research-streams.md` — decomposed research sub-questions | ✅ Stable |
| 3 | **advising** | After grinding | `advisor-review.md` — expert personas + plan critique | ✅ Stable |
| 4 | **planning** | After advising | `research-plan.md` — detailed execution plan | ✅ Stable |
| 5 | **researching** | After planning | 5× `sub-agent-report.md` — parallel research results | ✅ Stable |
| 6 | **synthesizing** | After researching | `research-report.md` + on-demand docs — merged synthesis | ✅ Stable |
| 7 | **validating** | After synthesizing | `validation-report.md` — Iron Law compliance check | ✅ Stable |
| 8 | **reflecting** | After validating | `reflection-report.md` — quality gate evaluation | ✅ Stable |
| 9 | **remembering** | After reflecting | Memory MCP entities + relations persisted | ✅ Stable |

---

## Sub-Agents

The `researching` skill launches 5 parallel sub-agents, each specialized for a source domain:

| Sub-Agent | Source Domains | MCP Tools |
|---|---|---|
| **Internet Researcher** | General web, blogs, documentation, tutorials | `web-search-mcp` (search_web, fetch_web_page, groq_analyze) |
| **Social Researcher** | Reddit, Hacker News, X/Twitter, forums | `web-search-mcp` (search_reddit, search_hackernews, search_x) |
| **Academic Researcher** | arXiv, PubMed, Semantic Scholar, CrossRef, DOAJ | `paper-search-mcp` (search_arxiv, search_pubmed, search_semantic, read_arxiv_paper) |
| **News Researcher** | Tech news, press releases, industry announcements | `tavily` (tavily_search), `web-search-mcp` (search_web with news type) |
| **Market Researcher** | Competitor sites, market reports, product pages | `tavily` (tavily_crawl, tavily_extract), `playwright` (browser_navigate, browser_snapshot) |

Each sub-agent runs independently and returns a structured report with:
- Findings (with inline citations)
- Source URLs
- Confidence assessment
- Gaps identified

---

## Document Outputs

Cariak produces **2 always-on outputs** on every run, plus **12 on-demand outputs** that can be requested:

| # | Document | When | Type |
|---|---|---|---|
| 1 | `research-report.md` | Every run | Always-on |
| 2 | `references.json` | Every run | Always-on |
| 3 | `prd.md` | On-demand | Product Requirements Document |
| 4 | `tech-spec.md` | On-demand | Technical Specification |
| 5 | `adr.md` | On-demand | Architecture Decision Record |
| 6 | `competitive-analysis.md` | On-demand | Competitive Analysis |
| 7 | `risk-register.md` | On-demand | Risk Register |
| 8 | `literature-review.md` | On-demand | Academic Literature Review |
| 9 | `experiment-design.md` | On-demand | Experiment Design |
| 10 | `feasibility-study.md` | On-demand | Feasibility Study |
| 11 | `implementation-roadmap.md` | On-demand | Implementation Roadmap |
| 12 | `research-proposal.md` | On-demand | Research Proposal |
| 13 | `technical-report.md` | On-demand | Technical Report |
| 14 | `recommendation-report.md` | On-demand | Recommendation Report |

All outputs are written to `docs/cariak/` by default. Every claim in every document includes an inline citation `[n]` that maps to an entry in `references.json`.

---

## Configuration

### MCP Tools

Cariak requires the following MCP servers to be available in your OpenCode environment:

#### 1. web-search-mcp

General-purpose web search, page extraction, and social platform search.

```
Sources: DuckDuckGo, Reddit, Hacker News, X/Twitter, GitHub, Wikipedia, arXiv, Exa
Tools:   search_web, fetch_web_page, groq_analyze, search_reddit,
         search_hackernews, search_x, search_github, search_wikipedia
```

#### 2. paper-search-mcp

Academic paper search and full-text extraction across 20+ repositories.

```
Sources: arXiv, PubMed, PubMed Central, Semantic Scholar, CrossRef, DOAJ,
         bioRxiv, medRxiv, IEEE, dblp, HAL, Zenodo, OpenAIRE, CiteSeerX, BASE, SSRN
Tools:   search_arxiv, search_pubmed, search_semantic, search_crossref,
         read_arxiv_paper, download_with_fallback, search_papers (unified)
```

#### 3. tavily

AI-powered web research, site crawling, and content extraction.

```
Tools:   tavily_search, tavily_research, tavily_crawl, tavily_extract, tavily_map
```

#### 4. memory

Persistent knowledge graph for cross-session research memory.

```
Tools:   create_entities, create_relations, add_observations,
         search_nodes, open_nodes, read_graph
Entity types: ResearchProject, ResearchQuestion, Source, Finding,
              Claim, Advisor, ConfidenceAssessment
```

#### 5. playwright

Browser automation for dynamic, JavaScript-rendered, or login-gated pages.

```
Tools:   browser_navigate, browser_snapshot, browser_click,
         browser_type, browser_take_screenshot, browser_evaluate
```

---

## Examples

See real research outputs in the examples directory:

- [`docs/examples/guava-cut-cost/`](docs/examples/guava-cut-cost/) — A complete research run investigating cost-cutting strategies for a guava farming operation. Includes all generated documents: research-report.md, references.json, feasibility-study.md, and sub-agent reports.

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Reporting bugs and suggesting features
- Adding new skills (follow the Pocketto pattern)
- Adding new sub-agents
- Improving reference CSV files (every method must have a source)
- Bilingual documentation policies

---

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- **[Pocketto](https://github.com/rfxlamia/pocketto)** — The skill-based agent architecture that inspired Cariak's design. Hard Gates, Phase pipelines, and LLM-to-LLM advisor curation are all Pocketto patterns.
- **[OpenCode](https://github.com/sst/opencode)** — The AI coding agent framework that hosts Cariak as skills.
- **[MCP Ecosystem](https://modelcontextprotocol.io/)** — The Model Context Protocol that powers Cariak's tool integrations. Cariak stands on the shoulders of the MCP server maintainers.
- **Academic & Open Source Communities** — Every source Cariak cites comes from researchers, developers, and writers who share their work openly.

---

<p align="center">
  <strong>Cariak</strong> — Research deep. Cite everything. Remember always.<br>
  <em>Riset mendalam. Semua bersumber. Selalu diingat.</em>
</p>
