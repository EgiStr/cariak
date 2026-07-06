---
name: cariak-grinding
description: Refine a pitch into a precise research specification. Use AFTER cariak-pitching (or when a pitch-exploration.md exists) to convert divergent directions into sharp, testable research questions. Produces a research-spec.md with BDD-style Given/When/Then research questions, scope boundaries, and success metrics. Trigger on "refine research", "grind research", "research spec", "giling riset", "spec riset", or when cariak-pitching hands off.
---

# cariak-grinding / Penggilingan Riset

<!-- CARIAK SKILL: cariak-grinding - v1.1 -->

## English

### Core Principle

> Specify the research questions. Vague problems produce vague research.

### When to Use

- A pitch-exploration.md exists and the user wants to refine it into research questions.
- cariak-pitching has handed off with a confirmed pitch brief.
- The user says "refine", "grind", "make a spec", "sharpen the questions".
- Research directions exist but lack testable specificity.

### Do NOT Use

- If no pitch-exploration.md exists → invoke cariak-pitching first.
- If the user wants to explore broadly, not narrow down → use cariak-pitching.
- If a research-spec.md already exists and only needs execution → use cariak-planning.

### Boundary Table

| Adjacent Skill | Relationship |
|---|---|
| cariak-pitching | **Predecessor.** Provides pitch-exploration.md as input. |
| cariak-advising | **Parallel.** Can be called to stress-test research questions. |
| cariak-planning | **Successor.** Consumes research-spec.md to decompose into sub-agent tasks. |
| cariak-remembering | **Throughout.** Stores decisions and session state. |

### Hard Gates

**GATE 0: PREFLIGHT MUST COMPLETE BEFORE PARSING PITCH**
Before doing any refinement, scan the project context: check for `docs/cariak/spec/` directories, query memory MCP for existing sessions, and verify the pitch-exploration.md file exists.

**GATE 1: PITCH MUST EXIST**
A pitch-exploration.md with at least one confirmed research direction MUST exist. If it does not, STOP and invoke cariak-pitching. Do not fabricate a pitch.

**GATE 2: GWT MUST BE DERIVED FROM PITCH**
Every Given/When/Then research question must trace back to a research direction in the pitch. No orphan questions. If a question cannot be traced, it is out of scope.

**GATE 3: USER MUST APPROVE SPEC**
Before handing off to planning, present the research-spec.md to the user for approval. The user must confirm the questions, scope, and success metrics are correct.

### Phases

#### Phase 0: Preflight
1. Check memory MCP for existing project sessions: `memory_search_nodes(query: "research project")`.
2. Scan `docs/cariak/spec/` for existing pitch-exploration.md files.
3. If pitch exists, load it and extract:
   - Problem statement
   - Research directions (2-3)
   - Advisor counsel notes
   - User's confirmed direction
4. If no pitch exists, invoke cariak-pitching.

#### Phase 1: Parse Pitch
1. Read pitch-exploration.md.
2. Extract the confirmed research direction(s).
3. Identify implicit assumptions and unknowns in the pitch.
4. List knowledge gaps that the research must address.

#### Phase 2: Refine Research Questions (BDD GWT)
Transform each research direction into BDD-style research questions using the format:

```
GIVEN [context — what is known or assumed]
WHEN [research action — what we investigate]
THEN [expected finding — what a successful answer looks like]
```

For each research direction, produce 3-5 GWT questions. Example:

```
GIVEN the user's assumption that TypeScript reduces runtime errors by 30%
WHEN we compare error rates in TypeScript vs JavaScript projects of similar size
THEN we can confirm, refute, or qualify the 30% claim with cited evidence
```

Use question-frameworks.csv to select appropriate frameworks:
- 5W1H (Who, What, Where, When, Why, How)
- PESTLE (Political, Economic, Social, Technological, Legal, Environmental)
- First Principles
- MECE (Mutually Exclusive, Collectively Exhaustive)
- Hypothesis-Driven

#### Phase 3: Define Scope & Success Metrics
For each research question, define:
- **In-scope**: What sources, timeframes, and domains are included.
- **Out-of-scope**: What is explicitly excluded.
- **Success metric**: What constitutes a sufficient answer (e.g., "≥5 independent sources", "confidence ≥ 0.7").
- **Failure condition**: What would make the question unanswerable.

#### Phase 4: Write Spec
Write `docs/cariak/spec/YYYY-MM-DD-slug/research-spec.md` with sections:
1. **Problem Statement** (carried from pitch)
2. **Research Questions** (GWT format)
3. **Scope & Boundaries**
4. **Success Metrics**
5. **Risk Register** (what could go wrong)
6. **Output Document Plan** (which on-demand docs the user wants)

