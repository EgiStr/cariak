---
name: cariak-closing
description: Terminal pipeline stage. User invokes after cariak-reflecting marks research PHASE_REVIEWED or after cariak-validating produces verdicts. Reconciles research outcomes against quality thresholds, gates on verdict status (CONFIRMED/REFUTED/INCONCLUSIVE), advances ResearchProject status to COMPLETED via cariak-remembering, and emits a closeout summary. Trigger on "close research", "finalize research", "tutup riset", "closeout", or when a research pipeline reaches its end.
---

# CariaK Closing / Penutupan CariaK

<!-- CARIAK SKILL: cariak-closing - v1.1 -->

## English

### Core Principle

**"Research is not closed until it is archived, summarized, and learnable. A half-closed research project is a knowledge leak."**

Closing is the terminal stage. It does not re-evaluate, re-validate, or re-reflect — it reads what reflection and validation produced, gates closure on their outcomes, and translates them into an archive-and-close or a block. No clean verdict, no close. No memory update, no close.

### Position in Cariak Pipeline

```
pitching → grinding → advising → planning → researching → synthesizing → validating → reflecting → CLOSING
                                                                                                      ↑
                                                                                        User invokes — or
                                                                                        reflecting hands off
                                                                                        (PASS → close)
```

Closing runs after cariak-reflecting returns `PASS` (or after cariak-validating produces verdicts on a reflected project). It is the final skill invoked by the user to seal the research.

### When to Use

- All research phases are complete and reflection has passed
- cariak-reflecting produced `reflection-report.md` with decision: `PASS`
- cariak-validating produced `validation-report.md` with verdicts reconciled
- User says "close research", "finalize", "complete", "tutup riset", "closeout"
- The last active skill (reflecting or validating) hands off
- User wants to export or archive the research

### Do NOT Use

- If reflection is still in progress (run cariak-reflecting first)
- If reflection returned `RE-RESEARCH` — fix gaps first, then re-reflect
- If validation returned `REFUTED` on critical claims without resolution
- If the research project has no `research-report.md` (incomplete pipeline)
- If the user explicitly says "keep it open" or "not done yet"

### Boundary Table

| Adjacent Skill      | Relationship | Handoff Rule                                         |
|---------------------|-------------|------------------------------------------------------|
| cariak-reflecting   | Upstream    | Provides reflection-report.md with PASS/RE-RESEARCH  |
| cariak-validating   | Upstream    | Provides validation-report.md with verdicts          |
| cariak-synthesizing | Upstream    | Provides research-report.md and references.json      |
| cariak-remembering  | Sub-routine | Called to update entity graph (Phase 2)              |
| (Export tools)      | Downstream  | User may export PDFs/ZIP after closing (Phase 4)     |

### Hard Gates

#### GATE 0: PREFLIGHT MUST COMPLETE BEFORE CLOSING

Verify all prerequisite artifacts exist:
- `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.md`
- `docs/cariak/synthesized/YYYY-MM-DD-slug/validation-report.md`
- `docs/cariak/synthesized/YYYY-MM-DD-slug/reflection-report.md`
- `docs/cariak/synthesized/YYYY-MM-DD-slug/references.json`

Verify reflection-report.md status is `PASS`.

If any artifact is missing → `CLOSE_BLOCKED: "Missing artifact: <name>. Run the corresponding phase first."`
If reflection status is `RE-RESEARCH` → `CLOSE_BLOCKED: "Reflection returned RE-RESEARCH. Fix gaps and re-reflect before closing."`

#### GATE 1: VERDICT GATE

If any critical claim in validation-report.md is `REFUTED` without documented resolution → `CLOSE_BLOCKED`.

**"Research cannot close with unresolved refutations."**

For each REFUTED claim, check validation-report.md for:
- A documented resolution (e.g., "Claim refuted but scope narrowed", "Refutation accepted — finding removed")
- An explicit note that the refutation has been addressed
If neither exists → the claim blocks closure.

If all claims are `CONFIRMED` or `INCONCLUSIVE` with documented assumptions → gate passes.

#### GATE 2: MEMORY GATE

