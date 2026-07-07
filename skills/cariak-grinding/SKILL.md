---
name: cariak-grinding
description: Refine a pitch into a precise research specification. Use AFTER cariak-pitching (or when a pitch-exploration.md exists) to convert divergent directions into sharp, testable research questions. Produces a research-spec.md with BDD-style Given/When/Then research questions, scope boundaries, and success metrics. Trigger on "refine research", "grind research", "research spec", "giling riset", "spec riset", or when cariak-pitching hands off.
---

# cariak-grinding / Penggilingan Riset

<!-- CARIAK SKILL: cariak-grinding - v1.1 -->

## English

### Core Principle

> Specify the research questions. Vague problems produce vague research.

### Structural Method

This phase uses:
- **M02 — BDD Research Specification**: turn research directions into testable Given/When/Then questions.
- **M03 — Engineering Lens Canvas**: for technical topics, force first principles, field practice, implementation architecture, data, metrics, failure modes, tradeoffs, alternatives, and unknowns.

Load `references/structural-research-methods.csv` and `references/structural-research-methods.md` during preflight. If the topic is technical, scientific, ML, data, hardware, infrastructure, or product implementation, M03 is mandatory.

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

**GATE 2.5: ADVISOR GRANULARITY CHALLENGE MANDATORY — ANTITHESIS BEFORE SCOPE**
The Methodologist + Skeptic advisor challenge (Phase 2.5) is not optional. Before defining scope and success metrics:
1. The drafted GWT research questions (thesis) must be challenged by an independent advisor (antithesis).
2. The advisor must check granularity, testability, edge cases, and implicit assumptions.
3. The advisor output must be incorporated into scope definitions in Phase 3.
4. Do not skip the antithesis step. Proceeding from thesis (draft questions) directly to scope without the advisor challenge produces untestable specs.

**GATE 3: USER MUST APPROVE SPEC**
Before handing off to planning, present the research-spec.md to the user for approval. The user must confirm the questions, scope, and success metrics are correct.

### Phases

#### Phase 0: Preflight
1. Check memory MCP for existing project sessions: `memory_search_nodes(query: "research project")`.
2. Scan `docs/cariak/spec/` for existing pitch-exploration.md files.
3. Load `references/structural-research-methods.csv` and `references/structural-research-methods.md`.
4. If pitch exists, load it and extract:
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

#### Phase 2.1: Engineering Lens Canvas (Technical Topics Only)

If the topic is technical, scientific, ML, data, hardware, infrastructure, product, or implementation-heavy, add the Engineering Lens Canvas to the spec. This is mandatory for questions like computer vision, weight estimation, edge inference, sensors, production ML, data pipelines, APIs, databases, security, or DevOps.

For each technical research direction, define:

| Lens | Required answer |
|---|---|
| First principles | What mechanism makes the solution possible? |
| State of the art | What methods appear in papers, products, and mature engineering practice? |
| Field practice | What is actually done in industry or operations? |
| Implementation architecture | What components, data flow, interfaces, and deployment targets are implied? |
| Data strategy | What data, labels, calibration, and sampling are required? |
| Evaluation protocol | What metrics, baselines, and acceptance thresholds prove success? |
| Failure modes | What breaks in production: environment, sensors, users, distribution shift, cost? |
| Tradeoffs | Accuracy vs cost vs latency vs complexity vs maintainability. |
| Alternatives | Simpler, non-AI, commercial, hybrid, or fallback approaches. |
| Unknowns | What must be prototyped or measured before commitment? |

**Gate:** If the final report would not let an engineer plan implementation, the spec is incomplete. Add missing Engineering Lens questions before Phase 2.5.

#### Phase 2.5: Advisor Granularity Check (ANTITHESIS)

**Goal:** Challenge the research questions and GWT scenarios with a Methodologist + Skeptic advisor before committing to scope and format.

This is the THESIS → ANTITHESIS step. The drafted research questions are the thesis. Now an independent advisor must challenge their granularity and testability.

1. **Dispatch a Methodologist + Skeptic advisor sub-agent** (via `cariak-advising`):
   - The advisor is a **different model/persona**, not self-critique.
   - The advisor's job: find over-broad questions, untestable scenarios, edge case gaps.
   - The advisor MUST cite sources for their challenges (Iron Law: no claim without source).
2. **Advisor challenge questions:**
   - "Are these research questions granular enough? Can each be answered in <10 min of research?"
   - "Are these GWT scenarios actually testable? What edge cases are missing?"
   - "What implicit assumptions in the GWT framing would break the question?"
   - "Are any questions actually multiple questions in disguise that need splitting?"
3. **Advisor returns:**
   - List of questions that are too broad (need splitting).
   - GWT scenarios missing edge cases or failure conditions.
   - Untestable assumptions baked into the GWT framing.
   - Specific rewrite recommendations.