#### Phase 5: Handoff
Present the spec to the user. Offer 3 options:
1. **Invoke cariak-planning** → decompose into sub-agent tasks.
2. **Iterate** → refine questions further (loop back to Phase 2).
3. **Save and stop** → write spec and end session.

### Output Format

File: `docs/cariak/spec/YYYY-MM-DD-slug/research-spec.md`

```markdown
# Research Specification: [Title]
**Date:** YYYY-MM-DD
**Project:** [slug]
**Status:** Draft / Approved

## Problem Statement
[From pitch-exploration.md]

## Research Questions

### RQ1: [Question title]
**GIVEN** [context]
**WHEN** [research action]
**THEN** [expected finding]

**In-scope:** ...
**Out-of-scope:** ...
**Success metric:** ...
**Failure condition:** ...

### RQ2: ...

## Scope & Boundaries
[Overall scope]

## Success Metrics
[Aggregate success criteria]

## Risk Register
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|

## Output Document Plan
- [ ] research-report.md
- [ ] validation-report.md
- [ ] [custom docs from Clarify Gate]

## Advisor Counsel
[If cariak-advising was called during grinding]
```

### Reference Triggers

| Trigger File | Phase Used | Purpose |
|---|---|---|
| `references/question-frameworks.csv` | Phase 2 | Select frameworks for structuring research questions |
| brief-template.md | Phase 4 | Template for research-spec.md structure |
| advisor-personas.csv | Phase 2 (optional) | If advising is called to stress-test questions |

---

## Bahasa Indonesia

### Prinsip Inti

> Tentukan pertanyaan risetnya. Masalah yang kabur menghasilkan riset yang kabur.

### Kapan Digunakan

- Sebuah pitch-exploration.md ada dan pengguna ingin mengubahnya menjadi pertanyaan riset.
- cariak-pitching telah menyerahkan dengan pitch brief yang dikonfirmasi.
- Pengguna mengatakan "refine", "grind", "buat spec", "pertajam pertanyaan".
- Arah riset ada tetapi kurang spesifik untuk diuji.

### JANGAN Digunakan

- Jika tidak ada pitch-exploration.md → jalankan cariak-pitching terlebih dahulu.
- Jika pengguna ingin eksplorasi luas, bukan penyempitan → gunakan cariak-pitching.
- Jika research-spec.md sudah ada dan hanya perlu dieksekusi → gunakan cariak-planning.

### Tabel Batasan

| Skill Terkait | Hubungan |
|---|---|
| cariak-pitching | **Pendahulu.** Menyediakan pitch-exploration.md sebagai input. |
| cariak-advising | **Paralel.** Dapat dipanggil untuk menguji pertanyaan riset. |
| cariak-planning | **Penerus.** Mengonsumsi research-spec.md untuk decompose menjadi tugas sub-agent. |
| cariak-remembering | **Sepanjang proses.** Menyimpan keputusan dan state sesi. |

### Hard Gates

**GATE 0: PREFLIGHT HARUS SELESAI SEBELUM PARSING PITCH**
Sebelum melakukan refinement, scan konteks proyek: periksa direktori `docs/cariak/spec/`, query memory MCP untuk sesi yang ada, dan verifikasi file pitch-exploration.md ada.

**GATE 1: PITCH HARUS ADA**
Sebuah pitch-exploration.md dengan minimal satu arah riset yang dikonfirmasi HARUS ada. Jika tidak, BERHENTI dan jalankan cariak-pitching. Jangan membuat pitch fiktif.

**GATE 2: GWT HARUS DITURUNKAN DARI PITCH**
Setiap pertanyaan riset Given/When/Then harus dapat ditelusuri kembali ke arah riset di pitch. Tidak ada pertanyaan yatim. Jika pertanyaan tidak dapat ditelusuri, itu di luar lingkup.

**GATE 3: PENGGUNA HARUS MENYETUJUI SPEC**
Sebelum menyerahkan ke planning, presentasikan research-spec.md kepada pengguna untuk persetujuan. Pengguna harus mengkonfirmasi pertanyaan, lingkup, dan metrik keberhasilan sudah benar.

### Fase

#### Fase 0: Preflight
1. Periksa memory MCP untuk sesi proyek yang ada: `memory_search_nodes(query: "research project")`.
2. Scan `docs/cariak/spec/` untuk file pitch-exploration.md yang ada.
3. Jika pitch ada, muat dan ekstrak:
   - Pernyataan masalah
   - Arah riset (2-3)
   - Catatan advisor counsel
   - Arah yang dikonfirmasi pengguna
