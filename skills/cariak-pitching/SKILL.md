---
name: cariak-pitching
description: Pre-research problem exploration. Use BEFORE cariak-grinding when the research problem is unformed or needs exploration. Guides diverge→converge with structured brainstorming methods (from brainstorming-methods.csv) and LLM-to-LLM advisor curation (advisor tool), then produces a pitch exploration doc with problem statement and 2-3 research directions. Trigger on "cariak", "research this", "I want to explore", "deep research", "gali ini", "cariak ini", or when no clear research problem definition exists yet.
---

# Cariak Pitching / Pitching Cariak

<!-- CARIAK SKILL: cariak-pitching - v1.1 -->

## English

### Core Principle

> **"Diverge first, converge second. Never propose research directions until the problem is fully explored."**

Pitching is the entry point of the CariaK research lifecycle. It exists because most research problems arrive vague, multifaceted, or malformed. Jumping straight to a spec (cariak-grinding) without exploring the problem space produces narrow questions that miss the real opportunity. Pitching forces structured divergence — using curated brainstorming methods and multi-persona advisor counsel — before convergence into 2-3 research directions worth grinding.

### When to Use

- The problem is vague, unformed, or needs exploration before spec-writing.
- The user says "cariak", "research this", "explore this", "deep research", "gali ini", "cariak ini".
- A new research project is starting with no clear direction.
- No `pitch-exploration.md` exists yet in `docs/cariak/spec/`.

### Do NOT Use

- When the problem is already clearly defined (use `cariak-grinding`).
- When a `research-spec.md` already exists (use `cariak-grinding` or `cariak-planning`).
- For the "brainstorm" keyword alone — that triggers `cariak-grinding` (brainstorm implies refining, not exploring).
- When a pitch-exploration.md already exists and the user wants to refine it (use `cariak-grinding`).

### Boundary Table — Adjacent Skills

| Boundary | cariak-pitching | cariak-grinding |
|---|---|---|
| Purpose | Explores problem space | Specifies research questions |
| Output | Produces: 2-3 research directions | Produces: BDD GWT spec |
| Format | No GWT scenarios | Full GWT spec with acceptance criteria |
| Input | User intent + project context | pitch-exploration.md (from pitching) |

| Boundary | cariak-pitching | cariak-advising |
|---|---|---|
| Purpose | Owns the diverge→converge flow | Provides multi-persona counsel |
| Invocation | Pitching calls advising in Phase 3 | Advising returns counsel; pitching owns the converge decision |

| Boundary | cariak-pitching | cariak-validating |
|---|---|---|
| Purpose | Pre-research exploration | Post-synthesis falsification |
| Stage | Before research begins | After synthesis completes |

### Structural Method

This phase uses real academic/industry methods:
- **SCAMPER** (Eberle, 1996) — 7 creative operators for structured ideation.
- **Five Whys** (Ohno, 1988 — Toyota Production System) — root-cause problem exploration.
- **Design Thinking** (Brown, 2008, Harvard Business Review) — Empathize → Define → Ideate for wicked problems.

Load `references/research-methods.csv` during preflight.

### Hard Gates

**GATE 0: PREFLIGHT MUST COMPLETE BEFORE GREETING USER**

Before any user interaction, silently:
1. Scan the project directory for existing `docs/cariak/spec/` directories.
2. Query memory MCP for existing `ResearchProject` entities related to the topic.
3. Load `references/research-methods.csv` silently.
4. Load `references/brainstorming-methods.csv` silently.
5. Load `references/advisor-personas.csv` silently.
6. Load `references/pitch-brief-template.md` silently.

NO OUTPUT until preflight is complete. If preflight fails (files missing), note the missing files and proceed with available context. Do not block the user on missing reference files — degrade gracefully.

**GATE 1: NO DIVERGE WITHOUT PROBLEM CONFIRMATION**

Phase 1 (Clarify) ends with the user explicitly confirming the problem statement. Silence or vague approval ("sure", "I guess") is NOT confirmation. The user must restate or explicitly agree to the problem statement in their own words. If the user cannot articulate the problem, return to clarifying questions.

**GATE 2: ADVISOR CHALLENGE MANDATORY — THESIS → ANTITHESIS → SYNTHESIS**