Must update the Memory MCP before closing. Specifically:
- The ResearchProject entity's `status` field must be set to `COMPLETED`
- All ResearchArtifact entities must have valid file paths on disk
- A relation `ResearchProject` "`has_final_output`" → each ResearchArtifact must exist
- A ResearchSession entity must be created for the closing phase

If memory MCP is unavailable → warn user and proceed with file-only closeout. Do not block.

---

### Phase 0: Preflight (Silent Scan)

Run all steps before changing any state. Any failure blocks closure.

1. **Resolve project directory:**
   - Scan `docs/cariak/synthesized/` for the latest project directory (YYYY-MM-DD-slug).
   - If user specifies a slug, use that directory.
   - If no directories exist → `CLOSE_BLOCKED: "No synthesized research found."`

2. **Verify artifact existence (GATE 0):**
   ```
   [ ] research-report.md  — exists, non-empty
   [ ] validation-report.md — exists
   [ ] reflection-report.md — exists
   [ ] references.json      — exists, valid JSON
   ```

3. **Load reflection report:**
   - Extract `decision` field → must be `PASS`.
   - Extract `iteration` count for the closeout summary.
   - If `decision` is `RE-RESEARCH` → GATE 0 blocks.

4. **Load validation report:**
   - Extract all claims and their verdicts.
   - Count: CONFIRMED, REFUTED, INCONCLUSIVE.
   - Identify any REFUTED claims → these are gate candidates.

5. **Load references.json:**
   - Extract total source count.
   - Extract source type distribution (academic, news, social, market, internet).

6. **Check memory MCP availability:**
   - Attempt `memory_search_nodes(query="{project_name}")`.
   - If unavailable → note for graceful degradation in Phase 2.
   - If available → load existing entity graph.

**Output:** Preflight report (silent unless blocked).

---

### Phase 1: Verdict Gate

Reconcile all validation verdicts before allowing close.

1. **Build verdict table from validation-report.md:**
   ```
   | # | Claim                          | Verdict      | Confidence | Resolution |
   |---|--------------------------------|--------------|------------|------------|
   | 1 | "X causes Y in Z context"      | CONFIRMED    | 0.85       | —          |
   | 2 | "A is always preferable to B"  | REFUTED      | 0.72       | Accepted scope limitation |
   | 3 | "C and D are correlated"       | INCONCLUSIVE | 0.45       | Needs longitudinal data |
   ```

2. **Gate on REFUTED claims:**
   For each `REFUTED` claim:
   - Is there a documented resolution in the validation report?
   - If YES → note the resolution and pass.
   - If NO → `CLOSE_BLOCKED: "Claim #N ('<claim text>') is REFUTED with no resolution. Address or acknowledge before closing."`

3. **Gate on criticality:**
   - Critical claim = a claim marked as foundational or high-priority in the research spec.
   - Non-critical REFUTED claims with documented resolutions → pass with a warning.
   - Critical REFUTED claims without resolution → `CLOSE_BLOCKED`.

4. **Build final verdict summary:**
   ```
   Total claims:  N
   CONFIRMED:     X (XX%)
   REFUTED:       Y (YY%) — all resolved
   INCONCLUSIVE:  Z (ZZ%) — documented assumptions
   ```

**Output:** Verdict summary (passes to Phase 2, or blocks).

---

### Phase 2: Memory Close

Update the Memory MCP entity graph to reflect project completion.

1. **Search for existing project entity:**
   ```
   memory_search_nodes(query="{project_slug}")
   ```
   If no entity exists → create one with status `COMPLETED`.
   If entity exists → update it.

2. **Update ResearchProject entity:**
   - Set `status` → `"COMPLETED"`
   - Set `date_completed` → current date (YYYY-MM-DD)
   - Set `confidence_score` → from reflection report
   - Add observation: "Project closed on {date}. Final verdicts: {X} CONFIRMED, {Y} REFUTED (resolved), {Z} INCONCLUSIVE."

3. **Link final artifacts:**
   For each artifact file (research-report.md, validation-report.md, reflection-report.md, references.json):
   - Verify the file exists on disk.
   - Create or update ResearchArtifact entity with:
     - `path`: absolute or relative path
     - `type`: report / validation / reflection / references
     - `phase`: "COMPLETED"
   - Create relation: `ResearchProject "has_final_output" → ResearchArtifact`