**Gate N check:** Advisor granularity challenge executed BEFORE proceeding to scope definition and BDD formulation? If no → halt and run the challenge. The advisor output feeds into Phase 3 (Scope & Success Metrics).

**Output:** Advisor granularity report — questions to split, edge cases to add, assumptions to test.

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
3. **Engineering Lens** (mandatory for technical topics)
4. **Scope & Boundaries**
5. **Success Metrics**
6. **Risk Register** (what could go wrong)
7. **Output Document Plan** (which on-demand docs the user wants)

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

## Engineering Lens
| Lens | Research need | Source targets | Success evidence |
|---|---|---|---|
| First principles | ... | ... | ... |
| State of the art | ... | ... | ... |
| Field practice | ... | ... | ... |
| Implementation architecture | ... | ... | ... |
| Data strategy | ... | ... | ... |
| Evaluation protocol | ... | ... | ... |
| Failure modes | ... | ... | ... |
| Tradeoffs | ... | ... | ... |
| Alternatives | ... | ... | ... |
| Unknowns | ... | ... | ... |

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
| `references/structural-research-methods.csv` | Phase 0, 2.1 | Method registry for BDD spec and Engineering Lens Canvas |
| `references/structural-research-methods.md` | Phase 0, 2.1 | Engineering Lens details and technical-report quality bar |
| `references/question-frameworks.csv` | Phase 2 | Select frameworks for structuring research questions |
| `references/research-spec-template.md` | Phase 4 | Template for research-spec.md structure |
| `references/advisor-personas.csv` | Phase 2 (optional) | If advising is called to stress-test questions |

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

**GATE 2.5: ADVISOR GRANULARITY CHALLENGE WAJIB — ANTITESIS SEBELUM SCOPE**
Challenge advisor Methodologist + Skeptic (Fase 2.5) tidak opsional. Sebelum mendefinisikan scope dan metrik keberhasilan:
1. Pertanyaan riset GWT yang dirancang (tesis) harus ditantang oleh advisor independen (antitesis).
2. Advisor harus memeriksa granularitas, testabilitas, edge case, dan asumsi implisit.
3. Output advisor harus diintegrasikan ke dalam definisi scope di Fase 3.
4. Jangan lewati langkah antitesis. Melanjutkan dari tesis (draft pertanyaan) langsung ke scope tanpa advisor challenge menghasilkan spec yang tidak dapat diuji.

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

#### Fase 2.5: Pemeriksaan Granularitas Advisor (ANTITESIS)

**Tujuan:** Menantang pertanyaan riset dan skenario GWT dengan advisor Methodologist + Skeptic sebelum komitmen ke scope dan format.

Ini adalah langkah TESIS → ANTITESIS. Pertanyaan riset yang dirancang adalah tesis. Sekarang advisor independen harus menantang granularitas dan testabilitasnya.

1. **Kirim advisor Methodologist + Skeptic** (via `cariak-advising`):
   - Advisor adalah **model/persona BERBEDA**, bukan kritik-diri.
   - Tugas advisor: temukan pertanyaan terlalu luas, skenario tidak teruji, celah edge case.
   - Advisor HARUS menyitir sumber untuk tantangan mereka.
2. **Pertanyaan challenge advisor:**
   - "Apakah pertanyaan riset ini cukup granular? Bisakah masing-masing dijawab dalam <10 menit riset?"
   - "Apakah skenario GWT ini benar-benar dapat diuji? Edge case apa yang hilang?"
   - "Asumsi implisit apa dalam framing GWT yang akan merusak pertanyaan?"
   - "Apakah ada pertanyaan yang sebenarnya multiple pertanyaan tersamar yang perlu dipecah?"
3. **Advisor mengembalikan:**
   - Daftar pertanyaan yang terlalu luas (perlu dipecah).
   - Skenario GWT yang kehilangan edge case atau kondisi kegagalan.
   - Asumsi tidak teruji yang tertanam dalam framing GWT.
   - Rekomendasi penulisan ulang spesifik.

**Cek Gate N:** Advisor granularity challenge dieksekusi SEBELUM melanjutkan ke definisi scope dan formulasi BDD? Jika tidak → berhenti dan jalankan challenge. Output advisor menjadi input ke Fase 3 (Tentukan Lingkup & Metrik).

**Output:** Laporan granularitas advisor — pertanyaan untuk dipecah, edge case untuk ditambahkan, asumsi untuk diuji.

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
| `references/research-spec-template.md` | Fase 4 | Template untuk struktur research-spec.md |
| `references/advisor-personas.csv` | Fase 2 (opsional) | Jika advising dipanggil untuk menguji pertanyaan |
