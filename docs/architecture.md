# Cariak Architecture / Arsitektur Cariak

> This document describes the architecture of Cariak, an open-source deep research agent built as OpenCode skills.
>
> Dokumen ini mendeskripsikan arsitektur Cariak, agen riset mendalam open-source yang dibangun sebagai OpenCode skills.

---

## Design Principles / Prinsip Desain

Cariak's architecture is built on four core principles, adapted from [Pocketto](https://github.com/rfxlamia/pocketto):

Arsitektur Cariak dibangun di atas empat prinsip inti, diadaptasi dari [Pocketto](https://github.com/rfxlamia/pocketto):

### 1. Pocketto Fidelity / Fidelitas Pocketto

Cariak faithfully implements Pocketto's core patterns:
- **Skill = single responsibility** — Each skill does one thing well.
- **Hard Gates** — Phase transitions require explicit quality validation.
- **Phase pipelines** — Skills execute in sequence with defined input/output contracts.
- **LLM-to-LLM advisor curation** — The `advising` skill generates expert personas that review the research plan, mimicking Pocketto's advisor pattern.

### 2. Sourced Claims / Klaim Bersumber

The **Iron Law: NO CLAIM WITHOUT SOURCE** is enforced architecturally, not just by convention:
- The `validating` skill is a Hard Gate that checks every claim for an inline citation `[n]`.
- Unsourced claims are rejected and sent back to `synthesizing` for repair.
- `references.json` is the canonical citation graph — every `[n]` must resolve to an entry.

### 3. Parallel Research / Riset Paralel

Research is decomposed into **5 independent streams** that run concurrently:
- Each sub-agent operates in isolation with its own tool set.
- Sub-agents do not communicate during research — this prevents anchoring bias.
- Results converge only at the `synthesizing` skill.

### 4. Convergent Synthesis / Sintesis Konvergen

Five parallel research streams produce raw findings. The `synthesizing` skill:
- Merges findings, resolving conflicts and duplicates.
- Assigns confidence tiers (High / Medium / Low) to each claim.
- Routes to document templates based on the Clarify Gate decision.
- Produces both always-on outputs (`research-report.md`, `references.json`) and any on-demand documents.

---

## Skill Pipeline / Pipeline Skill

The 9 skills form a sequential pipeline. Each skill must complete and pass its Hard Gate before the next begins.

9 skill membentuk pipeline berurutan. Setiap skill harus selesai dan melewati Hard Gate-nya sebelum yang berikutnya dimulai.

```
USER INPUT
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                    SKILL PIPELINE                            │
│                                                              │
│  ┌────────────┐                                              │
│  │ 1. PITCHING│ ──Clarify Gate──┐                           │
│  │    (gate)  │                 │                           │
│  └────────────┘                 ▼                           │
│  ┌────────────┐                                            │
│  │ 2. GRINDING│  Decompose → research streams               │
│  └────────────┘                                            │
│  ┌────────────┐                                            │
│  │ 3. ADVISING│  Expert personas review plan               │
│  └────────────┘                                            │
│  ┌────────────┐                                            │
│  │ 4. PLANNING│  Build execution plan                      │
│  └────────────┘                                            │
│  ┌────────────────────────────────────────────┐            │
│  │ 5. RESEARCHING  (5 parallel sub-agents)     │            │
│  │    ┌────────┐ ┌────────┐ ┌────────┐        │            │
│  │    │Internet│ │Social  │ │Academic│        │            │
│  │    └────────┘ └────────┘ └────────┘        │            │
│  │    ┌────────┐ ┌────────┐                   │            │
│  │    │  News  │ │ Market │                   │            │
│  │    └────────┘ └────────┘                   │            │
│  └────────────────────────────────────────────┘            │
│  ┌──────────────┐                                          │
│  │ 6.SYNTHESIZE │  Merge, grade confidence, route docs     │
│  └──────┬───────┘                                          │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐                                          │
│  │ 7. VALIDATING│ ──Validation Gate (Iron Law)──┐          │
│  │    (gate)    │                               │          │
│  └──────────────┘                               │          │
│         │                                       │ fail     │
│         │ pass                                  │──→ back  │
│         ▼                                       │  to synth│
│  ┌──────────────┐                              │          │
│  │ 8. REFLECTING│ ──Quality Gate──┐            │          │
│  │    (gate)    │                 │            │          │
│  └──────────────┘                 ▼            │          │
│  ┌──────────────┐                            │          │
│  │ 9. REMEMBERING│  Persist to Memory MCP     │          │
│  └──────┬───────┘                            │          │
│         │                                     │          │
└─────────┼─────────────────────────────────────┘          │
          │                                                │
          ▼                                                │
   ╔═══════════════════════════════╗                      │
   ║        OUTPUT                  ║                      │
   ║  • research-report.md  (always)║                      │
   ║  • references.json     (always)║                      │
   ║  • + on-demand documents       ║                      │
   ╚═══════════════════════════════╝                      │
```

### Hard Gates

| Gate | Skill | Criteria | On Fail |
|---|---|---|---|
| **Clarify Gate** | pitching | Research question is specific, scoped, and confirmed by user | Re-prompt user for clarification |
| **Validation Gate** | validating | Every claim has a source citation `[n]` resolving to `references.json` | Return to synthesizing for repair |
| **Quality Gate** | reflecting | Source coverage (4+ per major claim), bias check (multiple perspectives), confidence grading (appropriate hedging) | Return to researching for gap-filling |

---

## Sub-agent Architecture / Arsitektur Sub-agen

The `researching` skill launches 5 parallel sub-agents. Each sub-agent is an isolated research unit with specialized source domains and MCP tools.

Skill `researching` meluncurkan 5 sub-agen paralel. Setiap sub-agen adalah unit riset terisolasi dengan domain sumber dan MCP tools khusus.

```
                    ┌──────────────────┐
                    │   RESEARCHING    │
                    │  (orchestrator)  │
                    └────────┬─────────┘
                             │
           ┌─────────┬───────┼───────┬─────────┐
           │         │       │       │         │
           ▼         ▼       ▼       ▼         ▼
      ┌────────┐┌────────┐┌────────┐┌──────┐┌──────┐
      │Internet││Social  ││Academic││ News ││Market│
      │Research││Research││Research││Resrch││Resrch│
      │er      ││er      ││er      ││      ││      │
      └───┬────┘└───┬────┘└───┬────┘└──┬───┘└──┬───┘
          │         │         │         │        │
          ▼         ▼         ▼         ▼        ▼
     ┌──────────────────────────────────────────────┐
     │                  MCP TOOLS                    │
     │                                               │
     │  web-search-mcp    paper-search-mcp   tavily  │
     │  playwright        memory                     │
     └──────────────────────────────────────────────┘
          │         │         │         │        │
          ▼         ▼         ▼         ▼        ▼
      ┌────────┐┌────────┐┌────────┐┌──────┐┌──────┐
      │internet││social  ││academic││ news ││market│
      │-report ││-report ││-report ││-rprt ││-rprt │
      │.md     ││.md     ││.md     ││.md   ││.md   │
      └────────┘└────────┘└────────┘└──────┘└──────┘
```

### Sub-agent Isolation Rules

1. **No communication during research** — Sub-agents do not share findings until synthesis. This prevents anchoring bias.
2. **Independent tool usage** — Each sub-agent uses only its designated MCP tools.
3. **Structured output** — Every sub-agent returns the same structure: findings, source URLs, confidence, gaps.
4. **Timeout-aware** — If a sub-agent times out, its partial results are still collected.

### Sub-agent Details

| Sub-Agent | Primary MCP | Source Domains | Output |
|---|---|---|---|
| Internet Researcher | `web-search-mcp` | General web, blogs, docs, tutorials | `internet-report.md` |
| Social Researcher | `web-search-mcp` | Reddit, HN, X/Twitter, forums | `social-report.md` |
| Academic Researcher | `paper-search-mcp` | arXiv, PubMed, Semantic Scholar, CrossRef, DOAJ | `academic-report.md` |
| News Researcher | `tavily`, `web-search-mcp` | Tech news, press releases, announcements | `news-report.md` |
| Market Researcher | `tavily`, `playwright` | Competitor sites, market reports, product pages | `market-report.md` |

---

## Memory Model / Model Memori

Cariak uses the Memory MCP to persist a knowledge graph across sessions. This enables cumulative research — Cariak can build on prior research rather than starting from scratch.

Cariak menggunakan Memory MCP untuk menyimpan knowledge graph lintas sesi. Ini memungkinkan riset kumulatif — Cariak dapat membangun di atas riset sebelumnya daripada mulai dari nol.

### Entity Types / Tipe Entitas

The memory graph contains 6 entity types:

Graph memori berisi 6 tipe entitas:

```
┌─────────────────────────────────────────────────────────┐
│                   MEMORY GRAPH                           │
│                                                          │
│  ┌─────────────────┐         ┌──────────────────┐       │
│  │ ResearchProject │──HAS──→│ ResearchQuestion │       │
│  └────────┬────────┘         └────────┬─────────┘       │
│           │                           │                  │
│           │ HAS                       │ INVESTIGATED_BY  │
│           │                           │                  │
│           ▼                           ▼                  │
│  ┌─────────────────┐         ┌──────────────────┐       │
│  │    Advisor      │←─ADVISES│    Sub-agent     │       │
│  └─────────────────┘         │  (researching)   │       │
│                              └────────┬─────────┘       │
│                                       │ PRODUCES         │
│                                       │                  │
│                            ┌──────────┼──────────┐      │
│                            │          │          │      │
│                            ▼          ▼          ▼      │
│                     ┌──────────┐┌─────────┐┌────────┐  │
│                     │  Source  ││ Finding ││ Claim  │  │
│                     └────┬─────┘└────┬────┘└───┬────┘  │
│                          │SUPPORTS    │SUPPORTS  │       │
│                          │            │          │       │
│                          └────────────┴──────────┘      │
│                                       │                  │
│                                       ▼                  │
│                            ┌──────────────────┐          │
│                            │ConfidenceAssessm │          │
│                            │      ent         │          │
│                            └──────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

| Entity Type | Purpose | Key Relations |
|---|---|---|
| **ResearchProject** | Top-level container for a research session | HAS → ResearchQuestion |
| **ResearchQuestion** | The clarified research question | INVESTIGATED_BY → Sub-agent |
| **Advisor** | Expert persona generated by `advising` skill | ADVISES → ResearchQuestion |
| **Source** | A cited source (URL, paper, page) | SUPPORTS → Claim |
| **Finding** | A raw finding from a sub-agent | SUPPORTS → Claim |
| **Claim** | A synthesized claim in the final report | HAS_ASSESSMENT → ConfidenceAssessment |
| **ConfidenceAssessment** | Confidence tier (High/Medium/Low) + rationale | — |

### Memory Lifecycle

1. **Create** — `remembering` skill creates entities and relations after the Quality Gate passes.
2. **Query** — `pitching` skill searches memory for related prior research at the start of a new session.
3. **Augment** — New findings can be added as observations to existing entities in future sessions.
4. **Cross-reference** — The `synthesizing` skill can query memory to find prior findings that support or contradict new claims.

---

## Document Generation Flow / Alur Pembuatan Dokumen

Document generation is routed by the **Clarify Gate** — the `pitching` skill determines which documents the user needs based on their research question.

Pembuatan dokumen dirutekan oleh **Clarify Gate** — skill `pitching` menentukan dokumen mana yang dibutuhkan pengguna berdasarkan pertanyaan riset mereka.

```
USER REQUEST
    │
    ▼
┌─────────────────────┐
│   CLARIFY GATE      │
│   (pitching skill)  │
│                     │
│  What does the user │
│  need?              │
└──────────┬──────────┘
           │
    ┌──────┼──────────────────┬─────────────────┐
    │      │                  │                 │
    ▼      ▼                  ▼                 ▼
┌────────┐┌────────┐    ┌───────────┐   ┌────────────┐
│Always- ││Always- │    │ On-demand │   │ On-demand  │
│on:     ││on:     │    │ (auto-    │   │ (explicitly│
│research││referen │    │  detected │   │  requested)│
│-report ││-ces.json│   │  from     │   │            │
│.md     ││        │    │  question)│   │            │
└────────┘└────────┘    └─────┬─────┘   └─────┬──────┘
                             │               │
                             ▼               ▼
                    ┌────────────────┐ ┌────────────────┐
                    │ Auto-routed:   │ │ User-routed:   │
                    │                │ │                │
                    │ • prd.md       │ │ Any of the 12  │
                    │ • tech-spec.md │ │ on-demand docs │
                    │ • adr.md       │ │                │
                    │ • feasibility  │ │                │
                    │   -study.md    │ │                │
                    │ • ...          │ │                │
                    └────────────────┘ └────────────────┘
                             │               │
                             └───────┬───────┘
                                     ▼
                    ┌────────────────────────┐
                    │   SYNTHESIZING SKILL    │
                    │                        │
                    │  Generates all routed   │
                    │  documents in parallel  │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   VALIDATING (Iron Law) │
                    │   Every claim sourced?  │
                    └───────────┬────────────┘
                                │ pass
                                ▼
                    ┌────────────────────────┐
                    │  docs/cariak/*.md      │
                    │  docs/cariak/*.json    │
                    └────────────────────────┘
```

### Routing Logic

| Question Type | Auto-routed Documents |
|---|---|
| "Should we build X?" | feasibility-study, risk-register, recommendation-report |
| "How does X work?" | technical-report, literature-review |
| "What should we build?" | prd, competitive-analysis |
| "How should we architect X?" | tech-spec, adr, implementation-roadmap |
| "Is X true / supported?" | research-proposal, experiment-design, literature-review |

Users can also explicitly request any of the 12 on-demand documents regardless of auto-routing.

---

## MCP Dependencies / Dependensi MCP

Cariak depends on 5 MCP servers. Each has a specific role in the research pipeline.

Cariak bergantung pada 5 MCP server. Masing-masing memiliki peran spesifik dalam pipeline riset.

```
┌──────────────────────────────────────────────────────────────┐
│                        CARIAK                                 │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   SKILLS (9)                          │   │
│  │  pitching · grinding · advising · planning            │   │
│  │  researching · synthesizing · validating              │   │
│  │  reflecting · remembering                             │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                   │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │               │
│         ▼                 ▼                 ▼               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │web-search-mcp│ │paper-search  │ │   tavily     │        │
│  │              │ │    -mcp      │ │              │        │
│  │ Web, social, │ │ Academic     │ │ Deep research│        │
│  │ GitHub, HN,  │ │ papers, 20+  │ │ crawling,    │        │
│  │ Reddit, X    │ │ repositories │ │ extraction   │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│         │                 │                 │               │
│         └─────────────────┼─────────────────┘               │
│                           │                                   │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │               │
│         ▼                 ▼                 ▼               │
│  ┌──────────────┐ ┌──────────────┐                        │
│  │   memory     │ │  playwright  │                        │
│  │              │ │              │                        │
│  │ Knowledge    │ │ Browser      │                        │
│  │ graph,       │ │ automation   │                        │
│  │ entities,    │ │ for dynamic  │                        │
│  │ relations    │ │ pages        │                        │
│  └──────────────┘ └──────────────┘                        │
└──────────────────────────────────────────────────────────────┘
```

| MCP Server | Used By | Purpose |
|---|---|---|
| `web-search-mcp` | Internet Researcher, Social Researcher, News Researcher | Web search, page extraction, social platform search |
| `paper-search-mcp` | Academic Researcher | Academic paper search, full-text extraction |
| `tavily` | News Researcher, Market Researcher | Deep research, site crawling, content extraction |
| `memory` | Remembering skill, Pitching skill | Persist entities/relations, query prior research |
| `playwright` | Market Researcher | Browser automation for JS-rendered/login-gated pages |

---

## File Structure / Struktur File

```
cariak/
├── README.md                          # English README (canonical)
├── README.id.md                       # Indonesian README
├── LICENSE                            # MIT License
├── CONTRIBUTING.md                    # Contributing guidelines (bilingual)
├── CHANGELOG.md                       # Version history
├── .gitignore                         # Git ignore rules
│
├── skills/                            # 9 skill directories
│   ├── pitching/
│   │   ├── skill.md                   # Skill definition
│   │   ├── input.md                   # Input contract
│   │   ├── output.md                  # Output contract
│   │   └── gate.md                    # Clarify Gate criteria
│   ├── grinding/
│   ├── advising/
│   ├── planning/
│   ├── researching/
│   │   ├── skill.md
│   │   ├── sub-agents/
│   │   │   ├── internet-researcher.md
│   │   │   ├── social-researcher.md
│   │   │   ├── academic-researcher.md
│   │   │   ├── news-researcher.md
│   │   │   └── market-researcher.md
│   │   └── output.md
│   ├── synthesizing/
│   ├── validating/
│   │   ├── skill.md
│   │   └── gate.md                    # Validation Gate (Iron Law)
│   ├── reflecting/
│   │   ├── skill.md
│   │   └── gate.md                    # Quality Gate
│   └── remembering/
│
├── references/                        # CSV reference files (sourced)
│   ├── search-methods.csv
│   ├── academic-search-methods.csv
│   ├── source-taxonomy.csv
│   ├── confidence-rubric.csv
│   ├── citation-format.csv
│   └── bias-checklist.csv
│
├── docs/
│   ├── architecture.md                # This file (bilingual)
│   ├── cariak/                        # Runtime output (gitignored)
│   │   ├── research-report.md         # Generated
│   │   ├── references.json            # Generated
│   │   └── ...                        # On-demand docs
│   └── examples/
│       └── guava-cut-cost/            # Example research output
│           ├── research-report.md
│           ├── references.json
│           ├── feasibility-study.md
│           └── sub-agent-reports/
│               ├── internet-report.md
│               ├── social-report.md
│               ├── academic-report.md
│               ├── news-report.md
│               └── market-report.md
│
└── templates/                         # Document output templates
    ├── research-report.md
    ├── prd.md
    ├── tech-spec.md
    ├── adr.md
    ├── competitive-analysis.md
    ├── risk-register.md
    ├── literature-review.md
    ├── experiment-design.md
    ├── feasibility-study.md
    ├── implementation-roadmap.md
    ├── research-proposal.md
    ├── technical-report.md
    └── recommendation-report.md
```

---

<p align="center">
  <em>Cariak architecture is inspired by Pocketto and powered by the MCP ecosystem.</em><br>
  <em>Arsitektur Cariak terinspirasi dari Pocketto dan ditenagai oleh ekosistem MCP.</em>
</p>