4. **Create closing session:**
   - Create ResearchSession entity:
     - `phase`: "CLOSING"
     - `timestamp`: current ISO 8601 datetime
     - `summary`: "Research pipeline closed. See closeout.md for full summary."
   - Create relation: `ResearchProject "HAS_SESSION" → ResearchSession`

5. **If memory MCP unavailable:**
   - Warn: "Memory MCP unavailable. Project status not updated in entity graph. File artifacts are complete."
   - This is graceful degradation — do not block closure.

**Output:** Memory graph updated (or warning issued).

---

### Phase 3: Closeout Summary

Write the terminal artifact: `docs/cariak/synthesized/YYYY-MM-DD-slug/closeout.md`

```
# Research Closeout — [project_name]

**Date:** YYYY-MM-DD
**Status:** COMPLETED
**Pipeline Version:** v1.1

---

## Pipeline Summary

| Phase   | Skill              | Status         | Artifact                    |
|---------|--------------------|----------------|-----------------------------|
| 1       | cariak-pitching    | COMPLETED      | pitch-exploration.md        |
| 2       | cariak-grinding    | COMPLETED      | research-spec.md            |
| 3       | cariak-advising    | COMPLETED      | advisor-counsel.md          |
| 4       | cariak-planning    | COMPLETED      | research-plan.md            |
| 5       | cariak-researching | COMPLETED      | sub-agent findings          |
| 6       | cariak-synthesizing| COMPLETED      | research-report.md          |
| 7       | cariak-validating  | COMPLETED      | validation-report.md        |
| 8       | cariak-reflecting  | PASS           | reflection-report.md        |
| 9       | cariak-closing     | COMPLETED      | closeout.md (this file)     |

---

## Research Outcomes

- **Research Questions:** N total — M fully answered, K partially answered, L unanswered
- **Sources:** N total (Academic: X, Web: Y, Social: Z, News: W, Market: V)
- **Confidence Score:** X.XX / 1.0 (from reflection)
- **Iterations:** N (0 = original research)

---

## Verdict Summary

| # | Claim                                      | Verdict      | Confidence | Resolution                        |
|---|--------------------------------------------|--------------|------------|-----------------------------------|
| 1 | [claim text from validation]               | CONFIRMED    | X.XX       | —                                 |
| 2 | [claim text]                               | REFUTED      | X.XX       | [resolution from validation]      |
| 3 | [claim text]                               | INCONCLUSIVE | X.XX       | [assumption or gap documented]    |

---

## Key Insights

1. [Most important finding — one sentence, evidence-backed]
2. [Second finding]
3. [Third finding]
4. [Fourth finding]
5. [Fifth finding]

---

## Research Gaps

- [Gap 1: description, priority, status]
- [Gap 2: description, priority, status]
- [Gap 3: description, priority, status]

---

## Artifacts Produced

| File                        | Type         | Phase          |
|-----------------------------|--------------|----------------|
| pitch-exploration.md        | pitch        | PITCHING       |
| research-spec.md            | spec         | GRINDING       |
| advisor-counsel.md          | counsel      | ADVISING       |
| research-plan.md            | plan         | PLANNING       |
| research-report.md          | report       | SYNTHESIZING   |
| references.json             | references   | SYNTHESIZING   |
| validation-report.md        | validation   | VALIDATING     |
| reflection-report.md        | reflection   | REFLECTING     |
| closeout.md                 | closeout     | CLOSING        |

---

## Memory Snapshot

- **ResearchProject:** [entity name or ID]
- **Artifacts:** N entities created/updated
- **Sessions:** N sessions recorded
- **Insights:** N insights stored
- **Gaps:** N research gaps identified

---

## Archived

**Date:** YYYY-MM-DD
**Status:** COMPLETED
**Closed by:** cariak-closing v1.1

All artifacts are located in: `docs/cariak/synthesized/YYYY-MM-DD-slug/`
```

---

### Phase 4: Handoff (3-Option Menu)

After the closeout summary is written, present the user with:

```
─────────────────────────────────────────────────
Research closeout written to:
  docs/cariak/synthesized/YYYY-MM-DD-slug/closeout.md

What would you like to do next?
  1. Export all artifacts (generate PDFs or ZIP)
  2. Start new research on a related topic (pitch → close)
  3. Save and exit — research is archived
─────────────────────────────────────────────────
```

- **Option 1:** Triggers export tools (PDF generation via `pdf` skill or ZIP via shell).
- **Option 2:** Prompts the user for a related topic and invokes `cariak-pitching`.
- **Option 3:** Ends the session. Research is fully archived.

---

### Output States

| State            | Meaning                                                                 |
|------------------|-------------------------------------------------------------------------|
| `CLOSED`         | All gates passed, memory updated, closeout.md written                   |
| `CLOSE_BLOCKED`  | Preflight failed, verdict gate blocked, or critical refutation unresolved |
| `ALREADY_CLOSED` | A closeout.md already exists and ResearchProject status is COMPLETED    |

---

### Iron Laws

```
1. NO CLOSE WITH UNRESOLVED REFUTATIONS
   Any REFUTED critical claim without documented resolution → CLOSE_BLOCKED.
   WHY: Closing over an unresolved refutation archives known-false findings as fact.

2. NO CLOSE WITHOUT REFLECTION PASS
   If reflection-report.md decision is RE-RESEARCH → CLOSE_BLOCKED.
   WHY: Reflection is the quality gate. Skipping it ships sub-threshold research.

3. NO CLOSE WITHOUT MEMORY UPDATE
   The ResearchProject entity MUST transition to COMPLETED.
   If memory MCP is down, warn but do NOT block — file artifacts are the source of truth.
   WHY: An open entity in the graph leaks context into future sessions.

4. NO SILENT BLOCK
   Every CLOSE_BLOCKED states: what blocked, why, and what would unblock.
   WHY: "Can't close" without a reason creates deadlock.

5. NO RE-EVALUATION
   Closing reads verdicts and reflection decisions — it never re-reviews claims.
   WHY: Re-evaluating during closing duplicates validating/reflecting and corrupts the audit trail.
```

### Reference Triggers

| Reference                          | When to Load                               |
|------------------------------------|--------------------------------------------|
| `references/closeout-template.md`  | Phase 3: format closeout summary           |
| memory MCP tools                   | Phase 2: update entity graph               |
| `cariak-remembering` skill         | Phase 2: if direct memory tools unavailable |

### Output

- `docs/cariak/synthesized/YYYY-MM-DD-slug/closeout.md`
- Memory MCP entities updated (ResearchProject status → COMPLETED, artifacts linked, closing session created)

---

## Bahasa Indonesia

### Prinsip Inti

**"Riset tidak selesai sampai diarsipkan, diringkas, dan bisa dipelajari. Proyek riset yang setengah ditutup adalah kebocoran pengetahuan."**

Penutupan adalah tahap terminal. Ia tidak mengevaluasi ulang, memvalidasi ulang, atau merefleksi ulang — ia membaca apa yang dihasilkan oleh refleksi dan validasi, memagari penutupan berdasarkan hasilnya, dan menerjemahkannya menjadi arsip-dan-tutup atau blokir. Tidak ada verdict bersih, tidak ada penutupan. Tidak ada pembaruan memori, tidak ada penutupan.

### Posisi dalam Pipeline Cariak

```
pitching → grinding → advising → planning → researching → synthesizing → validating → reflecting → CLOSING
                                                                                                      ↑
                                                                                        Pengguna memanggil —
                                                                                        atau reflecting menyerahkan
                                                                                        (PASS → close)
```

Penutupan berjalan setelah cariak-reflecting mengembalikan `PASS` (atau setelah cariak-validating menghasilkan verdict pada proyek yang sudah direfleksikan). Ini adalah skill terakhir yang dipanggil pengguna untuk menyegel riset.

### Kapan Menggunakan

- Semua fase riset selesai dan refleksi telah lulus
- cariak-reflecting menghasilkan `reflection-report.md` dengan keputusan: `PASS`
- cariak-validating menghasilkan `validation-report.md` dengan verdict yang sudah direkonsiliasi
- Pengguna mengatakan "close research", "finalize", "complete", "tutup riset", "closeout"
- Skill aktif terakhir (reflecting atau validating) menyerahkan kendali
- Pengguna ingin mengekspor atau mengarsipkan riset

