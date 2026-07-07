---
name: cariak-planning
description: Decompose a research spec into executable sub-agent tasks. Use AFTER cariak-grinding when the research-spec.md exists and before cariak-researching. Routes output documents from Clarify Gate responses, maps every research question to specific sources and sub-agents, then builds a research plan. Trigger on "plan research", "research plan", "decompose research", "plan eksekusi", "bikin rencana riset", or when cariak-grinding hands off.
---

# Research Planning / Perencanaan Riset

<!-- CARIAK SKILL: cariak-planning - v1.1 -->

## English

### Core Principle

> **Decompose before dispatch. Every research question maps to specific sources and sub-agents.**

A research spec describes *what* to find. A research plan describes *how* to find it — which sub-agent searches which sources with which queries, and how the results route to which output documents. Planning without decomposition produces parallel agents that overlap, miss sources, or produce findings that don't map back to the original questions.

### When to Use

- `cariak-grinding` has produced a `research-spec.md` and handed off.
- User says "plan research", "research plan", "decompose", "bikin rencana".
- A spec exists but no plan has been built yet.
- Re-planning is needed after `cariak-reflecting` triggered a re-research loop.

### Do NOT Use

- If no `research-spec.md` exists → use `cariak-grinding` first.
- If the user wants to refine the problem or brainstorm → use `cariak-pitching`.
- If the spec exists and a plan exists and the user wants to execute → use `cariak-researching`.
- If the user wants advisor counsel on the spec → use `cariak-advising`.

### Boundary Table

| Adjacent Skill | Relationship | Boundary Rule |
|---|---|---|
| `cariak-grinding` | Upstream | Produces `research-spec.md` that planning consumes. Planning does not modify the spec. |
| `cariak-researching` | Downstream | Consumes `research-plan.md`. Researching does not deviate from assigned sub-agent tasks. |
| `cariak-advising` | Lateral | May be called during planning to validate source selection, but is not required. |
| `cariak-reflecting` | Feedback | May trigger re-planning if coverage gaps are found post-research. |

### Hard Gates

**GATE 0: SPEC VERIFICATION MUST COMPLETE BEFORE DECOMPOSITION**

Before any decomposition begins, verify:
1. `research-spec.md` exists at `docs/cariak/spec/YYYY-MM-DD-slug/research-spec.md`.
2. The spec contains at least one `### RQ-N: [Question]` block with GWT format.
3. The spec has a `## Scope` section.
4. The spec has a `## Success Metrics` section.
5. If the topic is technical, scientific, ML, data, hardware, infrastructure, product, or implementation-heavy, the spec has a `## Engineering Lens` section.

If ANY check fails → STOP. Do not decompose. Report the missing element and direct the user to `cariak-grinding`.

**GATE 1: EVERY QUESTION MUST HAVE ASSIGNED SUB-AGENT**

Each RQ-N in the spec must map to at least one sub-agent assignment block:

```
- RQ-1:
  - internet-researcher: ["query 1", "query 2"]
  - academic-researcher: ["query 1"]
  - market-researcher: ["query 1"]
```

No RQ may be left unassigned. No sub-agent may be assigned without at least one query.

**GATE 1.5: ADVISOR COVERAGE CHALLENGE MANDATORY — ANTITHESIS BEFORE PLAN**

The System Architect + Ops Reviewer advisor challenge (Phase 3.5) is not optional. Before writing the final research plan:
1. The task decomposition (thesis) must be challenged by an independent advisor (antithesis).
2. The advisor must check task independence, granularity, hidden dependencies, and parallel safety.
3. The advisor output must be incorporated into the final research plan in Phase 4.
4. Do not skip the antithesis step. Proceeding from decomposition directly to the plan without the advisor challenge risks missed dependencies and oversized tasks.

**GATE 2: USER MUST APPROVE PLAN BEFORE DISPATCH**

Present the plan summary to the user. Do NOT auto-invoke `cariak-researching`. The user must confirm or request changes. Only after explicit confirmation ("yes", "go", "execute", "lanjut") may the handoff proceed.

### Structural Method