The advisor challenge + counsel pipeline is not optional. The dialectic must run in full:
1. Phase 2 = THESIS: Output ALL brainstorming method results to the conversation.
2. Phase 2d = ANTITHESIS: Dispatch Devil's Advocate advisor to challenge the brainstorm results. Find blind spots, missing angles, untested assumptions. Advisor must cite sources.
3. Phase 3 = MULTI-PERSONA SYNTHESIS: Dispatch 3-5 advisor personas to synthesize challenge + brainstorm into counsel.
4. Do not skip any step. Even if the problem seems clear, the advisor dialectic surfaces blind spots. The antithesis step (Phase 2d) is the critical challenge — do not proceed from thesis (brainstorm) directly to synthesis (converge) without passing through antithesis.

**GATE 3: USER MUST APPROVE PITCH BRIEF**

Before invoking `cariak-grinding`, present the complete pitch-exploration.md to the user and ask: "Approve this pitch? (yes / modify / reject)". No handoff to grinding without explicit approval.

### Phase 0: Preflight

**Goal:** Silently gather context before engaging the user.

1. **Scan project context:**
   - Check `docs/cariak/spec/` for existing pitch docs.
   - If a slug exists, identify it and note prior work.
2. **Check memory MCP:**
   - `memory_search_nodes(query="{project_topic}")` for existing `ResearchProject` entities.
   - If found, load the entity graph (artifacts, insights, decisions, gaps).
3. **Load reference files silently:**
   - `references/brainstorming-methods.csv` — enumerate available methods.
   - `references/advisor-personas.csv` — enumerate available personas.
   - `references/pitch-brief-template.md` — load the pitch doc format.

**Output:** Internal context only. No user output until greeting.

**Gate 0 check:** Preflight complete? If yes → proceed to greeting.

### Phase 1: Clarify (Gate 0)

**Goal:** Understand the user's intent, scope, audience, depth, and document routing before diverging.

Ask clarifying questions ONE AT A TIME (Three Amigos pattern — one question, wait for answer, then next):

1. **Intent:** "What are you trying to understand or decide?"
2. **Scope:** "What's in scope and what's explicitly out of scope?"
3. **Audience:** "Who will read the final research output?"
4. **Depth:** "How deep should this go — overview, moderate, or exhaustive?"
5. **Doc-routing:** "What output documents do you need? (report, brief, slides, data?)"

After all answers, synthesize a **problem statement** and present it:

```
## Problem Statement (Draft)

[1-2 sentence problem statement]

In scope: ...
Out of scope: ...
Audience: ...
Depth: ...
Output docs: ...
```

**Gate 1 check:** Ask: "Does this problem statement capture your intent? Please confirm or correct." Wait for explicit confirmation. If the user says "yes" without engagement, ask: "Can you restate the problem in your own words?" to verify.

### Phase 2: Problem Diverge

**Goal:** Explore the problem space using structured brainstorming methods.

1. **Select 3-5 methods** from `brainstorming-methods.csv` based on `best_for` column matching problem type. If a selected method's `best_for` doesn't match, use its `fallback_method` instead. See `references/method-selection.md` for full selection criteria and default trio.
2. **Run each method** and output results to the conversation:

For each method:
```
### Method: [method name]
**Source:** brainstorming-methods.csv, row [N]
**Output:**
[Method-specific output — questions, angles, variables, scenarios]
```

3. **Collect all outputs** — do not filter yet. Divergence means volume.

**Output:** All method results visible in conversation. Do NOT proceed to Phase 3 until all methods are output.

### Phase 2d: Advisor Challenge (ANTITHESIS)

**Goal:** Challenge the brainstorming output with a Devil's Advocate + Domain Expert advisor persona BEFORE convergence.

This is the THESIS → ANTITHESIS step. The brainstorm results are the thesis. Now an independent advisor must challenge them.

1. **Dispatch a Devil's Advocate advisor sub-agent** (via `cariak-advising` with a single advisor persona):
   - The advisor persona is a **different model/persona**, not self-critique.
   - The advisor's job: find blind spots, missing angles, counter-evidence, bias.
   - The advisor MUST cite sources for their challenges (Iron Law: no claim without source).
2. **Advisor challenge questions:**
   - "Are we asking the right question? What assumptions are untested?"
   - "What angles of the problem were NOT explored by the brainstorming methods?"
   - "What biases are present in how the problem was framed?"
   - "What counter-perspectives are missing from the divergent output?"