### JANGAN Gunakan

- Jika refleksi masih berlangsung (jalankan cariak-reflecting dulu)
- Jika refleksi mengembalikan `RE-RESEARCH` — perbaiki celah dulu, lalu refleksi ulang
- Jika validasi mengembalikan `REFUTED` pada klaim kritis tanpa resolusi
- Jika proyek riset tidak memiliki `research-report.md` (pipeline belum lengkap)
- Jika pengguna secara eksplisit mengatakan "biarkan terbuka" atau "belum selesai"

### Tabel Batasan

| Skill Terkait        | Hubungan    | Aturan Penyerahan                                       |
|----------------------|-------------|--------------------------------------------------------|
| cariak-reflecting    | Hulu        | Menyediakan reflection-report.md dengan PASS/RE-RESEARCH |
| cariak-validating    | Hulu        | Menyediakan validation-report.md dengan verdict         |
| cariak-synthesizing  | Hulu        | Menyediakan research-report.md dan references.json      |
| cariak-remembering   | Sub-rutin   | Dipanggil untuk memperbarui entity graph (Fase 2)       |
| (Alat ekspor)        | Hilir       | Pengguna dapat mengekspor PDF/ZIP setelah penutupan      |

### Gerbang Keras

#### GERBANG 0: PREFLIGHT HARUS SELESAI SEBELUM PENUTUPAN

Verifikasi semua artefak prasyarat ada:
- `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.md`
- `docs/cariak/synthesized/YYYY-MM-DD-slug/validation-report.md`
- `docs/cariak/synthesized/YYYY-MM-DD-slug/reflection-report.md`
- `docs/cariak/synthesized/YYYY-MM-DD-slug/references.json`

Verifikasi status reflection-report.md adalah `PASS`.

Jika ada artefak yang hilang → `CLOSE_BLOCKED: "Artefak hilang: <nama>. Jalankan fase terkait terlebih dahulu."`
Jika status refleksi adalah `RE-RESEARCH` → `CLOSE_BLOCKED: "Refleksi mengembalikan RE-RESEARCH. Perbaiki celah dan refleksi ulang sebelum menutup."`

#### GERBANG 1: GERBANG VERDICT

Jika ada klaim kritis di validation-report.md yang `REFUTED` tanpa resolusi terdokumentasi → `CLOSE_BLOCKED`.

**"Riset tidak dapat ditutup dengan sanggahan yang belum terselesaikan."**

Untuk setiap klaim REFUTED, periksa validation-report.md untuk:
- Resolusi terdokumentasi (mis. "Klaim disanggah tapi cakupan dipersempit", "Sanggahan diterima — temuan dihapus")
- Catatan eksplisit bahwa sanggahan telah ditangani
Jika tidak ada → klaim memblokir penutupan.

Jika semua klaim `CONFIRMED` atau `INCONCLUSIVE` dengan asumsi terdokumentasi → gerbang lulus.

#### GERBANG 2: GERBANG MEMORI

Harus memperbarui Memory MCP sebelum menutup. Secara spesifik:
- Field `status` pada entitas ResearchProject harus diatur ke `COMPLETED`
- Semua entitas ResearchArtifact harus memiliki path file yang valid di disk
- Relasi `ResearchProject` "`has_final_output`" → setiap ResearchArtifact harus ada
- Entitas ResearchSession harus dibuat untuk fase penutupan

Jika memory MCP tidak tersedia → peringatkan pengguna dan lanjutkan dengan closeout berbasis file saja. Jangan blokir.

---

### Fase 0: Preflight (Pemindaian Senyap)

Jalankan semua langkah sebelum mengubah state apapun. Kegagalan apapun memblokir penutupan.

1. **Tentukan direktori proyek:**
   - Pindai `docs/cariak/synthesized/` untuk direktori proyek terbaru (YYYY-MM-DD-slug).
   - Jika pengguna menyebutkan slug, gunakan direktori itu.
   - Jika tidak ada direktori → `CLOSE_BLOCKED: "Tidak ada riset tersintesis yang ditemukan."`