This phase uses real academic methods:
- **Systematic Review Protocol** (Kitchenham & Charters, 2007, EBSE Technical Report) — reproducible search strategy, source taxonomy, inclusion/exclusion criteria.
- Also draws from **Cochrane Handbook Chapter 4** (Higgins & Green, 2011) for systematic search design.


### Phases

#### Phase 0: Preflight

**Actions:**
1. Check Memory MCP for existing project context:
   - `memory_search_nodes(query: "research project <slug>")`
   - If found, load project entity, prior artifacts, decisions.
2. Scan for existing `research-spec.md`:
   - Look in `docs/cariak/spec/` for the most recent spec matching the current topic.
3. Load reference data:
   - `references/source-taxonomy.csv` — source types each sub-agent covers.
   - `references/citation-standards.csv` — citation format per source type.
4. Identify the working directory slug (date + topic keyword).

**Gate 0 check:** Verify spec exists and is well-formed.

#### Phase 1: Parse Spec

**Actions:**
1. Read `research-spec.md` from the spec directory.
2. Extract:
   - Research questions (RQ-1, RQ-2, ...).
   - GWT blocks (Given / When / Then).
   - Scope constraints.
   - Success metrics.
   - Clarify Gate responses (doc-routing, depth, audience).
3. Build an internal question registry:
   ```
   RQ-1: "How does X compare to Y?"
     Given: context
     When: research approach
     Then: expected finding
   RQ-2: ...
   ```
4. If `## Engineering Lens` exists, build an implementation evidence registry:
   - First principles → academic + official docs + standards
   - State of the art → academic + engineering blogs + benchmarks
   - Field practice → industry reports + case studies + commercial docs
   - Implementation architecture → GitHub + docs + engineering blogs
   - Data strategy → datasets + labeling guides + model cards + field protocols
   - Evaluation protocol → papers + benchmarks + standards
   - Failure modes → incident reports + forums + papers + practitioner blogs
   - Tradeoffs → market + benchmarks + architecture docs
   - Alternatives → competitor products + non-AI methods + hybrid systems
   - Unknowns → experiment design + prototype validation tasks

#### Phase 2: Route Output Documents

**Actions:**
1. Review Clarify Gate responses from the spec (doc-routing question).
2. Determine which on-demand documents to produce:
   - `research-report.docx` (always — core output, DOCX primary). Generated via `npx cariak-pi report --template research-report`.
   - `research-report.md` (always — plain text fallback).
   - `references.json` (always — citation database).
   - `executive-summary.docx` (if audience = executive). Generated via `npx cariak-pi report --template recommendation-report`.
   - `technical-deep-dive.docx` (if depth = deep). Generated via `npx cariak-pi report --template technical-report`.
   - `comparison-matrix.docx` (if research involves comparison). Generated via `npx cariak-pi report --template competitive-analysis`.
   - `validation-report.docx` (if validation requested).
3. Record routing decisions in the plan.

**Document format routing table:**

| Document Type | Format (Primary) | Format (Fallback) | Generation Command |
|---|---|---|---|
| `research-report` | `.docx` | `.md` | `npx cariak-pi report --template research-report` |
| `executive-summary` | `.docx` | `.md` | `npx cariak-pi report --template recommendation-report` |
| `technical-deep-dive` | `.docx` | `.md` | `npx cariak-pi report --template technical-report` |
| `comparison-matrix` | `.docx` | `.md` | `npx cariak-pi report --template competitive-analysis` |
| `feasibility-study` | `.docx` | `.md` | `npx cariak-pi report --template feasibility-study` |
| `prd` | `.docx` | `.md` | `npx cariak-pi report --template prd` |
| `tech-spec` | `.docx` | `.md` | `npx cariak-pi report --template tech-spec` |
| `adr` | `.docx` | `.md` | `npx cariak-pi report --template adr` |
| `risk-register` | `.docx` | `.md` | `npx cariak-pi report --template risk-register` |
| `literature-review` | `.docx` | `.md` | `npx cariak-pi report --template literature-review` |
| `experiment-design` | `.docx` | `.md` | `npx cariak-pi report --template experiment-design` |
| `implementation-roadmap` | `.docx` | `.md` | `npx cariak-pi report --template implementation-roadmap` |
| `research-proposal` | `.docx` | `.md` | `npx cariak-pi report --template research-proposal` |

