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
```

### Phase 0: Preflight

**Objective:** Verify all prerequisites before dispatching sub-agents.

1. Check Memory MCP (`memory_search_nodes`) for the current project context
2. Verify `docs/cariak/spec/YYYY-MM-DD-slug/research-plan.md` exists
3. Parse the plan to extract:
   - Research questions
   - Assigned sub-agents per question
   - Query templates
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

This is a QUICK audit, not a deep review. The deep review happens in `cariak-synthesizing` and `cariak-validating`.

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

---

## Bahasa Indonesia

```yaml
---
name: cariak-researching
description: Eksekusi riset dengan menjalankan 5 sub-agen paralel lintas domain internet, sosial, akademik, berita, dan pasar. Gunakan SETELAH cariak-planning menghasilkan research-plan.md. Setiap sub-agen mencari di domainnya, mengutip setiap sumber, dan menghasilkan file findings.md. Trigger pada "eksekusi riset", "jalankan riset", "mulai cari", atau saat cariak-plinding menyerah dengan rencana yang disetujui.
---
```

### Prinsip Inti

**Lensa paralel, sintesis konvergen. Setiap sumber dikutip, setiap klaim ditelusuri.**

Riset bukan pencarian Google satu jalur. Ini adalah penyebaran simultan多条 lensa khusus—masing-masing dengan taksonomi sumber, standar kutipan, dan profil bias sendiri—yang temukannya kemudian direkonsiliasi menjadi satu laporan koheren. Tidak ada temuan masuk sintesis tanpa sumber. Tidak ada sumber masuk tanpa kutipan.

### Kapan Digunakan

- `cariak-planning` telah menghasilkan `research-plan.md` yang disetujui
- Pengguna secara eksplisit mengatakan "eksekusi riset", "jalankan rencana", "mulai cari"
- Putaran riset sebelumnya gagal quality gate dan `cariak-reflecting` memicu loop re-research
- Pengguna ingin menjalankan ulang sub-agen tertentu dengan kueri yang disesuaikan

### JANGAN Digunakan

- Tidak ada `research-plan.md` (gunakan `cariak-planning` dulu)
- Pertanyaan riset masih kabur (gunakan `cariak-pitching` → `cariak-grinding`)
- Pengguna hanya ingin jawaban cepat, bukan siklus riset mendalam
- Hanya satu domain sumber yang relevan (panggil sub-agen secara langsung)

### Tabel Batas

| Skill Bertetangga | Hubungan | Aturan Batas |
|---|---|---|
| `cariak-planning` | **Hulu** — menyediakan rencana | Tidak bisa mulai tanpa `research-plan.md` yang disetujui |
| `cariak-synthesizing` | **Hilir** — mengonsumsi temuan | Menyerahkan semua 5 file temuan |
| `cariak-reflecting` | **Target loop** — bisa mengirim kembali | Loop re-research kembali ke sini, maks 2 iterasi |
| `cariak-advising` | **Ortogonal** — dapat dipanggil mid-riset | Hanya jika temuan sub-agen mengunggap celah perspektif kritis |
| Sub-agen | **Anak** — dijalankan oleh skill ini | Skill ini mengorkestrasi; sub-agen mengeksekusi |

### Hard Gates

```
GATE 0: VERIFIKASI RENCANA
  research-plan.md HARUS ada dan HARUS berisi:
    - Minimal satu pertanyaan riset dengan sub-agen yang ditugaskan
    - Referensi taksonomi sumber
    - Path output didefinisikan
  Jika TIDAK ADA → berhenti dan jalankan cariak-planning

GATE 1: SEMUA SUB-AGEN DIJALANKAN DALAM SATU PANGGILAN PARALEL
  Semua 5 sub-agen (internet, sosial, akademik, berita, pasar) HARUS
  dijalankan dalam SATU pesan dengan panggilan tool paralel.
  Jika dijalankan sekuensial → ABORT dan jalankan ulang secara paralel.
  Alasan: paralelisme adalah intinya. Eksekusi sekuensial
  mengalahkan desain multi-lensa dan membuang waktu.

GATE 2: TIDAK ADA SILENT BLOCK
  Jika sub-agen tidak menemukan hasil, ia HARUS mengembalikan findings.md
  yang menyatakan "No results found" dengan kueri yang dicoba.
  TIDAK BOLEH diam-diam mengembalikan kosong atau melewati file output.
  File temuan yang hilang akan memblokir cariak-synthesizing GATE 0.

