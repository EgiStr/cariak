# Cariak — Open-Source Deep Research Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenCode Skill](https://img.shields.io/badge/OpenCode-Skill-blue.svg)](https://github.com/sst/opencode)
[![Version](https://img.shields.io/badge/version-v1.3.1-green.svg)](CHANGELOG.md)
[![Bilingual](https://img.shields.io/badge/language-ID%20%2B%20EN-orange.svg)](README.id.md)

> **Iron Law: NO CLAIM WITHOUT SOURCE.**
> Setiap klaim harus bersumber. Every claim must be sourced.

---

## What is Cariak?

Cariak is an open-source deep research agent built as a suite of [OpenCode](https://github.com/sst/opencode) skills, inspired by [Pocketto](https://github.com/rfxlamia/pocketto)'s skill-based agent architecture. It conducts comprehensive research across the internet, social media, academic papers, news, and market sources — then synthesizes findings into cited, confidence-graded project documents.

Rather than a single monolithic prompt, Cariak decomposes research into **9 specialized skills** that form a pipeline: from pitching (clarifying intent) through grinding (parallel research) to reflecting (quality gates) and remembering (memory persistence). Each skill has a single responsibility, a defined input/output contract, and Hard Gates that prevent phase advancement until quality criteria are met.

Cariak is **bilingual** — it operates in both Indonesian (Bahasa Indonesia) and English, matching the user's language throughout the research lifecycle.

---
## Core Philosophy

Cariak is built on the dialectic method: every output at every phase is challenged by an independent advisor persona before advancing.

```
THESIS → ANTITHESIS → SYNTHESIS
```

- **Thesis**: the current phase produces an output (brainstorm, plan, synthesis, claim)
- **Antithesis**: an independent advisor sub-agent challenges that output — hunting blind spots, untested assumptions, contradictions, and missing evidence
- **Synthesis**: the phase output is revised incorporating the advisor's challenge, and only then proceeds to the next phase

This is not self-critique. Self-critique is susceptible to confirmation bias — a system cannot reliably detect its own blind spots. Cariak solves this by spawning **7 different advisor personas** as independent sub-agents, each specialized for the challenge at a specific phase:

| Phase | Advisor Persona | Challenge |
|---|---|---|
| Pitching | Devil's Advocate | "What blind spots? What untested assumptions?" |
| Grinding | Methodologist + Skeptic | "Are GWT scenarios truly testable? What edge cases are missing?" |
| Planning | System Architect | "Are tasks truly independent? Hidden dependencies?" |
| Researching | Domain Expert (×5, rotated) | "Is this finding biased? What sources contradict it?" |
| Synthesizing | Contradiction Hunter | "Where do sources disagree? What's being cherry-picked?" |
| Validating | Falsificationist (Popper-style) | "How would you PROVE each claim wrong?" |
| Reflecting | Blind Spot Auditor | "What did we NOT research? What's the weakest finding?" |

Every advisor challenge is recorded in `advisor-phase-mapping.csv` and is mandatory — no phase advances without passing its advisor gate.

---


## Features

- **9 Skills** — a complete research pipeline: pitching → grinding → planning → researching → synthesizing → validating → reflecting → remembering
- **Dialectic advisor at every phase** — 7 different advisor personas challenge every output; no self-critique, all challenges via independent sub-agents
- **Anti-bias architecture** — every output is challenged before advancing; the Falsificationist tries to prove claims wrong; the Contradiction Hunter finds cherry-picking; the Blind Spot Auditor finds what you missed
- **5 Parallel Research Sub-agents** — internet, social, academic, news, and market researchers run concurrently, each with specialized source domains and MCP tools
- **DOCX primary output** — professional-grade `.docx` documents with formatting, headers, and tables via `npx cariak-pi report`; `.md` as fallback
- **12 On-Demand Document Outputs** — PRD, tech-spec, ADR, competitive-analysis, risk-register, literature-review, experiment-design, feasibility-study, implementation-roadmap, research-proposal, technical-report, recommendation-report
- **2 Always-On Outputs** — `research-report.docx` (the main synthesis, primary) / `research-report.md` (fallback) and `references.json` (structured citation graph) are produced on every run
- **Multi-Session Memory** — persists entities, relations, and observations across sessions via the Memory MCP, enabling cumulative research
- **Auto-Reflection Quality Gate** — the `reflecting` skill evaluates every output against confidence, source coverage, and bias criteria before release
- **Bilingual (Indonesian + English)** — every skill, prompt, and output template supports both languages
- **Every Claim Sourced** — the Iron Law: *NO CLAIM WITHOUT SOURCE*. Unsourced claims are flagged and rejected at the validation gate
- **Structural Research Methods** — every phase uses real, cited academic/industry methods — see `references/research-methods.csv` for full source citations (SCAMPER, PICO, PRISMA-P, OSINT Cycle, Thematic Synthesis, GRADE, AMSTAR 2, FAIR, etc.)

---

## Inspiration

Inspired by [Pocketto](https://github.com/rfxlamia/pocketto) — a skill-based agent architecture featuring Hard Gates, Phase pipelines, and LLM-to-LLM advisor curation. Cariak adapts Pocketto's core patterns to the deep research domain:

| Pocketto Pattern | Cariak Adaptation |
|---|---|
| Skill = single responsibility | 9 research skills, each with one job |
| Hard Gates | Clarify Gate (pitching), Quality Gate (reflecting), Validation Gate (validating) |
| Phase pipelines | Sequential skill flow with mandatory outputs per phase |
| LLM-to-LLM advisor curation | Dialectic advisor at every phase — 7 personas challenge every output |

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

### Structural research methods

Cariak ships a phase-by-phase method registry so each skill uses an auditable academic/industry technique, not a generic prompt.

See: [`docs/structural-research-methods.md`](docs/structural-research-methods.md) and [`references/research-methods.csv`](references/research-methods.csv).

For technical topics, Cariak applies the **Engineering Lens Canvas** and **Expert Technical Report** method. The final report must cover first principles, state of the art, field practice, implementation architecture, data strategy, evaluation protocol, failure modes, alternatives, unknowns, and a concrete build roadmap.

### Example session

```
User: cariak — I need a feasibility study on replacing our REST API with GraphQL

Cariak: [pitching] Clarifying research intent...
        → Research question confirmed: "Is migrating from REST to GraphQL feasible for our team?"
        → Output language: English

Cariak: [advisor: Devil's Advocate] Challenging the question...
        → "Are you asking about migration feasibility, or about whether GraphQL is right at all?"
        → Thesis refined with advisor input

Cariak: [grinding] Decomposing into research streams...
        → Stream 1: Technical feasibility (schema design, N+1, auth)
        → Stream 2: Team capability (learning curve, hiring)
        → Stream 3: Performance benchmarks (REST vs GraphQL)

Cariak: [advisor: Methodologist] Challenging the streams...
        → "Are performance benchmarks testable? What baseline are you comparing against?"

Cariak: [planning] Building research plan with advisor input...

Cariak: [advisor: System Architect] Challenging the plan...
        → "Tasks 3 and 5 have a hidden dependency. Team capability research must complete before benchmarking."

Cariak: [researching] Launching 5 parallel sub-agents...
        → internet:  searching web articles, blog posts
        → social:    searching Reddit, HN, X discussions
        → academic:  searching arXiv, Semantic Scholar
        → news:      searching tech news, announcements
        → market:    searching competitor APIs, market reports

Cariak: [advisor: Domain Expert ×5] Challenging each sub-agent finding...
        → "This GraphQL performance claim has no counter-evidence. Rejected."
        → "This HN thread represents one opinion. Need 2 more sources."

Cariak: [synthesizing] Merging 5 research streams...
        → 47 sources collected
        → 3 confidence tiers assigned (High / Medium / Low)

Cariak: [advisor: Contradiction Hunter] Challenging the synthesis...
        → "Sources A and D directly contradict. Cherry-picking detected on claim #7."

Cariak: [validating] Checking Iron Law compliance...
        → 0 unsourced claims ✓
        → 2 low-confidence claims flagged

Cariak: [advisor: Falsificationist] Attempting to falsify claims...
        → "Claim #3: 'GraphQL reduces over-fetching' — would fail if any REST API uses sparse fieldsets."

Cariak: [reflecting] Quality gate evaluation...
        → Source coverage:    PASS (4+ sources per major claim)
        → Bias check:         PASS (multiple perspectives)
        → Confidence grading: PASS (appropriate hedging)

Cariak: [advisor: Blind Spot Auditor] Final challenge...
        → "You didn't research GraphQL federation or schema stitching patterns."

Cariak: [remembering] Persisting to memory...
        → 15 entities, 12 relations saved

✅ Output: docs/cariak/feasibility-study.docx
✅ Output: docs/cariak/research-report.docx
✅ Output: docs/cariak/references.json
```

### DOCX Generation

Cariak v1.3.0 generates professional `.docx` documents as primary output. The legacy `.md` format is retained as fallback.

```bash
# Primary: generate DOCX report
npx cariak-pi report --template research-report

# Fallback: generate MD report
npx cariak-pi report --template research-report --format md
```

---

## Pipeline

The 9 skills form a sequential pipeline with advisor gates at every phase. Each skill must complete and pass its Hard Gate before the next begins.

```
 ┌──────────┐   ┌──────────────────────┐
 │ PITCHING │──→│ advisor: Devil's     │──Clarify Gate──┐
 │  (gate)  │   │ Advocate             │               │
 └──────────┘   └──────────────────────┘               │
      │ THESIS → ANTITHESIS → SYNTHESIS                │
      ▼                                                 │
 ┌──────────┐   ┌──────────────────────┐               │
 │ GRINDING │──→│ advisor: Methodologist│              │
 │          │   │ + Skeptic            │               │
 └──────────┘   └──────────────────────┘               │
      │ THESIS → ANTITHESIS → SYNTHESIS                │
      ▼                                                 │
 ┌──────────┐   ┌──────────────────────┐               │
 │ PLANNING │──→│ advisor: System       │              │
 │          │   │ Architect            │               │
 └──────────┘   └──────────────────────┘               │
      │ THESIS → ANTITHESIS → SYNTHESIS                │
      ▼                                                 │
 ┌──────────────────────────────────────┐              │
 │         RESEARCHING                  │              │
 │  ┌───────┐ ┌───────┐ ┌───────┐      │              │
 │  │internet│ │social │ │academic│      │              │
 │  └───────┘ └───────┘ └───────┘      │              │
 │  ┌───────┐ ┌───────┐                 │              │
 │  │ news  │ │market │  ← 5 parallel   │              │
 │  └───────┘ └───────┘    sub-agents   │              │
 └──────────────────┬───────────────────┘              │
      │             │                                  │
      │  ┌──────────────────────────┐                  │
      │  │ advisor: Domain Expert   │                  │
      │  │ ×5 (rotated per topic)   │                  │
      │  └──────────────────────────┘                  │
      │ THESIS → ANTITHESIS → SYNTHESIS                │
      ▼                                                 │
 ┌─────────────┐ ┌──────────────────────┐             │
 │ SYNTHESIZING│─→│ advisor: Contradiction│            │
 │             │  │ Hunter               │             │
 └──────┬──────┘ └──────────────────────┘             │
      │ THESIS → ANTITHESIS → SYNTHESIS                │
      ▼                                                 │
 ┌────────────┐  ┌──────────────────────┐             │
 │ VALIDATING │──→│ advisor: Falsification-│           │
 │  (gate)    │  │ ist (Popper-style)    │            │
 └──────┬─────┘  └──────────────────────┘             │
        │ THESIS → ANTITHESIS → SYNTHESIS              │
        ▼                                                 │
 ┌─────────────┐ ┌──────────────────────┐              │
 │ REFLECTING  │─→│ advisor: Blind Spot  │              │
 │  (gate)     │  │ Auditor             │              │
 └──────┬──────┘ └──────────────────────┘              │
        │ THESIS → ANTITHESIS → SYNTHESIS              │
        ▼                                                 │
 ┌─────────────┐                                        │
 │ REMEMBERING │  Persist to Memory MCP                  │
 └──────┬──────┘                                        │
        │                                                 │
        ▼                                                 │
   ╔═══════════════════════╗                            │
   ║  OUTPUT DOCUMENTS     ║                            │
   ║  • research-report    ║  (always-on, DOCX primary) │
   ║    .docx              ║                            │
   ║  • references.json    ║  (always-on)               │
   ║  • + on-demand docs   ║  (DOCX primary, MD fallback)│
   ╚═══════════════════════╝                            │
```

---

## Skill Reference

| # | Skill | Key Advisor | Trigger | Output | Status |
|---|---|---|---|---|---|
| 1 | **pitching** | Devil's Advocate | User initiates research | `research-question.md` — clarified intent, scope, language | ✅ Stable |
| 2 | **grinding** | Methodologist + Skeptic | After pitching | `research-streams.md` — decomposed research sub-questions | ✅ Stable |
| 3 | **planning** | System Architect | After grinding | `research-plan.md` — detailed execution plan | ✅ Stable |
| 4 | **researching** | Domain Expert (×5) | After planning | 5× `sub-agent-report.md` — parallel research results | ✅ Stable |
| 5 | **synthesizing** | Contradiction Hunter | After researching | `research-report.docx` + on-demand docs — merged synthesis | ✅ Stable |
| 6 | **validating** | Falsificationist | After synthesizing | `validation-report.md` — Iron Law compliance check | ✅ Stable |
| 7 | **reflecting** | Blind Spot Auditor | After validating | `reflection-report.md` — quality gate evaluation | ✅ Stable |
| 8 | **remembering** | — | After reflecting | Memory MCP entities + relations persisted | ✅ Stable |

> **Note**: v1.3.0 merges the former `advising` skill into the dialectic advisor architecture. Advisor personas now operate as independent sub-agents at every phase rather than as a single phase.

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

**Primary: DOCX (professional-grade), Fallback: MD (plain text)**

Cariak v1.3.0 generates professional `.docx` documents via `npx cariak-pi report`. The legacy `.md` format is retained as fallback via `--format md`.

| # | Document | When | Type |
|---|---|---|---|
| 1 | `research-report.docx` / `.md` | Every run | Always-on |
| 2 | `references.json` | Every run | Always-on |
| 3 | `prd.docx` / `.md` | On-demand | Product Requirements Document |
| 4 | `tech-spec.docx` / `.md` | On-demand | Technical Specification |
| 5 | `adr.docx` / `.md` | On-demand | Architecture Decision Record |
| 6 | `competitive-analysis.docx` / `.md` | On-demand | Competitive Analysis |
| 7 | `risk-register.docx` / `.md` | On-demand | Risk Register |
| 8 | `literature-review.docx` / `.md` | On-demand | Academic Literature Review |
| 9 | `experiment-design.docx` / `.md` | On-demand | Experiment Design |
| 10 | `feasibility-study.docx` / `.md` | On-demand | Feasibility Study |
| 11 | `implementation-roadmap.docx` / `.md` | On-demand | Implementation Roadmap |
| 12 | `research-proposal.docx` / `.md` | On-demand | Research Proposal |
| 13 | `technical-report.docx` / `.md` | On-demand | Technical Report |
| 14 | `recommendation-report.docx` / `.md` | On-demand | Recommendation Report |

All outputs are written to `docs/cariak/` by default. Every claim in every document includes an inline citation `[n]` that maps to an entry in `references.json`.

---

## Why This Architecture?

Most AI research agents use self-critique: "review your own output for errors." This fails because:

1. **Confirmation bias** — An LLM generating a claim is primed to defend it, not attack it.
2. **Blind spot persistence** — The same model with the same context has the same blind spots.
3. **No adversarial pressure** — Without a real adversary, weak claims pass unchallenged.

Cariak's dialectic architecture solves this:

- **Independent sub-agents**: Each advisor persona runs as a separate agent with its own context. It does not share the generating agent's biases.
- **Persona specialization**: A Methodologist challenges methodology, a Falsificationist tries to prove claims wrong, a Blind Spot Auditor finds gaps — different personas for different failure modes.
- **Mandatory gates**: No phase advances without passing its advisor challenge. Failed challenges loop back for revision.
- **Recorded challenges**: Every advisor output is saved to `advisor-phase-mapping.csv`, making the challenge process auditable.

The result: claims survive adversarial scrutiny before they reach the user. This is not "review" — it is thesis, antithesis, synthesis at every step.

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
Sources: arXiv, PubMed, Semantic Scholar, CrossRef, DOAJ, bioRxiv, medRxiv,
         PMC, Europe PMC, HAL, Zenodo, BASE, IACR, IEEE, SSRN, OpenAlex,
         CORE, OpenAIRE, dblp, CiteSeerX, Unpaywall
Tools:   search_arxiv, search_pubmed, search_semantic, search_crossref,
         search_doaj, search_pmc, search_europepmc, search_biorxiv,
         search_medrxiv, read_arxiv_paper, read_semantic_paper
```

#### 3. tavily

AI-powered deep web research, site crawling, and content extraction.

```
Tools:   tavily_search, tavily_crawl, tavily_extract, tavily_map
```

#### 4. memory

Persistent entity-relation knowledge graph via Memory MCP.

```
Tools:   create_entities, create_relations, add_observations,
         search_nodes, open_nodes, read_graph
```

#### 5. playwright

Browser automation for dynamic pages, JavaScript-rendered content, and protected sites.

```
Tools:   browser_navigate, browser_snapshot, browser_click,
         browser_take_screenshot, browser_console_messages
```

---

## Examples

See real research outputs in the examples directory:

- [`docs/examples/guava-cut-cost/`](docs/examples/guava-cut-cost/) — A complete research run investigating cost-cutting strategies for a guava farming operation. Includes all generated documents: research-report.docx, references.json, feasibility-study.docx, and sub-agent reports.

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Reporting bugs and suggesting features
- Adding new skills (follow the Pocketto pattern)
- Adding new sub-agents or advisor personas
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
  <strong>Cariak v1.3.0</strong> — Research deep. Challenge everything. Cite always.<br>
  <em>Riset mendalam. Tantang segalanya. Selalu bersumber.</em>
</p>
