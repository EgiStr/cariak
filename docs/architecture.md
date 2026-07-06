# Cariak v1.3.0 Architecture / Arsitektur Cariak v1.3.0

> This document describes the architecture of Cariak, an open-source deep research agent built as OpenCode skills.
>
> Dokumen ini mendeskripsikan arsitektur Cariak, agen riset mendalam open-source yang dibangun sebagai OpenCode skills.

---

## Design Principles / Prinsip Desain

Cariak's architecture is built on five core principles, adapted from [Pocketto](https://github.com/rfxlamia/pocketto):

Arsitektur Cariak dibangun di atas lima prinsip inti, diadaptasi dari [Pocketto](https://github.com/rfxlamia/pocketto):

### 1. Dialectic Advisors / Advisor Dialektik

Every phase output is challenged by an independent advisor sub-agent before the next phase begins:
- **THESIS**: the phase produces its output (brainstorm, plan, synthesis, claim)
- **ANTITHESIS**: an independent advisor persona challenges the output — hunting blind spots, contradictions, and untested assumptions
- **SYNTHESIS**: the output is revised incorporating the challenge, then proceeds

This is not self-critique. Self-critique suffers from confirmation bias — the same model with the same context cannot reliably detect its own blind spots. Cariak spawns **7 different advisor personas** as independent sub-agents, each specialized for a different failure mode.

### 2. Pocketto Fidelity / Fidelitas Pocketto

Cariak faithfully implements Pocketto's core patterns:
- **Skill = single responsibility** — Each skill does one thing well.
- **Hard Gates** — Phase transitions require explicit quality validation.
- **Phase pipelines** — Skills execute in sequence with defined input/output contracts.
- **LLM-to-LLM advisor curation** — Advisor personas are independent sub-agents that challenge outputs, inspired by Pocketto's advisor pattern.

### 3. Sourced Claims / Klaim Bersumber

The **Iron Law: NO CLAIM WITHOUT SOURCE** is enforced architecturally, not just by convention:
- The `validating` skill is a Hard Gate that checks every claim for an inline citation `[n]`.
- Unsourced claims are rejected and sent back to `synthesizing` for repair.
- `references.json` is the canonical citation graph — every `[n]` must resolve to an entry.

### 4. Parallel Research / Riset Paralel

Research is decomposed into **5 independent streams** that run concurrently:
- Each sub-agent operates in isolation with its own tool set.
- Sub-agents do not communicate during research — this prevents anchoring bias.
- Results converge only at the `synthesizing` skill.
- Each sub-agent's findings are challenged by a Domain Expert advisor.

### 5. Convergent Synthesis / Sintesis Konvergen

Five parallel research streams produce raw findings. The `synthesizing` skill:
- Merges findings, resolving conflicts and duplicates.
- Assigns confidence tiers (High / Medium / Low) to each claim.
- Routes to document templates based on the Clarify Gate decision.
- Produces both always-on outputs (`research-report.docx`, `references.json`) and any on-demand documents.
- Passes the merged synthesis to the Contradiction Hunter advisor for adversarial review.

---

## The Dialectic Advisor Pattern / Pola Advisor Dialektik

### Why Simple Self-Critique Fails / Mengapa Self-Critique Sederhana Gagal

Most AI agents implement quality control through self-critique: "review your own output for errors." This approach suffers from three fundamental flaws:

Kebanyakan agen AI menerapkan kontrol kualitas melalui self-critique: "tinjau output Anda sendiri untuk mencari kesalahan." Pendekatan ini menderita tiga kelemahan fundamental:

1. **Confirmation bias** — An LLM that generates a claim is primed to defend it, not attack it. When the same model reviews its own work, it consistently rates its own outputs as higher quality than they are.
2. **Blind spot persistence** — The same model with the same context has the same knowledge gaps and reasoning blind spots. Asking it to "find what you missed" is structurally impossible.
3. **No adversarial pressure** — Without a genuine adversary arguing against the claims, weak reasoning passes unchallenged. The system has no incentive to find counter-evidence.

### The Dialectic Solution / Solusi Dialektik

Cariak v1.3.0 implements the dialectic method (THESIS → ANTITHESIS → SYNTHESIS) at every phase. Each phase produces a **thesis** (its output), which is then challenged by an independent advisor sub-agent producing the **antithesis** (a challenge report), and finally both are merged into a **synthesis** (a revised output incorporating the challenge).

Cariak v1.3.0 menerapkan metode dialektik (TESIS → ANTITESIS → SINTESIS) di setiap fase. Setiap fase menghasilkan **tesis** (outputnya), yang kemudian ditantang oleh sub-agen advisor independen yang menghasilkan **antitesis** (laporan tantangan), dan akhirnya keduanya digabungkan menjadi **sintesis** (output yang direvisi dengan memasukkan tantangan).

```
Phase Output          Advisor Challenge            Revised Output
(THESIS)       →      (ANTITHESIS)          →     (SYNTHESIS)

research-streams.md → Methodologist: "edge cases?" → revised-streams.md
research-plan.md    → System Architect: "deps?"    → revised-plan.md
sub-agent-report.md → Domain Expert: "bias?"       → revised-report.md
synthesis draft     → Contradiction Hunter         → revised-synthesis
verified claims     → Falsificationist             → falsified-claims
quality assessment  → Blind Spot Auditor           → gap-filled-report
```

### How Independent Sub-Agent Advisors Prevent Bias / Bagaimana Sub-Agen Advisor Independen Mencegah Bias

The key architectural insight: advisor personas run as **separate sub-agents** with their own context, not as additional prompts in the same session.

Wawasan arsitektur kunci: persona advisor berjalan sebagai **sub-agen terpisah** dengan konteks mereka sendiri, bukan sebagai prompt tambahan di sesi yang sama.

- **Isolated context**: The advisor sub-agent receives only the phase output + challenge instructions. It does not see the reasoning that produced the output, preventing it from inheriting the same confirmation bias.
- **Persona-grounded**: Each advisor operates under a specific persona (e.g., "You are a Falsificationist. Your job is to prove claims WRONG"). This persona serves as an anti-bias primer.
- **Mandatory challenge**: Every phase has a Hard Gate requiring advisor sign-off. No phase output is accepted without surviving adversarial scrutiny.

### Advisor Persona Rotation / Rotasi Persona Advisor

7 different personas challenge 7 different phases, each targeting a specific failure mode:

7 persona berbeda menantang 7 fase berbeda, masing-masing menargetkan mode kegagalan spesifik:

| Phase | Advisor Persona | Challenge Question | Challenge Output | Gate |
|---|---|---|---|---|
| **pitching** | Devil's Advocate + Domain Expert | "What blind spots? What untested assumptions? What's the WRONG question we might be asking?" | `blind_spots` + `missing_angles` | GATE 2: ADVISOR CHALLENGE MANDATORY |
| **grinding** | Methodologist + Skeptic | "Are GWT scenarios truly testable? Are they granular enough? What edge cases are missing?" | `granularity_assessment` + `edge_cases` | GATE 2.5: ANTITHESIS BEFORE SCOPE |
| **planning** | System Architect + Ops Reviewer | "Are tasks truly independent? Hidden dependencies? Is each task <10 min to complete?" | `independence_check` + `dependency_audit` | GATE 1.5: ANTITHESIS BEFORE PLAN |
| **researching** | Domain Expert (rotated per topic) | "Is this finding biased? What sources contradict it? What's the confidence level?" | `bias_check` + `counter_evidence` + `confidence_audit` | GATE 4: PER-FINDING ADVISOR REVIEW |
| **synthesizing** | Contradiction Hunter + Devil's Advocate | "Where do sources disagree? What's being cherry-picked? What narrative is being forced?" | `contradiction_list` + `cherry_pick_audit` | GATE 2.5: ANTITHESIS BEFORE REPORT |
| **validating** | Falsificationist (Popper-style) | "How would you PROVE each claim wrong? What evidence would flip the verdict? What's the strongest counter-argument?" | `falsification_test` + `counter_argument` | LAW 4: ADVISOR FALSIFICATION MANDATORY |
| **reflecting** | Blind Spot Auditor | "What did we NOT research? What source types are missing? What's the weakest finding?" | `blind_spot_list` + `gap_analysis` | Blind Spot Audit completion in PASS conditions |

> Source for persona rotation: `references/advisor-phase-mapping.csv`

---

## Skill Pipeline / Pipeline Skill

The pipeline now includes advisor gates at every phase. Each phase produces a thesis, an advisor produces the antithesis, and the synthesis advances to the next phase.

Pipeline kini mencakup gerbang advisor di setiap fase. Setiap fase menghasilkan tesis, advisor menghasilkan antitesis, dan sintesis maju ke fase berikutnya.

```
USER INPUT
    │
    ▼
┌────────────────────────────────────────────────────────────────┐
│                    SKILL PIPELINE (v1.3.0)                      │
│                                                                 │
│  ┌────────────┐  ┌────────────────────┐                        │
│  │ 1. PITCHING│─→│ advisor: Devil's   │──Clarify Gate──┐       │
│  │    (gate)  │  │ Advocate           │               │       │
│  └────────────┘  └────────────────────┘               │       │
│          THESIS → ANTITHESIS → SYNTHESIS              │       │
│                                                       ▼       │
│  ┌────────────┐  ┌────────────────────┐                        │
│  │ 2. GRINDING│─→│ advisor: Methodolo-│                        │
│  │            │  │ gist + Skeptic     │                        │
│  └────────────┘  └────────────────────┘                        │
│          THESIS → ANTITHESIS → SYNTHESIS                       │
│                                                                 │
│  ┌────────────┐  ┌────────────────────┐                        │
│  │ 3. PLANNING│─→│ advisor: System    │                        │
│  │            │  │ Architect          │                        │
│  └────────────┘  └────────────────────┘                        │
│          THESIS → ANTITHESIS → SYNTHESIS                       │
│                                                                 │
│  ┌────────────────────────────────────────────────┐           │
│  │ 4. RESEARCHING  (5 parallel sub-agents)         │           │
│  │    ┌────────┐ ┌────────┐ ┌────────┐            │           │
│  │    │Internet│ │Social  │ │Academic│            │           │
│  │    └────────┘ └────────┘ └────────┘            │           │
│  │    ┌────────┐ ┌────────┐                       │           │
│  │    │  News  │ │ Market │                       │           │
│  │    └────────┘ └────────┘                       │           │
│  └────────────────────┬───────────────────────────┘           │
│                       │                                       │
│  ┌────────────────────────────────┐                            │
│  │ advisor: Domain Expert ×5      │                            │
│  │ (rotated per topic)            │                            │
│  └────────────────────────────────┘                            │
│          THESIS → ANTITHESIS → SYNTHESIS                       │
│                                                                 │
│  ┌──────────────┐ ┌────────────────────┐                      │
│  │ 5.SYNTHESIZE │─→│ advisor: Contra-   │                      │
│  │              │  │ diction Hunter     │                      │
│  └──────┬───────┘ └────────────────────┘                      │
│         │     THESIS → ANTITHESIS → SYNTHESIS                  │
│         ▼                                                      │
│  ┌──────────────┐ ┌────────────────────┐                      │
│  │ 6.VALIDATING │─→│ advisor: Falsifica-│                      │
│  │    (gate)    │  │ tionist (Popper)   │                      │
│  └──────┬───────┘ └────────────────────┘                      │
│         │     THESIS → ANTITHESIS → SYNTHESIS                  │
│         │                                       │ fail         │
│         │ pass                                  │──→ back      │
│         ▼                                       │  to synth    │
│  ┌──────────────┐ ┌────────────────────┐                      │
│  │ 7.REFLECTING │─→│ advisor: Blind    │                      │
│  │    (gate)    │  │ Spot Auditor      │                      │
│  └──────┬───────┘ └────────────────────┘                      │
│         │     THESIS → ANTITHESIS → SYNTHESIS                  │
│         ▼                                                      │
│  ┌──────────────┐                                             │
│  │ 8.REMEMBERING│  Persist to Memory MCP                       │
│  └──────┬───────┘                                             │
│         │                                                      │
└─────────┼──────────────────────────────────────────────────────┘
          │
          ▼
   ╔═══════════════════════════════╗
   ║        OUTPUT (v1.3.0)         ║
   ║  • research-report.docx       ║  (always-on, primary)
   ║  • research-report.md         ║  (always-on, fallback)
   ║  • references.json            ║  (always-on)
   ║  • + on-demand documents       ║  (DOCX primary, MD fallback)
   ╚═══════════════════════════════╝
```

### Hard Gates

| Gate | Skill | Criteria | On Fail |
|---|---|---|---|
| **Clarify Gate** | pitching | Research question is specific, scoped, and confirmed by user | Re-prompt user for clarification |
| **Advisor Gate** | every phase | Advisor challenge completed with no unresolved issues | Return to phase for revision |
| **Validation Gate** | validating | Every claim has a source citation `[n]` resolving to `references.json` | Return to synthesizing for repair |
| **Quality Gate** | reflecting | Source coverage (4+ per major claim), bias check (multiple perspectives), confidence grading (appropriate hedging), blind spot audit complete | Return to researching for gap-filling |

---

## Sub-agent Architecture / Arsitektur Sub-agen

The `researching` skill launches 5 parallel sub-agents plus 1 Domain Expert advisor per sub-agent finding. Each sub-agent is an isolated research unit with specialized source domains and MCP tools.

Skill `researching` meluncurkan 5 sub-agen paralel plus 1 advisor Domain Expert per temuan sub-agen. Setiap sub-agen adalah unit riset terisolasi dengan domain sumber dan MCP tools khusus.

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
          │    ┌────┴────┬────┴────┬────┴───┐    │
          │    │         │         │        │    │
          ▼    ▼         ▼         ▼        ▼    ▼
     ┌──────────────────────────────────────────────┐
     │          ADVISOR: Domain Expert ×5           │
     │  (one per sub-agent, rotated per topic)     │
     │  bias_check + counter_evidence + conf_audit │
     └──────────────────────────────────────────────┘
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
5. **Advisor review per finding** — A Domain Expert advisor reviews each sub-agent's findings before synthesis, checking for bias, missing counter-evidence, and confidence accuracy.

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

The memory graph contains 8 entity types (expanded in v1.3.0):

Graph memori berisi 8 tipe entitas (diperluas di v1.3.0):

```
┌─────────────────────────────────────────────────────────┐
│                   MEMORY GRAPH (v1.3.0)                  │
│                                                          │
│  ┌─────────────────┐         ┌──────────────────┐       │
│  │ ResearchProject │──HAS──→│ ResearchQuestion │       │
│  └────────┬────────┘         └────────┬─────────┘       │
│           │                           │                  │
│           │ RUNS_WITH                 │ INVESTIGATED_BY  │
│           │                           │                  │
│           ▼                           ▼                  │
│  ┌─────────────────┐         ┌──────────────────┐       │
│  │ ResearchSession │──HAS──→│ AdvisorPhase     │       │
│  │                 │   (new) │ (new)            │       │
│  └─────────────────┘         └────────┬─────────┘       │
│                                       │ CHALLENGES       │
│                                       ▼                  │
│                              ┌──────────────────┐       │
│                              │    Sub-agent     │       │
│                              │  (researching)   │       │
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

| Entity Type | Purpose | Key Relations | v1.3.0 |
|---|---|---|---|
| **ResearchProject** | Top-level container for a research session | HAS → ResearchQuestion | — |
| **ResearchQuestion** | The clarified research question | INVESTIGATED_BY → Sub-agent | — |
| **ResearchSession** | A specific execution of the pipeline | RUNS_WITH → AdvisorPhase | **NEW** |
| **AdvisorPhase** | Records advisor challenge at a specific phase | CHALLENGES → Sub-agent findings | **NEW** |
| **Advisor** | Expert persona generated by advisor sub-agent | ADVISES → ResearchQuestion | Updated |
| **Source** | A cited source (URL, paper, page) | SUPPORTS → Claim | — |
| **Finding** | A raw finding from a sub-agent | SUPPORTS → Claim | — |
| **Claim** | A synthesized claim in the final report | HAS_ASSESSMENT → ConfidenceAssessment | — |
| **ConfidenceAssessment** | Confidence tier (High/Medium/Low) + rationale | — | — |

#### ResearchSession Observations (new in v1.3.0)

Each `ResearchSession` entity records `advisor_phase` observations documenting every advisor challenge:

Setiap entitas `ResearchSession` mencatat observasi `advisor_phase` yang mendokumentasikan setiap tantangan advisor:

```
ResearchSession entity:
  observations:
    - "advisor_phase: pitching → Devil's Advocate → 3 blind spots found, 1 assumption challenged"
    - "advisor_phase: grinding → Methodologist + Skeptic → 2 edge cases identified"
    - "advisor_phase: planning → System Architect → 1 hidden dependency found"
    - "advisor_phase: researching → Domain Expert ×5 → 2 bias flags, 1 counter-evidence added"
    - "advisor_phase: synthesizing → Contradiction Hunter → 3 contradictions resolved"
    - "advisor_phase: validating → Falsificationist → 1 claim falsified, revised"
    - "advisor_phase: reflecting → Blind Spot Auditor → 2 research gaps documented"
```

### Memory Lifecycle

1. **Create** — `remembering` skill creates entities and relations after the Quality Gate passes, including `ResearchSession` with full `advisor_phase` observations.
2. **Query** — `pitching` skill searches memory for related prior research at the start of a new session.
3. **Augment** — New findings can be added as observations to existing entities in future sessions.
4. **Cross-reference** — The `synthesizing` skill can query memory to find prior findings that support or contradict new claims.

---

## Document Generation Flow / Alur Pembuatan Dokumen

Document generation is routed by the **Clarify Gate** — the `pitching` skill determines which documents the user needs based on their research question.

Pembuatan dokumen dirutekan oleh **Clarify Gate** — skill `pitching` menentukan dokumen mana yang dibutuhkan pengguna berdasarkan pertanyaan riset mereka.

**v1.3.0 Update**: Primary output format is DOCX (professional-grade), with MD as fallback. Generated via `npx cariak-pi report`.

**Update v1.3.0**: Format output utama adalah DOCX (kelas profesional), dengan MD sebagai cadangan. Dihasilkan via `npx cariak-pi report`.

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
│(DOCX   ││        │    │  question)│   │            │
│primary)││        │    │           │   │            │
└────────┘└────────┘    └─────┬─────┘   └─────┬──────┘
                             │               │
                             ▼               ▼
                    ┌────────────────┐ ┌────────────────┐
                    │ Auto-routed:   │ │ User-routed:   │
                    │                │ │                │
                    │ • prd.docx     │ │ Any of the 12  │
                    │ • tech-spec    │ │ on-demand docs │
                    │   .docx        │ │ (DOCX primary) │
                    │ • adr.docx     │ │                │
                    │ • feasibility  │ │                │
                    │   -study.docx  │ │                │
                    │ • ...          │ │                │
                    └────────────────┘ └────────────────┘
                             │               │
                             └───────┬───────┘
                                     ▼
                    ┌────────────────────────┐
                    │   SYNTHESIZING SKILL    │
                    │                        │
                    │  npx cariak-pi report   │
                    │  --template <name>      │
                    │  → DOCX primary         │
                    │  → MD fallback          │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   Advisor: Contradiction│
                    │   Hunter                │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   VALIDATING (Iron Law) │
                    │   Every claim sourced?  │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   Advisor: Falsification-│
                    │   ist (Popper-style)     │
                    └───────────┬────────────┘
                                │ pass
                                ▼
                    ┌───────────────────────┐
                    │   REFLECTING (Quality) │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼────────────┐
                    │   Advisor: Blind Spot   │
                    │   Auditor              │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   FINAL OUTPUT          │
                    │                        │
                    │   docs/cariak/         │
                    │   ├── research-report   │
                    │   │     .docx           │
                    │   ├── references.json   │
                    │   ├── feasibility-study │
                    │   │     .docx           │
                    │   └── sub-agent-reports/ │
                    │       ├── internet-     │
                    │       │     report.md   │
                    │       ├── social-report │
                    │       │     .md         │
                    │       ├── academic-     │
                    │       │     report.md   │
                    │       ├── news-report   │
                    │       │     .md         │
                    │       └── market-report │
                    │             .md         │
                    └───────────────────────┘
```

---

## File Structure / Struktur File

```
cariak/
├── skills/                               # 9 SKILL.md (pipeline phases)
│   ├── SKILL.md                          #   cariak-pitching
│   ├── SKILL.md                          #   cariak-grinding
│   ├── SKILL.md                          #   cariak-planning
│   ├── SKILL.md                          #   cariak-researching
│   ├── SKILL.md                          #   cariak-synthesizing
│   ├── SKILL.md                          #   cariak-validating
│   ├── SKILL.md                          #   cariak-reflecting
│   └── SKILL.md                          #   cariak-remembering
├── advisors/                             # 7 advisor persona sub-agents (NEW)
│   ├── devil-advocate.md
│   ├── methodologist-skeptic.md
│   ├── system-architect.md
│   ├── domain-expert.md
│   ├── contradiction-hunter.md
│   ├── falsificationist.md
│   └── blind-spot-auditor.md
├── subagents/                            # 5 researcher sub-agents
│   ├── internet-researcher.md
│   ├── social-researcher.md
│   ├── academic-researcher.md
│   ├── news-researcher.md
│   └── market-researcher.md
├── templates/                            # Document output templates
│   ├── research-report.docx              # (primary)
│   ├── research-report.md                # (fallback)
│   ├── prd.md
│   ├── tech-spec.md
│   ├── adr.md
│   ├── competitive-analysis.md
│   ├── risk-register.md
│   ├── literature-review.md
│   ├── experiment-design.md
│   ├── feasibility-study.md
│   ├── implementation-roadmap.md
│   ├── research-proposal.md
│   ├── technical-report.md
│   └── recommendation-report.md
├── references/                           # Reference data
│   ├── advisor-phase-mapping.csv         # Advisor persona rotation table (NEW)
│   ├── advisor-personas.csv
│   ├── brainstorming-methods.csv
│   ├── citation-standards.csv
│   ├── coverage-matrix.csv
│   ├── question-frameworks.csv
│   ├── research-methods.csv
│   └── source-taxonomy.csv
├── cli/                                  # cariak-pi CLI
│   ├── setup.js
│   ├── doctor.js
│   ├── bundle.js
│   ├── validate.js
│   └── report.js                         # DOCX generation (NEW)
├── assets/                               # logos, branding
├── docs/
│   ├── examples/
│   │   └── guava-cut-cost/
│   │       ├── research-report.docx
│   │       ├── references.json
│   │       ├── feasibility-study.docx
│   │       └── sub-agent-reports/
│   │           ├── internet-report.md
│   │           ├── social-report.md
│   │           ├── academic-report.md
│   │           ├── news-report.md
│   │           └── market-report.md
│   └── architecture.md                   # This file
├── package.json
├── llms.txt
├── README.md                             # English docs
├── README.id.md                          # Indonesian docs
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE
```

---

<p align="center">
  <em>Cariak v1.3.0 — Dialectic deep research. Every claim challenged, every blind spot hunted.</em><br>
  <em>Cariak v1.3.0 — Riset mendalam dialektik. Setiap klaim ditantang, setiap titik buta diburu.</em>
</p>