GATE 3: SETIAP TEMUAN HARUS MENGUTIP SUMBER
  Setiap klaim dalam setiap findings.md HARUS memiliki kutipan inline
  yang menunjuk ke sumber di bibliografi.
  Klaim tanpa kutipan → temuan ditolak, sub-agen dijalankan ulang.
```

### Fase 0: Preflight

**Tujuan:** Verifikasi semua prasyarat sebelum menjalankan sub-agen.

1. Cek Memory MCP (`memory_search_nodes`) untuk konteks proyek saat ini
2. Verifikasi `docs/cariak/spec/YYYY-MM-DD-slug/research-plan.md` ada
3. Parsing rencana untuk mengekstrak:
   - Pertanyaan riset
   - Sub-agen yang ditugaskan per pertanyaan
   - Template kueri
   - Path direktori output
4. Buat direktori output: `docs/cariak/research/YYYY-MM-DD-slug/`
5. Cek flag re-research dari `cariak-reflecting` (jika re-research, muat laporan refleksi untuk kueri yang disesuaikan)
6. Catat awal sesi ke Memory MCP

**Daftar preflight:**
- [ ] `research-plan.md` ada dan disetujui
- [ ] Direktori output dibuat
- [ ] Semua 5 template kueri sub-agen disiapkan
- [ ] Jumlah iterasi re-research dicek (maks 2)

### Fase 1: Muat Rencana

**Tujuan:** Parsing rencana riset menjadi payload dispatch sub-agen.

Ekstrak dari `research-plan.md`:

| Field | Tujuan |
|---|---|
| Pertanyaan riset | Kueri inti yang harus dijawab setiap sub-agen |
| Penugasan sub-agen | Sub-agen mana mencakup pertanyaan mana |
| Template kueri | String pencarian yang sudah diformat per sub-agen |
| Taksonomi sumber | Sumber yang diizinkan/dilarang per domain |
| Standar kutipan | APA, IEEE, atau bernomor-inline |
| Pengaturan kedalaman | Jumlah hasil per sumber (dari Clarify Gate) |

Untuk setiap sub-agen, buat payload dispatch:

```
sub-agent: internet-researcher
questions: [Q1, Q2, Q3]
queries: ["query string 1", "query string 2", ...]
source_taxonomy: [sumber yang diizinkan]
citation_standard: bernomor-inline
output_path: docs/cariak/research/YYYY-MM-DD-slug/internet-findings.md
depth: 10
```

Ulangi untuk semua 5 sub-agen.

### Fase 2: Jalankan 5 Sub-Agen SECARA PARALEL

**Tujuan:** Luncurkan semua 5 sub-agen riset secara simultan.

**INI ADALAH FASE KRITIS.** Semua 5 sub-agen HARUS dijalankan dalam satu pesan dengan panggilan tool paralel.

| Sub-Agen | Domain | Tool Utama |
|---|---|---|
| `internet-researcher` | Blog, Medium, engineering blog, artikel | `search_web`, `search_exa`, `fetch_web_page`, `tavily_search`, `tavily_extract` |
| `social-researcher` | X/Twitter, Reddit, GitHub, HN, Stack Overflow | `search_reddit`, `search_hackernews`, `search_github`, `search_x` |
| `academic-researcher` | arXiv, PubMed, Semantic Scholar, CrossRef, OpenAlex, DOAJ | `search_arxiv`, `search_pubmed`, `search_semantic`, `search_crossref`, `search_openalex`, `search_doaj` |
| `news-researcher` | Artikel berita, laporan industri, siaran pers | `search_web` (tipe news), `tavily_search` |
| `market-researcher` | Data pasar, info kompetitor, harga, analisis industri | `search_web`, `search_exa`, `tavily_search`, `tavily_extract` |

**Protokol dispatch:**

```
[SATU PESAN - PANGGILAN PARALEL]