3. **Advisor returns:**
   - Blind spots identified in the brainstorming output.
   - Missing angles the methods did not explore.
   - Untested assumptions in the problem framing.
   - Specific recommendations: what to revisit, what to drop.

**Gate 2 check:** Advisor challenge executed? All method results output to conversation BEFORE the challenge? If no → halt and complete the gate. The advisor challenge output is a MANDATORY input to Phase 4 (Converge).

**Output:** Advisor challenge results — blind spots, missing angles, untested assumptions.

### Phase 3: Advisor Counsel (Multi-Persona SYNTHESIS)

**Goal:** Get multi-persona perspectives on the divergent outputs + advisor challenge results before converging.

1. **Select 3-5 personas** from `advisor-personas.csv` based on the problem type:
   - Always include at least one skeptic/critical persona.
   - Always include at least one domain expert.
   - Vary the rest based on problem nature.
2. **Call `cariak-advising` skill (or `advisor()` tool)** with:
   - The problem statement (from Phase 1).
   - All brainstorming method outputs (from Phase 2).
   - The advisor challenge results (from Phase 2d).
   - The selected personas.
3. **Receive counsel** — each persona provides:
   - Blind spots identified.
   - Directions worth exploring.
   - Directions worth dropping.
   - Questions the exploration missed.

**Output:** Advisor counsel synthesized and presented.

### Phase 4: Converge (SYNTHESIS)

**Goal:** Synthesize divergent outputs + advisor challenge + advisor counsel into 2-3 research directions.

For each research direction:

```
### Direction [N]: [Direction name]

**Problem angle:** [which aspect of the problem this addresses]
**Research question (draft):** [the question this direction would grind into]
**Tradeoffs:**
- Pros: [what this direction gains]
- Cons: [what this direction sacrifices]
- Risk: [what could go wrong]
**Advisor support:** [which personas endorsed this, which pushed back]
**Source methods:** [which brainstorming methods generated this]
```

Produce exactly 2-3 directions. Not 1 (too narrow), not 5+ (too divergent).

**Output:** 2-3 research directions with tradeoffs.

### Phase 5: Pitch Doc

**Goal:** Write the pitch exploration document.

Load `references/pitch-brief-template.md` and write to:

```
docs/cariak/spec/YYYY-MM-DD-[kebab-slug]/pitch-exploration.md
```

**Structure:**

```markdown
# Pitch Exploration: [Topic]

**Date:** YYYY-MM-DD
**Slug:** [kebab-slug]
**Status:** Pitch
**Author:** CariaK + [user name]

## Problem Statement
[Confirmed problem statement from Phase 1]

## Scope
- In scope: ...
- Out of scope: ...

## Audience & Depth
- Audience: ...
- Depth: ...

## Brainstorming Methods Used
| Method | Purpose | Key Output |
|---|---|---|
| [method 1] | ... | ... |
| [method 2] | ... | ... |

## Advisor Counsel Summary
[Synthesis of persona perspectives]

## Research Directions

### Direction 1: [name]
[Full direction with tradeoffs]

### Direction 2: [name]
[Full direction with tradeoffs]

### Direction 3: [name] (if applicable)
[Full direction with tradeoffs]

## Output Document Plan
- [ ] [doc 1]
- [ ] [doc 2]

## Handoff
Next: cariak-grinding (refine a direction into a research-spec.md)
```

**Gate 3 check:** Present the pitch doc path to the user. Ask: "Approve this pitch? (yes / modify / reject)". Wait for explicit approval.

### Phase 6: Handoff

**Goal:** Present the 3-option menu and hand off.

```
Pitch exploration written to: docs/cariak/spec/[slug]/pitch-exploration.md

What's next?
1. **Grind a direction** — Invoke cariak-grinding to refine a direction into a BDD spec
2. **Iterate** — Modify the pitch (add/remove directions, adjust scope, re-run advisor)
3. **Save and stop** — Pitch saved; resume later with "cariak resume [slug]"
```

- If option 1 → ask which direction to grind → invoke `cariak-grinding` with the selected direction.
- If option 2 → return to Phase 2 (re-diverge) or Phase 4 (re-converge) based on user request.
- If option 3 → invoke `cariak-remembering` to store session state.

### Reference Triggers