4. Jika tidak ada pitch, jalankan cariak-pitching.

#### Fase 1: Parsing Pitch
1. Baca pitch-exploration.md.
2. Ekstrak arah riset yang dikonfirmasi.
3. Identifikasi asumsi implisit dan yang tidak diketahui dalam pitch.
4. Daftar kesenjangan pengetahuan yang harus diatasi oleh riset.

#### Fase 2: Refine Pertanyaan Riset (BDD GWT)
Ubah setiap arah riset menjadi pertanyaan riset gaya BDD menggunakan format:

```
GIVEN [konteks — apa yang diketahui atau diasumsikan]
WHEN [aksi riset — apa yang kita selidiki]
THEN [temuan yang diharapkan — seperti apa jawaban yang berhasil]
```

Untuk setiap arah riset, hasilkan 3-5 pertanyaan GWT. Contoh:

```
GIVEN asumsi pengguna bahwa TypeScript mengurangi runtime error sebesar 30%
WHEN kita membandingkan tingkat error di proyek TypeScript vs JavaScript dengan ukuran serupa
THEN kita dapat mengkonfirmasi, menolak, atau memenuhi klaim 30% dengan bukti yang dikutip
```

Gunakan question-frameworks.csv untuk memilih framework yang tepat:
- 5W1H (Siapa, Apa, Di mana, Kapan, Mengapa, Bagaimana)
- PESTLE (Politik, Ekonomi, Sosial, Teknologi, Hukum, Lingkungan)
- First Principles
- MECE (Mutually Exclusive, Collectively Exhaustive)
- Hypothesis-Driven

#### Fase 3: Tentukan Lingkup & Metrik Keberhasilan
Untuk setiap pertanyaan riset, tentukan:
- **In-scope**: Sumber, jangka waktu, dan domain apa yang dimasukkan.
- **Out-of-scope**: Apa yang secara eksplisit dikecualikan.
- **Metrik keberhasilan**: Apa yang menjadi jawaban yang memadai (misalnya, "≥5 sumber independen", "confidence ≥ 0.7").
- **Kondisi kegagalan**: Apa yang membuat pertanyaan tidak dapat dijawab.

#### Fase 4: Tulis Spec
Tulis `docs/cariak/spec/YYYY-MM-DD-slug/research-spec.md` dengan bagian:
1. **Pernyataan Masalah** (dibawa dari pitch)
2. **Pertanyaan Riset** (format GWT)
3. **Lingkup & Batasan**
4. **Metrik Keberhasilan**
5. **Risk Register** (apa yang bisa salah)
6. **Rencana Dokumen Output** (dokumen on-demand apa yang diinginkan pengguna)

#### Fase 5: Handoff
Presentasikan spec kepada pengguna. Tawarkan 3 opsi:
1. **Jalankan cariak-planning** → decompose menjadi tugas sub-agent.
2. **Iterasi** → refine pertanyaan lebih lanjut (kembali ke Fase 2).
3. **Simpan dan berhenti** → tulis spec dan akhiri sesi.

### Format Output

File: `docs/cariak/spec/YYYY-MM-DD-slug/research-spec.md`

```markdown
# Spesifikasi Riset: [Judul]
**Tanggal:** YYYY-MM-DD
**Proyek:** [slug]
**Status:** Draft / Approved

## Pernyataan Masalah
[Dari pitch-exploration.md]

## Pertanyaan Riset

### RQ1: [Judul pertanyaan]
**GIVEN** [konteks]
**WHEN** [aksi riset]
**THEN** [temuan yang diharapkan]

**In-scope:** ...
**Out-of-scope:** ...
**Metrik keberhasilan:** ...
**Kondisi kegagalan:** ...

### RQ2: ...

## Lingkup & Batasan
[Lingkup keseluruhan]

## Metrik Keberhasilan
[Kriteria keberhasilan agregat]

## Risk Register
| Risiko | Kemungkinan | Dampak | Mitigasi |
|---|---|---|---|

## Rencana Dokumen Output
- [ ] research-report.md
- [ ] validation-report.md
- [ ] [dokumen kustom dari Clarify Gate]

## Advisor Counsel
[Jika cariak-advising dipanggil selama grinding]
```

### Reference Triggers

| File Trigger | Fase Digunakan | Tujuan |
|---|---|---|
| `references/question-frameworks.csv` | Fase 2 | Pilih framework untuk menyusun pertanyaan riset |
| brief-template.md | Fase 4 | Template untuk struktur research-spec.md |
| advisor-personas.csv | Fase 2 (opsional) | Jika advising dipanggil untuk menguji pertanyaan |