→ internet-researcher.md    (dengan payload dispatch)
→ social-researcher.md      (dengan payload dispatch)
→ academic-researcher.md    (dengan payload dispatch)
→ news-researcher.md        (dengan payload dispatch)
→ market-researcher.md      (dengan payload dispatch)
```

Setiap sub-agen:
1. Mengeksekusi pencarian di berbagai sumber
2. Mendeduplikasi hasil
3. Mengekstrak temuan kunci dengan kutipan inline
4. Menulis `findings.md` ke path output
5. Mengembalikan ringkasan + path file

**Penegakan GATE 1:** Jika ada sub-agen yang dijalankan dalam pesan terpisah, ABORT dan jalankan ulang semua 5 secara paralel.

### Fase 3: Kumpulkan Hasil

**Tujuan:** Mengumpulkan semua 5 file temuan dan memverifikasi kelengkapan.

Setelah semua sub-agen kembali:

1. Verifikasi semua 5 file ada:
   - `docs/cariak/research/YYYY-MM-DD-slug/internet-findings.md`
   - `docs/cariak/research/YYYY-MM-DD-slug/social-findings.md`
   - `docs/cariak/research/YYYY-MM-DD-slug/academic-findings.md`
   - `docs/cariak/research/YYYY-MM-DD-slug/news-findings.md`
   - `docs/cariak/research/YYYY-MM-DD-slug/market-findings.md`

2. Cek setiap file untuk:
   - Konten tidak kosong (GATE 2: tidak ada silent block)
   - Minimal satu sumber dikutip (GATE 3: setiap temuan mengutip sumber)
   - Bagian bibliografi ada

3. Jika ada file hilang atau kosong:
   - Jalankan ulang sub-agen yang gagal
   - Catat kegagalan di Memory MCP
   - Jika jalankan ulang juga gagal, tandai domain itu sebagai "NO RESULTS" dan lanjutkan

### Fase 4: Audit Cepat per Sub-Agen

**Tujuan:** Cek kualitas cepat sebelum handoff ke synthesizing.

Untuk setiap file temuan, cek:

| Cek | Kriteria Lulus | Tindakan Gagal |
|---|---|---|
| Cakupan kutipan | Setiap klaim memiliki kutipan [N] | Tandai untuk jalankan ulang |
| Keberagaman sumber | ≥3 sumber unik dikutip | Catat di handoff |
| Cakupan kueri | Semua pertanyaan yang ditugaskan dijawab | Tandai untuk jalankan ulang |
| Flag kontradiksi | Kontradiksi internal dicatat | Teruskan ke synthesizing |
| Flag bias | Bias sumber dicatat | Teruskan ke synthesizing |

Ini adalah audit CEPAT, bukan tinjauan mendalam. Tinjauan mendalam terjadi di `cariak-synthesizing` dan `cariak-validating`.

### Fase 5: Handoff ke Synthesizing

**Tujuan:** Transfer semua temuan ke `cariak-synthesizing`.

**Artifact handoff:** Semua 5 file temuan + ringkasan audit.

Sajikan menu handoff kepada pengguna:

```
┌─────────────────────────────────────────────────────────┐
│  RISET SELESAI — 5 file temuan dihasilkan               │
│  Output: docs/cariak/research/YYYY-MM-DD-slug/          │
├─────────────────────────────────────────────────────────┤
│  Sub-agen        │ Sumber │ Temuan │ Status             │
│  internet        │    12   │    8   │ ✓ Lengkap          │
│  sosial          │    15   │    6   │ ✓ Lengkap          │
│  akademik        │     8   │    5   │ ✓ Lengkap          │
│  berita          │     7   │    4   │ ✓ Lengkap          │
│  pasar           │     5   │    3   │ ⚠ Cakupan rendah   │
├─────────────────────────────────────────────────────────┤
│  LANGKAH BERIKUTNYA:                                    │
│  [1] Sintesis temuan → research-report.md               │
│  [2] Jalankan ulang sub-agen tertentu dengan kueri baru │
│  [3] Simpan dan berhenti                                │
└─────────────────────────────────────────────────────────┘
```

**Aksi default:** Jika pengguna memilih [1], jalankan `cariak-synthesizing`.

**Kondisi auto-invoke:** Jika semua 5 sub-agen mengembalikan hasil lengkap tanpa flag, auto-invoke `cariak-synthesizing` di balik prompt konfirmasi.

### Reference Triggers

| Trigger | Lokasi | Tujuan |
|---|---|---|
| `references/source-taxonomy.csv` | Fase 1 | Menentukan sumber yang diizinkan per sub-agen |
| Definisi sub-agen (`subagents/*.md`) | Fase 2 | Menyediakan daftar tool dan format output |
| `research-plan.md` | Fase 0, 1 | Sumber kueri dan penugasan |
| Memory MCP | Fase 0 | Konteks proyek dan flag re-research |

### Detail Dispatch Sub-Agen

Setiap sub-agen didefinisikan di `D:\programming\automation\cariak\subagents\`:

| File Sub-Agen | Domain | File Output |
|---|---|---|
| `internet-researcher.md` | Web umum | `internet-findings.md` |
| `social-researcher.md` | Platform sosial | `social-findings.md` |
| `academic-researcher.md` | Paper akademik | `academic-findings.md` |
| `news-researcher.md` | Berita & media | `news-findings.md` |
| `market-researcher.md` | Pasar & kompetitor | `market-findings.md` |