| Reference | When to Load |
|---|---|
| `references/research-methods.csv` | Phase 0-5: full method catalog with source citations (SCAMPER, PICO, PRISMA-P, OSINT, etc.) |
| `references/brainstorming-methods.csv` | Phase 2: select methods for diverge |
| `references/method-selection.md` | Phase 2: method selection criteria and fallback rules |
| `references/advisor-personas.csv` | Phase 3: select personas for counsel |
| `references/pitch-brief-template.md` | Phase 5: pitch doc format |
| `docs/cariak/spec/YYYY-MM-DD-slug/pitch-exploration.md` | Phase 5: output path |
| Memory MCP | Phase 0: load existing project context |

### Output

```
docs/cariak/spec/YYYY-MM-DD-[kebab-slug]/
  └── pitch-exploration.md     ← THIS SKILL OUTPUT
```

### Handoff

Explicit 3-option menu (see Phase 6). No silent auto-invoke. User must choose.

---

## Bahasa Indonesia

### Prinsip Inti

> **"Divergen dulu, konvergen kemudian. Jangan pernah mengusulkan arah riset sebelum masalahnya sepenuhnya dieksplorasi."**

Pitching adalah pintu masuk siklus riset CariaK. Ia ada karena sebagian besar masalah riset datang dalam keadaan samar, multifaset, atau cacat. Langsung melompat ke spec (cariak-grinding) tanpa mengeksplorasi ruang masalah menghasilkan pertanyaan sempit yang melewatkan peluang nyata. Pitching memaksa divergensi terstruktur — menggunakan metode brainstorming yang dikurasi dan konsultasi advisor multi-persona — sebelum konvergensi menjadi 2-3 arah riset yang layak digiling.

### Kapan Digunakan

- Masalahnya samar, belum terbentuk, atau butuh eksplorasi sebelum penulisan spec.
- Pengguna mengatakan "cariak", "research this", "explore this", "deep research", "gali ini", "cariak ini".
- Proyek riset baru dimulai tanpa arah yang jelas.
- Belum ada `pitch-exploration.md` di `docs/cariak/spec/`.

### JANGAN Digunakan

- Saat masalah sudah jelas didefinisikan (gunakan `cariak-grinding`).
- Saat `research-spec.md` sudah ada (gunakan `cariak-grinding` atau `cariak-planning`).
- Untuk kata kunci "brainstorm" saja — itu memicu `cariak-grinding` (brainstorm menyiratkan penyempurnaan, bukan eksplorasi).
- Saat pitch-exploration.md sudah ada dan pengguna ingin menyempurnakannya (gunakan `cariak-grinding`).

### Tabel Batasan — Skill Terkait

| Batasan | cariak-pitching | cariak-grinding |
|---|---|---|
| Tujuan | Mengeksplorasi ruang masalah | Menentukan pertanyaan riset |
| Output | Menghasilkan: 2-3 arah riset | Menghasilkan: BDD GWT spec |
| Format | Tanpa skenario GWT | Spec GWT penuh dengan kriteria penerimaan |
| Input | Niat pengguna + konteks proyek | pitch-exploration.md (dari pitching) |

| Batasan | cariak-pitching | cariak-advising |
|---|---|---|
| Tujuan | Memiliki alur diverge→converge | Memberikan konsultasi multi-persona |
| Invokasi | Pitching memanggil advising di Fase 3 | Advising mengembalikan nasihat; pitching memiliki keputusan konverge |

| Batasan | cariak-pitching | cariak-validating |
|---|---|---|
| Tujuan | Eksplorasi pra-riset | Falsifikasi pasca-sintesis |
| Tahap | Sebelum riset dimulai | Setelah sintesis selesai |

### Hard Gates

**GATE 0: PREFLIGHT HARUS SELESAI SEBELUM MENYAPA PENGGUNA**

Sebelum interaksi pengguna apa pun, secara diam-diam:
1. Pindai direktori proyek untuk direktori `docs/cariak/spec/` yang ada.
2. Kueri memory MCP untuk entitas `ResearchProject` yang ada terkait topik.
3. Muat `references/brainstorming-methods.csv` secara diam-diam.
4. Muat `references/advisor-personas.csv` secara diam-diam.
5. Muat `references/pitch-brief-template.md` secara diam-diam.

TIDAK ADA OUTPUT sampai preflight selesai. Jika preflight gagal (file hilang), catat file yang hilang dan lanjutkan dengan konteks yang tersedia. Jangan blokir pengguna karena file referensi hilang — lakukan degradasi graceful.