2. **Verifikasi keberadaan artefak (GERBANG 0):**
   ```
   [ ] research-report.md  — ada, tidak kosong
   [ ] validation-report.md — ada
   [ ] reflection-report.md — ada
   [ ] references.json      — ada, JSON valid
   ```

3. **Muat laporan refleksi:**
   - Ekstrak field `decision` → harus `PASS`.
   - Ekstrak jumlah `iteration` untuk ringkasan closeout.
   - Jika `decision` adalah `RE-RESEARCH` → GERBANG 0 memblokir.

4. **Muat laporan validasi:**
   - Ekstrak semua klaim dan verdict-nya.
   - Hitung: CONFIRMED, REFUTED, INCONCLUSIVE.
   - Identifikasi klaim REFUTED → ini adalah kandidat gerbang.

5. **Muat references.json:**
   - Ekstrak total jumlah sumber.
   - Ekstrak distribusi tipe sumber (academic, news, social, market, internet).

6. **Periksa ketersediaan memory MCP:**
   - Coba `memory_search_nodes(query="{nama_proyek}")`.
   - Jika tidak tersedia → catat untuk degradasi anggun di Fase 2.
   - Jika tersedia → muat entity graph yang ada.

**Output:** Laporan preflight (senyap kecuali diblokir).

---

### Fase 1: Gerbang Verdict

Rekonsiliasi semua verdict validasi sebelum mengizinkan penutupan.

1. **Bangun tabel verdict dari validation-report.md:**
   ```
   | # | Klaim                          | Verdict      | Keyakinan | Resolusi |
   |---|--------------------------------|--------------|-----------|----------|
   | 1 | "X menyebabkan Y di konteks Z" | CONFIRMED    | 0.85      | —        |
   | 2 | "A selalu lebih baik dari B"   | REFUTED      | 0.72      | Pembatasan cakupan diterima |
   | 3 | "C dan D berkorelasi"          | INCONCLUSIVE | 0.45      | Butuh data longitudinal |
   ```

2. **Gerbang pada klaim REFUTED:**
   Untuk setiap klaim `REFUTED`:
   - Apakah ada resolusi terdokumentasi di laporan validasi?
   - Jika YA → catat resolusi dan lanjutkan.
   - Jika TIDAK → `CLOSE_BLOCKED: "Klaim #N ('<teks klaim>') REFUTED tanpa resolusi. Tangani atau akui sebelum menutup."`

3. **Gerbang pada kekritisan:**
   - Klaim kritis = klaim yang ditandai sebagai fondasional atau prioritas tinggi di spek riset.
   - Klaim REFUTED non-kritis dengan resolusi terdokumentasi → lanjutkan dengan peringatan.
   - Klaim REFUTED kritis tanpa resolusi → `CLOSE_BLOCKED`.

4. **Bangun ringkasan verdict akhir:**
   ```
   Total klaim:  N
   CONFIRMED:     X (XX%)
   REFUTED:       Y (YY%) — semua terselesaikan
   INCONCLUSIVE:  Z (ZZ%) — asumsi terdokumentasi
   ```

**Output:** Ringkasan verdict (diteruskan ke Fase 2, atau diblokir).

---

### Fase 2: Penutupan Memori

Perbarui entity graph Memory MCP untuk mencerminkan penyelesaian proyek.

1. **Cari entitas proyek yang ada:**
   ```
   memory_search_nodes(query="{slug_proyek}")
   ```
   Jika tidak ada entitas → buat satu dengan status `COMPLETED`.
   Jika entitas ada → perbarui.

2. **Perbarui entitas ResearchProject:**
   - Atur `status` → `"COMPLETED"`
   - Atur `date_completed` → tanggal saat ini (YYYY-MM-DD)
   - Atur `confidence_score` → dari laporan refleksi
   - Tambahkan observasi: "Proyek ditutup pada {tanggal}. Verdict akhir: {X} CONFIRMED, {Y} REFUTED (terselesaikan), {Z} INCONCLUSIVE."

3. **Tautkan artefak akhir:**
   Untuk setiap file artefak (research-report.md, validation-report.md, reflection-report.md, references.json):
   - Verifikasi file ada di disk.
   - Buat atau perbarui entitas ResearchArtifact dengan:
     - `path`: path absolut atau relatif
     - `type`: report / validation / reflection / references
     - `phase`: "COMPLETED"
   - Buat relasi: `ResearchProject "has_final_output" → ResearchArtifact`