#### Phase 3: Decompose to Sub-agent Tasks

**Actions:**
1. For each RQ-N, select relevant sub-agents based on the question type:
   - "How does X work?" → internet-researcher, academic-researcher.
   - "What do people think about X?" → social-researcher, news-researcher.
   - "What is the market size of X?" → market-researcher, news-researcher.
   - "Is there academic evidence for X?" → academic-researcher.
   - "What are the latest developments in X?" → news-researcher, social-researcher.
2. For each sub-agent assignment, craft 2-4 search queries per agent per question.
3. Query crafting rules:
   - Use keywords from the RQ.
   - Include synonyms and alternative phrasings.
   - For academic: use formal terminology.
   - For social: use colloquial terms and platform-specific syntax.
   - For market: include competitor names and industry terms.

**Gate 1 check:** Every RQ has at least one sub-agent assignment with queries.

#### Phase 3.1: Implementation Evidence Plan (Technical Topics Only)

If the spec contains `## Engineering Lens`, add an implementation-evidence plan. This plan is mandatory for technical research and must include search assignments for:

| Evidence type | Required sources | Example queries |
|---|---|---|
| Repositories | GitHub, GitLab, examples, SDKs | `topic implementation github`, `topic benchmark repo` |
| Official docs | vendor docs, standards, API docs | `topic official documentation`, `topic calibration guide` |
| Benchmarks | papers, MLPerf-style reports, vendor benchmarks | `topic benchmark accuracy latency cost` |
| Datasets / model cards | Kaggle, Hugging Face, papers, dataset portals | `topic dataset`, `topic model card` |
| Standards / patents | ISO, IEEE, WIPO, Google Patents | `topic patent`, `topic standard` |
| Commercial products | product pages, manuals, pricing, case studies | `topic product`, `topic industrial system` |
| Field practice | operator workflows, industry case studies, maintenance docs | `topic field deployment`, `topic production failure` |

**Gate:** If implementation evidence is missing, the research plan must explicitly say `NO IMPLEMENTATION EVIDENCE FOUND YET` and assign re-search queries. Do not let synthesizing pretend implementation guidance is proven without evidence.

#### Phase 3.5: Advisor Coverage Check (ANTITHESIS)

**Goal:** Challenge the task decomposition with a System Architect + Ops Reviewer advisor before building the final plan.

This is the THESIS → ANTITHESIS step. The task decomposition is the thesis. Now an independent advisor must challenge its structure and parallelism.

1. **Dispatch a System Architect + Ops Reviewer advisor sub-agent** (via `cariak-advising`):
   - The advisor is a **different model/persona**, not self-critique.
   - The advisor's job: find hidden dependencies, oversized tasks, missing coverage.
   - The advisor MUST cite sources or explicitly state opinion.
2. **Advisor challenge questions:**
   - "Are tasks truly independent? Can they run in parallel without data races?"
   - "Are any tasks too large? Is the granularity correct — each task should be a single research question, not a topic area?"
   - "What hidden dependencies exist between sub-agent queries that would block parallel execution?"
   - "Are any research questions under-assigned (too few sub-agents) or over-assigned (wasteful overlap)?"
   - "Can each task reasonably complete in <10 minutes of agent time?"
3. **Advisor returns:**
   - Tasks that should be split (too large).
   - Hidden dependencies that need sequencing.
   - Under-covered or over-covered research questions.
   - Granularity recommendations.

**Gate 1.5 check:** Advisor coverage challenge executed BEFORE building the final research plan? If no → halt and run the challenge. The advisor output feeds into Phase 4 (Build Research Plan).

**Output:** Advisor coverage report — split recommendations, dependency warnings, coverage gaps.

#### Phase 4: Build Research Plan

**Actions:**
1. Write `research-plan.md` to `docs/cariak/spec/YYYY-MM-DD-slug/research-plan.md`:

```markdown
# Research Plan: [Topic]
Date: YYYY-MM-DD
Spec: docs/cariak/spec/YYYY-MM-DD-slug/research-spec.md

## Output Documents
- [ ] research-report.docx (core — primary DOCX output)
- [ ] research-report.md (core — fallback)
- [ ] references.json (core)
- [ ] executive-summary.docx (if routed)
- [ ] ...

## Sub-agent Assignments

### RQ-1: [Question]
- **internet-researcher**:
  - Queries: ["query 1", "query 2", "query 3"]
  - Expected sources: blogs, engineering posts, tutorials
- **academic-researcher**:
  - Queries: ["query 1", "query 2"]
  - Expected sources: arXiv, Semantic Scholar
- **social-researcher**:
  - Queries: ["query 1"]
  - Expected sources: Reddit, Hacker News, X

### RQ-2: [Question]
...

## Implementation Evidence Plan
- Repositories: [queries + expected sources]
- Official docs: [queries + expected sources]
- Benchmarks: [queries + expected sources]
- Datasets / model cards: [queries + expected sources]
- Standards / patents: [queries + expected sources]
- Commercial products: [queries + expected sources]
- Field practice: [queries + expected sources]

## Execution Order
All sub-agents dispatched in parallel (see cariak-researching GATE 1).

## Estimated Sources
- Internet: ~10-15 sources
- Social: ~8-12 sources
- Academic: ~5-10 papers
- News: ~5-10 articles
- Market: ~5-10 reports
```

2. Store plan path in Memory MCP:
   - `memory_create_entities` → ResearchArtifact (type: plan, path: ...).

#### Phase 5: Handoff

Present 3-option menu to the user:

```
Research plan ready: docs/cariak/spec/YYYY-MM-DD-slug/research-plan.md

[X sub-agents assigned, Y total queries, Z expected sources]

Options:
1. Execute research → invoke cariak-researching
2. Modify plan → adjust sub-agent assignments or queries
3. Save and stop → plan saved, no execution
```

**Gate 2 check:** Wait for user confirmation before proceeding.

If user chooses option 1 → invoke `cariak-researching`.
If user chooses option 2 → return to Phase 3.
If user chooses option 3 → save and exit.

### Reference Triggers

| Trigger | File | Phase |
|---|---|---|
| Source type mapping | `references/source-taxonomy.csv` | Phase 3 |
| Citation format per source | `references/citation-standards.csv` | Phase 4 |
| Sub-agent definitions | `subagents/*.md` | Phase 3 |
| Spec file | `docs/cariak/spec/YYYY-MM-DD-slug/research-spec.md` | Phase 1 |

### Handoff Artifact

- **Primary output:** `docs/cariak/spec/YYYY-MM-DD-slug/research-plan.md`
- **Memory MCP:** ResearchArtifact entity created with path and type.
- **Handoff target:** `cariak-researching` (on user confirmation).

---

## Bahasa Indonesia

### Prinsip Inti

> **Dekomposisi sebelum dispatch. Setiap pertanyaan riset dipetakan ke sumber dan sub-agen spesifik.**

Spec riset menggambarkan *apa* yang dicari. Rencana riset menggambarkan *bagaimana* mencarinya — sub-agen mana mencari sumber mana dengan query apa, dan bagaimana hasilnya dirutekan ke dokumen output mana. Perencanaan tanpa dekomposisi menghasilkan agen paralel yang tumpang tindih, melewatkan sumber, atau menghasilkan temuan yang tidak terpetai kembali ke pertanyaan asli.

### Kapan Digunakan

- `cariak-grinding` telah menghasilkan `research-spec.md` dan melakukan handoff.
- Pengguna mengatakan "plan research", "research plan", "decompose", "bikin rencana".
- Spec ada tetapi belum ada rencana yang dibuat.
- Re-planning diperlukan setelah `cariak-reflecting` memicu loop re-research.

### JANGAN Digunakan

- Jika tidak ada `research-spec.md` → gunakan `cariak-grinding` lebih dulu.
- Jika pengguna ingin memperbaiki masalah atau brainstorm → gunakan `cariak-pitching`.
- Jika spec dan rencana sudah ada dan pengguna ingin eksekusi → gunakan `cariak-researching`.
- Jika pengguna ingin konsultasi advisor pada spec → gunakan `cariak-advising`.