**GATE 1: TIDAK ADA DIVERGEN TANPA KONFIRMASI MASALAH**

Fase 1 (Clarify) berakhir dengan pengguna secara eksplisit mengonfirmasi pernyataan masalah. Diam atau persetujuan samar ("ya", "kira-kira") BUKAN konfirmasi. Pengguna harus menyatakan ulang atau secara eksplisit setuju dengan pernyataan masalah dengan kata-kata mereka sendiri. Jika pengguna tidak dapat mengartikulasikan masalahnya, kembali ke pertanyaan klarifikasi.

**GATE 2: ADVISOR CHALLENGE WAJIB — TESIS → ANTITESIS → SINTESIS**

Pipeline advisor challenge + counsel tidak opsional. Dialektika harus berjalan penuh:
1. Fase 2 = TESIS: Output SEMUA hasil metode brainstorming ke percakapan.
2. Fase 2d = ANTITESIS: Kirim advisor Devil's Advocate untuk menantang hasil brainstorming. Temukan titik buta, sudut yang hilang, asumsi yang belum diuji. Advisor harus menyitir sumber.
3. Fase 3 = SINTESIS MULTI-PERSONA: Kirim 3-5 persona advisor untuk mensintesiskan challenge + brainstorm menjadi nasihat.
4. Jangan lewati langkah mana pun. Bahkan jika masalah terlihat jelas, dialektika advisor mengungkap titik buta. Langkah antitesis (Fase 2d) adalah challenge kritis — jangan lanjut dari tesis (brainstorm) langsung ke sintesis (konvergen) tanpa melewati antitesis.

**GATE 3: PENGGUNA HARUS MENYETUJUI PITCH BRIEF**

Sebelum memanggil `cariak-grinding`, sajikan pitch-exploration.md lengkap ke pengguna dan tanyakan: "Setujui pitch ini? (ya / modifikasi / tolak)". Tidak ada handoff ke grinding tanpa persetujuan eksplisit.

### Fase 0: Preflight

**Tujuan:** Mengumpulkan konteks secara diam-diam sebelum berinteraksi dengan pengguna.

1. **Pindai konteks proyek:**
   - Cek `docs/cariak/spec/` untuk pitch doc yang ada.
   - Jika slug ada, identifikasi dan catat pekerjaan sebelumnya.
2. **Cek memory MCP:**
   - `memory_search_nodes(query="{topik_proyek}")` untuk entitas `ResearchProject` yang ada.
   - Jika ditemukan, muat graf entitas (artifacts, insights, decisions, gaps).
3. **Muat file referensi secara diam-diam:**
   - `references/brainstorming-methods.csv` — enumerasi metode yang tersedia.
   - `references/advisor-personas.csv` — enumerasi persona yang tersedia.
   - `references/pitch-brief-template.md` — muat format pitch doc.

**Output:** Hanya konteks internal. Tidak ada output ke pengguna sampai sapaan.

**Cek Gate 0:** Preflight selesai? Jika ya → lanjut ke sapaan.

### Fase 1: Clarify (Gate 0)

**Tujuan:** Memahami niat, scope, audiens, kedalaman, dan routing dokumen pengguna sebelum divergen.

Ajukan pertanyaan klarifikasi SATU PER SATU (pola Three Amigos — satu pertanyaan, tunggu jawaban, lalu berikutnya):

1. **Niat:** "Apa yang ingin Anda pahami atau putuskan?"
2. **Scope:** "Apa yang masuk scope dan apa yang secara eksplisit di luar scope?"
3. **Audiens:** "Siapa yang akan membaca output riset final?"
4. **Kedalaman:** "Seberapa dalam ini harus dilakukan — gambaran umum, moderat, atau ekshaustif?"
5. **Routing dokumen:** "Dokumen output apa yang Anda butuhkan? (laporan, brief, slide, data?)"

Setelah semua jawaban, sintesiskan **pernyataan masalah** dan sajikan:

```
## Pernyataan Masalah (Draft)

[Pernyataan masalah 1-2 kalimat]

Dalam scope: ...
Di luar scope: ...
Audiens: ...
Kedalaman: ...
Dokumen output: ...
```

**Cek Gate 1:** Tanyakan: "Apakah pernyataan masalah ini menangkap niat Anda? Silakan konfirmasi atau koreksi." Tunggu konfirmasi eksplisit. Jika pengguna mengatakan "ya" tanpa keterlibatan, tanyakan: "Bisakah Anda menyatakan ulang masalah dengan kata-kata Anda sendiri?" untuk verifikasi.