4. **Buat sesi penutupan:**
   - Buat entitas ResearchSession:
     - `phase`: "CLOSING"
     - `timestamp`: datetime ISO 8601 saat ini
     - `summary`: "Pipeline riset ditutup. Lihat closeout.md untuk ringkasan lengkap."
   - Buat relasi: `ResearchProject "HAS_SESSION" → ResearchSession`

5. **Jika memory MCP tidak tersedia:**
   - Peringatkan: "Memory MCP tidak tersedia. Status proyek tidak diperbarui di entity graph. Artefak file lengkap."
   - Ini adalah degradasi anggun — jangan blokir penutupan.

**Output:** Memory graph diperbarui (atau peringatan dikeluarkan).

---

### Fase 3: Ringkasan Closeout

Tulis artefak terminal: `docs/cariak/synthesized/YYYY-MM-DD-slug/closeout.md`

Gunakan template yang sama dengan versi Bahasa Inggris di atas, dengan header berbahasa Indonesia:

```
# Penutupan Riset — [nama_proyek]

**Tanggal:** YYYY-MM-DD
**Status:** COMPLETED
**Versi Pipeline:** v1.1

---

## Ringkasan Pipeline

| Fase | Skill              | Status      | Artefak                      |
|------|--------------------|-------------|------------------------------|
| 1    | cariak-pitching    | COMPLETED   | pitch-exploration.md         |
| 2    | cariak-grinding    | COMPLETED   | research-spec.md             |
| 3    | cariak-advising    | COMPLETED   | advisor-counsel.md           |
| 4    | cariak-planning    | COMPLETED   | research-plan.md             |
| 5    | cariak-researching | COMPLETED   | temuan sub-agent             |
| 6    | cariak-synthesizing| COMPLETED   | research-report.md           |
| 7    | cariak-validating  | COMPLETED   | validation-report.md         |
| 8    | cariak-reflecting  | PASS        | reflection-report.md         |
| 9    | cariak-closing     | COMPLETED   | closeout.md (file ini)       |

---

## Hasil Riset

- **Pertanyaan Riset:** N total — M terjawab penuh, K terjawab sebagian, L belum terjawab
- **Sumber:** N total (Akademik: X, Web: Y, Sosial: Z, Berita: W, Pasar: V)
- **Skor Keyakinan:** X.XX / 1.0 (dari refleksi)
- **Iterasi:** N (0 = riset orisinal)

---

## Ringkasan Verdict

| # | Klaim                                      | Verdict      | Keyakinan | Resolusi                          |
|---|--------------------------------------------|--------------|-----------|-----------------------------------|
| 1 | [teks klaim dari validasi]                 | CONFIRMED    | X.XX      | —                                 |
| 2 | [teks klaim]                               | REFUTED      | X.XX      | [resolusi dari validasi]          |
| 3 | [teks klaim]                               | INCONCLUSIVE | X.XX      | [asumsi atau celah terdokumentasi]|

---

## Wawasan Kunci

1. [Temuan terpenting — satu kalimat, didukung bukti]
2. [Temuan kedua]
3. [Temuan ketiga]
4. [Temuan keempat]
5. [Temuan kelima]

---

## Celah Riset

- [Celah 1: deskripsi, prioritas, status]
- [Celah 2: deskripsi, prioritas, status]
- [Celah 3: deskripsi, prioritas, status]

---

## Artefak yang Dihasilkan

| File                        | Tipe         | Fase           |
|-----------------------------|--------------|----------------|
| pitch-exploration.md        | pitch        | PITCHING       |
| research-spec.md            | spec         | GRINDING       |
| advisor-counsel.md          | counsel      | ADVISING       |
| research-plan.md            | plan         | PLANNING       |
| research-report.md          | report       | SYNTHESIZING   |
| references.json             | references   | SYNTHESIZING   |
| validation-report.md        | validation   | VALIDATING     |
| reflection-report.md        | reflection   | REFLECTING     |
| closeout.md                 | closeout     | CLOSING        |

---

## Snapshot Memori

- **ResearchProject:** [nama entitas atau ID]
- **Artefak:** N entitas dibuat/diperbarui
- **Sesi:** N sesi tercatat
- **Wawasan:** N wawasan tersimpan
- **Celah:** N celah riset teridentifikasi

---

## Diarsipkan

**Tanggal:** YYYY-MM-DD
**Status:** COMPLETED
**Ditutup oleh:** cariak-closing v1.1

Semua artefak berada di: `docs/cariak/synthesized/YYYY-MM-DD-slug/`
```