### Tabel Batasan

| Skill Terkait | Hubungan | Aturan Batasan |
|---|---|---|
| `cariak-grinding` | Hulu | Menghasilkan `research-spec.md` yang dikonsumsi planning. Planning tidak memodifikasi spec. |
| `cariak-researching` | Hilir | Mengonsumsi `research-plan.md`. Researching tidak menyimpang dari tugas sub-agen yang ditugaskan. |
| `cariak-advising` | Lateral | Dapat dipanggil selama planning untuk memvalidasi pemilihan sumber, tetapi tidak wajib. |
| `cariak-reflecting` | Umpan Balik | Dapat memicu re-planning jika coverage gaps ditemukan pasca-riset. |

### Hard Gates

**GATE 0: VERIFIKASI SPEC HARUS SELESAI SEBELUM DEKOMPOSISI**

Sebelum dekomposisi dimulai, verifikasi:
1. `research-spec.md` ada di `docs/cariak/spec/YYYY-MM-DD-slug/research-spec.md`.
2. Spec berisi setidaknya satu blok `### RQ-N: [Pertanyaan]` dengan format GWT.
3. Spec memiliki bagian `## Scope`.
4. Spec memiliki bagian `## Success Metrics`.

Jika ADA pemeriksaan yang gagal → BERHENTI. Jangan dekomposisi. Laporkan elemen yang hilang dan arahkan pengguna ke `cariak-grinding`.

**GATE 1: SETIAP PERTANYAAN HARUS MEMILIKI SUB-AGEN YANG DITUGASKAN**

Setiap RQ-N dalam spec harus dipetakan ke setidaknya satu blok penugasan sub-agen. Tidak ada RQ yang boleh tidak ditugaskan. Tidak ada sub-agen yang ditugaskan tanpa setidaknya satu query.

**GATE 1.5: ADVISOR COVERAGE CHALLENGE WAJIB — ANTITESIS SEBELUM RENCANA**

Challenge advisor System Architect + Ops Reviewer (Fase 3.5) tidak opsional. Sebelum menulis rencana riset final:
1. Dekomposisi tugas (tesis) harus ditantang oleh advisor independen (antitesis).
2. Advisor harus memeriksa independensi tugas, granularitas, dependensi tersembunyi, dan keamanan paralel.
3. Output advisor harus diintegrasikan ke dalam rencana riset final di Fase 4.
4. Jangan lewati langkah antitesis. Melanjutkan dari dekomposisi langsung ke rencana tanpa advisor challenge berisiko dependensi terlewat dan tugas terlalu besar.

**GATE 2: PENGGUNA HARUS MENYETUJUI RENCANA SEBELUM DISPATCH**

Sajikan ringkasan rencana ke pengguna. JANGAN auto-invoke `cariak-researching`. Pengguna harus mengonfirmasi atau meminta perubahan. Hanya setelah konfirmasi eksplisit handoff boleh dilanjutkan.

### Fase

#### Fase 0: Preflight

**Aksi:**
1. Periksa Memory MCP untuk konteks proyek yang ada.
2. Pindai `research-spec.md` yang ada.
3. Muat data referensi: `source-taxonomy.csv`, `citation-standards.csv`.
4. Identifikasi slug direktori kerja (tanggal + kata kunci topik).

**Cek Gate 0:** Verifikasi spec ada dan well-formed.

#### Fase 1: Parse Spec

**Aksi:**
1. Baca `research-spec.md`.
2. Ekstrak: pertanyaan riset (RQ), blok GWT, batasan scope, metrik sukses, respons Clarify Gate.
3. Bangun registry pertanyaan internal.

#### Fase 2: Rutekan Dokumen Output

**Aksi:**
1. Tinjau respons Clarify Gate dari spec (pertanyaan doc-routing).
2. Tentukan dokumen on-demand mana yang akan diproduksi:
   - `research-report.docx` (selalu — output inti, DOCX primer). Dibuat dengan `npx cariak-pi report --template research-report`.
   - `research-report.md` (selalu — fallback plain text).
   - `references.json` (selalu — database kutipan).
   - Dokumen lainnya mengikuti tabel routing format di atas.