### Fase 2: Divergen Masalah

**Tujuan:** Mengeksplorasi ruang masalah menggunakan metode brainstorming terstruktur.

1. **Pilih 3-5 metode** dari `brainstorming-methods.csv` berdasarkan kolom `best_for` yang cocok dengan tipe masalah. Jika `best_for` metode yang dipilih tidak cocok, gunakan `fallback_method`-nya. Lihat `references/method-selection.md` untuk kriteria seleksi lengkap dan trio default.
2. **Jalankan setiap metode** dan output hasil ke percakapan:

Untuk setiap metode:
```
### Metode: [nama metode]
**Sumber:** brainstorming-methods.csv, baris [N]
**Output:**
[Output spesifik metode — pertanyaan, sudut, variabel, skenario]
```

3. **Kumpulkan semua output** — jangan filter dulu. Divergensi berarti volume.

**Output:** Semua hasil metode terlihat di percakapan. JANGAN lanjut ke Fase 3 sampai semua metode dioutput.

### Fase 2d: Advisor Challenge (ANTITESIS)

**Tujuan:** Menantang output brainstorming dengan advisor Devil's Advocate + Domain Expert SEBELUM konvergensi.

Ini adalah langkah TESIS → ANTITESIS. Hasil brainstorming adalah tesis. Sekarang advisor independen harus menantangnya.

1. **Kirim advisor Devil's Advocate** (via `cariak-advising` dengan satu persona advisor):
   - Persona advisor adalah **model/persona BERBEDA**, bukan kritik-diri.
   - Tugas advisor: temukan titik buta, sudut yang hilang, bukti tanding, bias.
   - Advisor HARUS menyitir sumber untuk tantangan mereka (Hukum Besi: tidak ada klaim tanpa sumber).
2. **Pertanyaan challenge advisor:**
   - "Apakah kita menanyakan pertanyaan yang tepat? Asumsi apa yang belum diuji?"
   - "Sudut masalah apa yang TIDAK dieksplorasi oleh metode brainstorming?"
   - "Bias apa yang ada dalam cara masalah diframing?"
   - "Perspektif tandingan apa yang hilang dari output divergen?"
3. **Advisor mengembalikan:**
   - Titik buta yang diidentifikasi dalam output brainstorming.
   - Sudut yang hilang yang tidak dieksplorasi metode.
   - Asumsi yang belum diuji dalam framing masalah.
   - Rekomendasi spesifik: apa yang perlu ditinjau ulang, apa yang perlu dijatuhkan.

**Cek Gate 2:** Advisor challenge dieksekusi? Semua hasil metode dioutput ke percakapan SEBELUM challenge? Jika tidak → berhenti dan selesaikan gate. Output advisor challenge adalah input WAJIB ke Fase 4 (Konvergen).

**Output:** Hasil advisor challenge — titik buta, sudut yang hilang, asumsi yang belum diuji.

### Fase 3: Konsultasi Advisor (SINTESIS Multi-Persona)

**Tujuan:** Mendapatkan perspektif multi-persona pada output divergen + hasil advisor challenge sebelum konvergen.

1. **Pilih 3-5 persona** dari `advisor-personas.csv` berdasarkan tipe masalah:
   - Selalu sertakan setidaknya satu persona skeptis/kritis.
   - Selalu sertakan setidaknya satu ahli domain.
   - Variasikan sisanya berdasarkan sifat masalah.
2. **Panggil skill `cariak-advising` (atau tool `advisor()`)** dengan:
   - Pernyataan masalah (dari Fase 1).
   - Semua output metode brainstorming (dari Fase 2).
   - Hasil advisor challenge (dari Fase 2d).
   - Persona yang dipilih.
3. **Terima nasihat** — setiap persona memberikan:
   - Titik buta yang diidentifikasi.
   - Arah yang layak dieksplorasi.
   - Arah yang layak dijatuhkan.
   - Pertanyaan yang terlewat dari eksplorasi.

**Output:** Nasihat advisor disintesis dan disajikan.

### Fase 4: Konvergen (SINTESIS)

**Tujuan:** Mensintesiskan output divergen + nasihat advisor menjadi 2-3 arah riset.

Untuk setiap arah riset:

```
### Arah [N]: [Nama Arah]

**Sudut masalah:** [aspek masalah mana yang diaddress ini]
**Pertanyaan riset (draft):** [pertanyaan yang akan digiling arah ini]
**Tradeoff:**
- Pro: [apa yang diperoleh arah ini]
- Kontra: [apa yang dikorbankan arah ini]
- Risiko: [apa yang bisa salah]
**Dukungan advisor:** [persona mana yang mendukung, mana yang menolak]
**Metode sumber:** [metode brainstorming mana yang menghasilkan ini]
```

Hasilkan tepat 2-3 arah. Bukan 1 (terlalu sempit), bukan 5+ (terlalu divergen).

**Output:** 2-3 arah riset dengan tradeoff.

### Fase 5: Dokumen Pitch

**Tujuan:** Menulis dokumen eksplorasi pitch.

Muat `references/pitch-brief-template.md` dan tulis ke:

```
docs/cariak/spec/YYYY-MM-DD-[kebab-slug]/pitch-exploration.md
```

**Struktur:**

```markdown
# Eksplorasi Pitch: [Topik]

**Tanggal:** YYYY-MM-DD
**Slug:** [kebab-slug]
**Status:** Pitch
**Penulis:** CariaK + [nama pengguna]

## Pernyataan Masalah
[Pernyataan masalah yang dikonfirmasi dari Fase 1]

## Scope
- Dalam scope: ...
- Di luar scope: ...

## Audiens & Kedalaman
- Audiens: ...
- Kedalaman: ...

## Metode Brainstorming yang Digunakan
| Metode | Tujuan | Output Kunci |
|---|---|---|
| [metode 1] | ... | ... |
| [metode 2] | ... | ... |

## Ringkasan Nasihat Advisor
[Sintesis perspektif persona]

## Arah Riset

### Arah 1: [nama]
[Arah lengkap dengan tradeoff]

### Arah 2: [nama]
[Arah lengkap dengan tradeoff]

### Arah 3: [nama] (jika ada)
[Arah lengkap dengan tradeoff]

## Rencana Dokumen Output
- [ ] [doc 1]
- [ ] [doc 2]

## Handoff
Berikutnya: cariak-grinding (sempurnakan arah menjadi research-spec.md)
```

**Cek Gate 3:** Sajikan path pitch doc ke pengguna. Tanyakan: "Setujui pitch ini? (ya / modifikasi / tolak)". Tunggu persetujuan eksplisit.

### Fase 6: Handoff

**Tujuan:** Sajikan menu 3 opsi dan serahkan.

```
Eksplorasi pitch ditulis ke: docs/cariak/spec/[slug]/pitch-exploration.md

Selanjutnya apa?
1. **Giling arah** — Panggil cariak-grinding untuk menyempurnakan arah menjadi BDD spec
2. **Iterasi** — Modifikasi pitch (tambah/hapus arah, sesuaikan scope, jalankan ulang advisor)
3. **Simpan dan berhenti** — Pitch disimpan; lanjut nanti dengan "cariak resume [slug]"
```

- Jika opsi 1 → tanyakan arah mana yang akan digiling → panggil `cariak-grinding` dengan arah yang dipilih.
- Jika opsi 2 → kembali ke Fase 2 (divergen ulang) atau Fase 4 (konvergen ulang) berdasarkan permintaan pengguna.
- Jika opsi 3 → panggil `cariak-remembering` untuk menyimpan state sesi.

### Pemicu Referensi

| Referensi | Kapan Dimuat |
|---|---|
| `references/brainstorming-methods.csv` | Fase 2: pilih metode untuk divergen |
| `references/method-selection.md` | Fase 2: kriteria seleksi metode dan aturan fallback |
| `references/advisor-personas.csv` | Fase 3: pilih persona untuk konsultasi |
| `references/pitch-brief-template.md` | Fase 5: format pitch doc |
| `docs/cariak/spec/YYYY-MM-DD-slug/pitch-exploration.md` | Fase 5: path output |
| Memory MCP | Fase 0: muat konteks proyek yang ada |

### Output

```
docs/cariak/spec/YYYY-MM-DD-[kebab-slug]/
  └── pitch-exploration.md     ← OUTPUT SKILL INI
```

### Handoff

Menu 3 opsi eksplisit (lihat Fase 6). Tidak ada auto-invoke diam-diam. Pengguna harus memilih.