---

### Fase 4: Serah Terima (Menu 3 Opsi)

Setelah ringkasan closeout ditulis, tampilkan kepada pengguna:

```
─────────────────────────────────────────────────
Closeout riset ditulis ke:
  docs/cariak/synthesized/YYYY-MM-DD-slug/closeout.md

Apa yang ingin Anda lakukan selanjutnya?
  1. Ekspor semua artefak (hasilkan PDF atau ZIP)
  2. Mulai riset baru pada topik terkait (pitch → close)
  3. Simpan dan keluar — riset telah diarsipkan
─────────────────────────────────────────────────
```

- **Opsi 1:** Memicu alat ekspor (PDF via skill `pdf` atau ZIP via shell).
- **Opsi 2:** Meminta pengguna untuk topik terkait dan memanggil `cariak-pitching`.
- **Opsi 3:** Mengakhiri sesi. Riset sepenuhnya diarsipkan.

---

### Status Output

| Status            | Arti                                                                           |
|-------------------|--------------------------------------------------------------------------------|
| `CLOSED`          | Semua gerbang lulus, memori diperbarui, closeout.md ditulis                     |
| `CLOSE_BLOCKED`   | Preflight gagal, gerbang verdict memblokir, atau sanggahan kritis belum selesai |
| `ALREADY_CLOSED`  | closeout.md sudah ada dan status ResearchProject adalah COMPLETED               |

---

### Hukum Besi

```
1. DILARANG MENUTUP DENGAN SANGGAHAN BELUM SELESAI
   Setiap klaim kritis REFUTED tanpa resolusi terdokumentasi → CLOSE_BLOCKED.
   MENGAPA: Menutup di atas sanggahan yang belum selesai mengarsipkan temuan
   yang diketahui salah sebagai fakta.

2. DILARANG MENUTUP TANPA REFLEKSI LULUS
   Jika reflection-report.md decision adalah RE-RESEARCH → CLOSE_BLOCKED.
   MENGAPA: Refleksi adalah gerbang kualitas. Melewatinya mengirimkan riset
   di bawah ambang batas.

3. DILARANG MENUTUP TANPA PEMBARUAN MEMORI
   Entitas ResearchProject HARUS bertransisi ke COMPLETED.
   Jika memory MCP mati, peringatkan tapi JANGAN blokir — artefak file
   adalah sumber kebenaran.
   MENGAPA: Entitas terbuka di graph membocorkan konteks ke sesi mendatang.

4. DILARANG MEMBLOKIR SECARA SENYAP
   Setiap CLOSE_BLOCKED menyatakan: apa yang memblokir, mengapa, dan apa
   yang akan membuka blokir.
   MENGAPA: "Tidak bisa menutup" tanpa alasan menciptakan deadlock.

5. DILARANG EVALUASI ULANG
   Penutupan membaca verdict dan keputusan refleksi — tidak pernah meninjau
   ulang klaim.
   MENGAPA: Mengevaluasi ulang saat penutupan menduplikasi validating/reflecting
   dan merusak jejak audit.
```

### Pemicu Referensi

| Referensi                          | Kapan Dimuat                              |
|------------------------------------|-------------------------------------------|
| `references/closeout-template.md`  | Fase 3: format ringkasan closeout         |
| alat memory MCP                    | Fase 2: perbarui entity graph             |
| skill `cariak-remembering`         | Fase 2: jika alat memori langsung tidak tersedia |

### Output

- `docs/cariak/synthesized/YYYY-MM-DD-slug/closeout.md`
- Entitas Memory MCP diperbarui (ResearchProject status → COMPLETED, artefak ditautkan, sesi penutupan dibuat)