3. Catat keputusan routing dalam rencana.

#### Fase 3: Dekomposisi ke Tugas Sub-agen

**Aksi:**
1. Untuk setiap RQ-N, pilih sub-agen yang relevan berdasarkan jenis pertanyaan.
2. Untuk setiap penugasan sub-agen, buat 2-4 query pencarian per agen per pertanyaan.
3. Aturan crafting query: gunakan kata kunci dari RQ, sertakan sinonim, gunakan terminologi formal untuk akademik, istilah colloquial untuk sosial, nama kompetitor untuk market.

**Cek Gate 1:** Setiap RQ memiliki setidaknya satu penugasan sub-agen dengan query.

#### Fase 3.5: Pemeriksaan Cakupan Advisor (ANTITESIS)

**Tujuan:** Menantang dekomposisi tugas dengan advisor System Architect + Ops Reviewer sebelum membangun rencana final.

Ini adalah langkah TESIS → ANTITESIS. Dekomposisi tugas adalah tesis. Sekarang advisor independen harus menantang struktur dan paralelismenya.

1. **Kirim advisor System Architect + Ops Reviewer** (via `cariak-advising`):
   - Advisor adalah **model/persona BERBEDA**, bukan kritik-diri.
   - Tugas advisor: temukan dependensi tersembunyi, tugas terlalu besar, cakupan yang hilang.
   - Advisor HARUS menyitir sumber atau menyatakan opini secara eksplisit.
2. **Pertanyaan challenge advisor:**
   - "Apakah tugas benar-benar independen? Bisakah berjalan paralel tanpa race condition?"
   - "Apakah ada tugas yang terlalu besar? Apakah granularitas benar — setiap tugas harus satu pertanyaan riset, bukan area topik?"
   - "Dependensi tersembunyi apa yang ada antara query sub-agen yang akan memblokir eksekusi paralel?"
   - "Apakah ada pertanyaan riset yang kurang ditugaskan (terlalu sedikit sub-agen) atau terlalu banyak ditugaskan (tumpang tindih boros)?"
   - "Bisakah setiap tugas selesai secara wajar dalam <10 menit waktu agen?"
3. **Advisor mengembalikan:**
   - Tugas yang harus dipecah (terlalu besar).
   - Dependensi tersembunyi yang perlu diurutkan.
   - Pertanyaan riset yang kurang atau terlalu banyak dicakup.
   - Rekomendasi granularitas.

**Cek Gate 1.5:** Advisor coverage challenge dieksekusi SEBELUM membangun rencana riset final? Jika tidak → berhenti dan jalankan challenge. Output advisor menjadi input ke Fase 4 (Bangun Rencana Riset).

**Output:** Laporan cakupan advisor — rekomendasi pemecahan, peringatan dependensi, celah cakupan.

#### Fase 4: Bangun Rencana Riset

**Aksi:**
1. Tulis `research-plan.md` ke direktori spec.
2. Simpan path rencana di Memory MCP sebagai ResearchArtifact.

#### Fase 5: Handoff

Sajikan menu 3 opsi ke pengguna:
1. Eksekusi riset → invoke `cariak-researching`
2. Modifikasi rencana → sesuaikan penugasan sub-agen atau query
3. Simpan dan berhenti → rencana disimpan, tanpa eksekusi

**Cek Gate 2:** Tunggu konfirmasi pengguna sebelum melanjutkan.

### Reference Triggers

| Trigger | File | Fase |
|---|---|---|
| Pemetaan jenis sumber | `references/source-taxonomy.csv` | Fase 3 |
| Format sitasi per sumber | `references/citation-standards.csv` | Fase 4 |
| Definisi sub-agen | `subagents/*.md` | Fase 3 |
| File spec | `docs/cariak/spec/YYYY-MM-DD-slug/research-spec.md` | Fase 1 |

### Handoff Artifact

- **Output utama:** `docs/cariak/spec/YYYY-MM-DD-slug/research-plan.md`
- **Memory MCP:** Entitas ResearchArtifact dibuat dengan path dan tipe.
- **Target handoff:** `cariak-researching` (saat konfirmasi pengguna).
