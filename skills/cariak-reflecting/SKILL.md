---
name: cariak-reflecting
description: Post-synthesis quality gate. Use AFTER cariak-synthesizing (and optionally after cariak-validating) to assess coverage gaps, confidence thresholds, and source diversity before delivery. Decides whether to PASS (proceed to document generation) or RE-RESEARCH (loop back to cariak-researching, max 2 iterations). Trigger on "reflect", "quality check", "evaluate research", "cek kualitas", "refleksi", or when synthesizing/validating hands off.
---

# CariaK Reflecting / Refleksi CariaK

<!-- CARIAK SKILL: cariak-reflecting - v1.1 -->

## English

### Core Principle

**"Reflection is the quality gate between research and delivery. It checks not just what was found, but what was missed."**

Reflection is not a summary. It is a critical self-assessment that asks: Did we answer the questions? Are we confident? Are the sources diverse enough? What did we miss? If the research does not meet quality thresholds, we loop back — not proceed to delivery.

---

### When to Use

- After cariak-synthesizing produces research-report.md
- After cariak-validating produces validation-report.md (optional, but recommended)
- When the user asks "is this research good enough?"
- When confidence feels low but you cannot articulate why
- Before any document generation or delivery to the user

### Do NOT Use When

- No research-report.md exists (use cariak-researching first)
- The user wants a quick summary, not a quality assessment
- You are still in the researching phase (reflect after, not during)
- The user explicitly says "just deliver what we have" (respect this — skip reflection)

---

### Boundary Table

| If the user wants to... | Use this skill |
|---|---|
| Synthesize findings into a report | cariak-synthesizing |
| Validate specific claims | cariak-validating |
| Check quality and coverage gaps | **cariak-reflecting** (this skill) |
| Save session state | cariak-remembering |
| Generate final documents | (document generation skill, downstream) |

---

### Hard Gates

#### GATE 0: RESEARCH-REPORT MUST EXIST

**REFLECTION REQUIRES ARTIFACTS.** Before beginning reflection, verify:
- `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.md` exists and is non-empty
- `docs/cariak/synthesized/YYYY-MM-DD-slug/references.json` exists and is valid JSON
- If validation was run: `validation-report.md` exists

If artifacts do not exist → ABORT. Tell user: "Reflection requires synthesized research. Run cariak-synthesizing first."

#### GATE 1: MAX 2 RE-RESEARCH LOOPS

**RE-RESEARCH IS NOT INFINITE.** Maximum 2 re-research iterations per project.
- Iteration 0: Original research
- Iteration 1: First re-research (triggered by reflection)
- Iteration 2: Second re-research (triggered by reflection)
- Iteration 3: **MANUAL GATE** — do NOT auto-trigger. Ask user.

Track iteration count in the reflection report. If count >= 2, set decision to MANUAL_REVIEW instead of RE-RESEARCH.

#### GATE 2: MANUAL GATE ON 3RD ITERATION

**HUMAN JUDGMENT REQUIRED.** If re-research iteration count reaches 3:
- DO NOT auto-invoke cariak-researching
- Present the situation to the user with: coverage gaps, confidence scores, source diversity
- Ask: "Research has been re-run 2 times. Quality thresholds are still not met. Options: (a) accept as-is, (b) one more iteration with refined questions, (c) abort."
- Wait for user decision

---

### Quality Thresholds

These thresholds determine PASS vs RE-RESEARCH:

| Metric | Threshold | If Below |
|---|---|---|
| Confidence Score | >= 0.7 | RE-RESEARCH |
| Source Count | >= 5 unique sources | RE-RESEARCH |
| Sub-agent Coverage | All 5 sub-agents returned findings | RE-RESEARCH (re-dispatch missing) |
| Contradiction Count | <= 3 unresolved contradictions | RE-RESEARCH |
| Question Coverage | >= 80% of research questions answered | RE-RESEARCH |

**If ANY threshold is below minimum → decision = RE-RESEARCH**

**If ALL thresholds are met → decision = PASS**

---

### Phase 0: Preflight

Before beginning reflection:

1. **Verify artifacts exist** (GATE 0)
2. **Check memory MCP** for project context:
   - Search for project entity: `memory_search_nodes(query="{project_name}")`
   - Retrieve session history
3. **Load research artifacts:**
   - Read `research-report.md`
   - Read `references.json`
   - Read `validation-report.md` if it exists
   - Read original `research-spec.md` and `research-plan.md` for comparison
4. **Determine re-research iteration count** from memory or file system (check for `-iter1`, `-iter2` suffixes)
5. **Initialize reflection checklist:**
   ```
   Project: [name]
   Iteration: [0/1/2/3]
   Artifacts loaded: [list]
   ```

**Output:** Preflight complete — ready to assess.

---

### Phase 1: Load Research Report + Validation

Load and parse the research artifacts:

1. **Parse research-report.md:**
   - Extract key claims and findings
   - Extract confidence score (if computed by synthesizing)
   - Extract source count
   - Extract contradiction mentions

2. **Parse validation-report.md (if exists):**
   - Extract verdicts: Confirmed / Refuted / Inconclusive
   - Count each category
   - Identify refuted claims (these are red flags)

3. **Parse references.json:**
   - Count unique sources
   - Check source diversity (by type: academic, news, social, market, internet)
   - Identify any sources with low credibility markers

4. **Parse original research-spec.md:**
   - Extract the list of research questions
   - These are the benchmark for coverage assessment

---

### Phase 2: Assess Coverage Gaps

Compare what was asked vs what was answered:

1. **Question-by-question audit:**
   For each research question from research-spec.md:
   - Was it addressed in the research report? (Y/N)
   - Was it answered with evidence? (Y/N)
   - Was it answered with sufficient depth? (Y/N/Partial)
   - Confidence level for this answer (0.0-1.0)

2. **Identify gaps:**
   - Questions not addressed at all
   - Questions addressed but without evidence
   - Questions with confidence < 0.5
   - Sub-topics that emerged during research but were not explored

3. **Source coverage map:**
   ```
   | Source Type | Sources Found | Coverage |
   |---|---|---|
   | Academic | [count] | [Good/Sparse/None] |
   | News | [count] | [Good/Sparse/None] |
   | Social | [count] | [Good/Sparse/None] |
   | Market | [count] | [Good/Sparse/None] |
   | Internet | [count] | [Good/Sparse/None] |
   ```

4. **Temporal coverage:**
   - What date range do the sources cover?
   - Are there recent developments (< 6 months) that were missed?
   - Are there historical precedents that were missed?

---

### Phase 3: Check Confidence Thresholds

1. **Overall confidence score** (from synthesizing or recomputed):
   - If >= 0.7: PASS this threshold
   - If < 0.7: FAIL this threshold

2. **Per-question confidence:**
   - Compute average confidence per question
   - Identify questions with confidence < 0.5 (high risk)

3. **Per-source-type confidence:**
   - Are findings overly reliant on one source type?
   - Example: if 90% of citations are from social media, confidence in academic rigor is low

4. **Validation verdict distribution:**
   - If validation was run:
     - Confirmed: [count] — good
     - Refuted: [count] — red flag, each refutation needs addressing
     - Inconclusive: [count] — moderate risk
   - If > 30% of claims are Inconclusive → FAIL this threshold

---

### Phase 4: Evaluate Source Diversity

1. **Source type distribution:**
   ```
   Academic: [X] sources ([X%])
   News: [X] sources ([X%])
   Social: [X] sources ([X%])
   Market: [X] sources ([X%])
   Internet: [X] sources ([X%])
   ```

2. **Diversity assessment:**
   - Is any source type > 60% of total? → Over-reliance risk
   - Is any source type 0? → Coverage gap
   - Are sources from diverse publishers/platforms? (not all from same blog)

3. **Geographic and linguistic diversity:**
   - Are all sources from one country/region?
   - Are all sources in one language?
   - Could relevant non-English sources exist?

4. **Temporal diversity:**
   - Are all sources from the same time period?
   - Is there a recency bias (only last 6 months)?
   - Is there a legacy bias (only old, established sources)?

---

### Phase 5: Decision — PASS or RE-RESEARCH

Based on all assessments:

#### PASS Conditions (ALL must be true):
- Confidence >= 0.7
- Source count >= 5
- All 5 sub-agents returned findings
- Unresolved contradictions <= 3
- Question coverage >= 80%
- No critical gaps identified

→ **Decision: PASS. Proceed to document generation or delivery.**

#### RE-RESEARCH Conditions (ANY one triggers):
- Confidence < 0.7
- Source count < 5
- Any sub-agent missing
- Unresolved contradictions > 3
- Question coverage < 80%
- Critical gaps identified

→ **Decision: RE-RESEARCH. Loop back to cariak-researching with refined questions.**

#### MANUAL_REVIEW Conditions:
- Re-research iteration count >= 2
- Thresholds still not met after 2 iterations

→ **Decision: MANUAL_REVIEW. Ask user.** (GATE 2)

---

### Phase 6: Write Reflection Report

Write to: `docs/cariak/synthesized/YYYY-MM-DD-slug/reflection-report.md`

**Template:**
```markdown
# Reflection Report: [Project Name]

**Date:** YYYY-MM-DD
**Iteration:** [0/1/2/3]
**Decision:** [PASS / RE-RESEARCH / MANUAL_REVIEW]

## Executive Summary

[1-2 paragraph summary of assessment]

## Quality Assessment

### Confidence Score
- Overall: [X.XX] (threshold: 0.7)
- Per-question average: [X.XX]
- Status: [PASS/FAIL]

### Source Count
- Total unique sources: [X] (threshold: 5)
- Source type distribution:
  - Academic: [X]
  - News: [X]
  - Social: [X]
  - Market: [X]
  - Internet: [X]
- Status: [PASS/FAIL]

### Question Coverage
- Questions addressed: [X/[total]]
- Coverage rate: [X%] (threshold: 80%)
- Questions not addressed:
  1. [question text]
  2. [question text]
- Status: [PASS/FAIL]

### Contradiction Resolution
- Unresolved contradictions: [X] (threshold: 3)
- Resolved contradictions: [X]
- Status: [PASS/FAIL]

### Validation Results (if applicable)
- Confirmed claims: [X]
- Refuted claims: [X]
- Inconclusive claims: [X]
- Status: [PASS/FAIL]

## Coverage Gaps

[List of identified gaps with priority: High/Medium/Low]

## Source Diversity Assessment

[Assessment of over-reliance, geographic bias, temporal bias]

## Recommendations

[If PASS: recommendations for document generation]
[If RE-RESEARCH: specific questions to re-run, sources to target, sub-agents to re-dispatch]

## Decision

**[PASS / RE-RESEARCH / MANUAL_REVIEW]**

[Reasoning for decision]
```

---

### Phase 7: Handoff

After writing the reflection report, present the decision to the user:

#### If PASS:
"The research has passed quality assessment. 
- Confidence: [X.XX]
- Sources: [X]
- Coverage: [X%]

Options:
1. **Proceed to document generation** — generate final deliverable
2. **Validate findings** — run cariak-validating for claim verification
3. **Save and stop** — archive research"

#### If RE-RESEARCH:
"The research did not pass quality assessment.
- Issue: [confidence/coverage/sources/contradictions]
- Iteration: [current] of max 2

Options:
1. **Re-research** — loop back to cariak-researching with refined questions (auto-invoke behind confirmation)
2. **Accept as-is** — proceed despite quality issues
3. **Save and stop** — archive for later"

#### If MANUAL_REVIEW (GATE 2):
"Research has been re-run [2] times. Quality thresholds are still not met.
- Remaining issues: [list]

This requires human judgment:
1. **Accept as-is** — proceed with current research
2. **One more iteration** — with manually refined questions
3. **Abort** — stop research"

---

### Reference Triggers

| Trigger | Location | Used in Phase |
|---|---|---|
| `quality-thresholds.yaml` | `/references/` | Phase 5 (Decision) |
| `reflection-template.md` | `/templates/` | Phase 6 (Write Report) |
| `coverage-matrix.csv` | `/references/` | Phase 2 (Coverage) |
| `research-spec.md` | `docs/cariak/spec/` | Phase 1 (Load) |
| `research-report.md` | `docs/cariak/synthesized/` | Phase 1 (Load) |
| `validation-report.md` | `docs/cariak/synthesized/` | Phase 1 (Load) |

---

### Output Path

```
docs/cariak/synthesized/YYYY-MM-DD-slug/
  ├── research-report.md       (from synthesizing)
  ├── references.json          (from synthesizing)
  ├── validation-report.md     (from validating, optional)
  └── reflection-report.md     ← THIS SKILL OUTPUT
```

---

## Bahasa Indonesia

---
name: cariak-reflecting
description: Gerbang kualitas pasca-sintesis. Gunakan SETELAH cariak-synthesizing (dan opsional setelah cariak-validating) untuk menilai celah cakupan, ambang batas kepercayaan, dan keragaman sumber sebelum pengiriman. Memutuskan apakah akan LULUS (lanjut ke pembuatan dokumen) atau RISET ULANG (kembali ke cariak-researching, maks 2 iterasi). Dipicu pada "reflect", "quality check", "evaluate research", "cek kualitas", "refleksi", atau ketika synthesizing/validating menyerahkan.
---

### Prinsip Inti

**"Refleksi adalah gerbang kualitas antara riset dan pengiriman. Ia memeriksa tidak hanya apa yang ditemukan, tetapi apa yang terlewat."**

Refleksi bukan ringkasan. Ini adalah penilaian diri kritis yang bertanya: Apakah kita menjawab pertanyaannya? Apakah kita yakin? Apakah sumber cukup beragam? Apa yang terlewat? Jika riset tidak memenuhi ambang batas, kita loop kembali — bukan lanjut ke pengiriman.

---

### Kapan Menggunakan

- Setelah cariak-synthesizing menghasilkan research-report.md
- Setelah cariak-validating menghasilkan validation-report.md (opsional, tapi disarankan)
- Saat pengguna bertanya "apakah riset ini cukup baik?"
- Saat kepercayaan terasa rendah tapi tidak bisa diartikulasikan mengapa
- Sebelum pembuatan dokumen atau pengiriman ke pengguna

### JANGAN Digunakan Saat

- research-report.md tidak ada (gunakan cariak-researching dulu)
- Pengguna ingin ringkasan cepat, bukan penilaian kualitas
- Masih dalam fase researching (refleksi setelah, bukan selama)
- Pengguna secara eksplisit bilang "kirim apa yang kita punya" (hormati ini — lewati refleksi)

---

### Tabel Batas

| Jika pengguna ingin... | Gunakan skill ini |
|---|---|
| Mensintesis temuan jadi laporan | cariak-synthesizing |
| Memvalidasi klaim spesifik | cariak-validating |
| Cek kualitas dan celah cakupan | **cariak-reflecting** (skill ini) |
| Simpan state sesi | cariak-remembering |
| Buat dokumen final | (skill pembuatan dokumen, hilir) |

---

### Hard Gates

#### GATE 0: RESEARCH-REPORT HARUS ADA

**REFLEKSI MEMBUTUHKAN ARTIFAK.** Sebelum mulai refleksi, verifikasi:
- `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.md` ada dan tidak kosong
- `docs/cariak/synthesized/YYYY-MM-DD-slug/references.json` ada dan JSON valid
- Jika validasi dijalankan: `validation-report.md` ada

Jika artifact tidak ada → BATAL. Beritahu pengguna: "Refleksi membutuhkan riset tersintesis. Jalankan cariak-synthesizing dulu."

#### GATE 1: MAKS 2 LOOP RISET ULANG

**RISET ULANG TIDAK TANPA BATAS.** Maksimal 2 iterasi riset ulang per proyek.
- Iterasi 0: Riset asli
- Iterasi 1: Riset ulang pertama (dipicu refleksi)
- Iterasi 2: Riset ulang kedua (dipicu refleksi)
- Iterasi 3: **GATE MANUAL** — jangan auto-pemicu. Tanya pengguna.

Lacak hitungan iterasi di laporan refleksi. Jika hitungan >= 2, set keputusan ke MANUAL_REVIEW bukan RE-RESEARCH.

#### GATE 2: GATE MANUAL PADA ITERASI KE-3

**KEPUTUSAN MANUSIA DIBUTUHKAN.** Jika hitungan iterasi riset ulang mencapai 3:
- JANGAN auto-invoke cariak-researching
- Sajikan situasi ke pengguna: celah cakupan, skor kepercayaan, keragaman sumber
- Tanya: "Riset sudah diulang 2 kali. Ambang batas kualitas masih belum terpenuhi. Pilihan: (a) terima apa adanya, (b) satu iterasi lagi dengan pertanyaan yang disempurnakan, (c) batal."
- Tunggu keputusan pengguna

---

### Ambang Batas Kualitas

Ambang batas ini menentukan LULUS vs RISET ULANG:

| Metrik | Ambang Batas | Jika Di Bawah |
|---|---|---|
| Skor Kepercayaan | >= 0.7 | RISET ULANG |
| Jumlah Sumber | >= 5 sumber unik | RISET ULANG |
| Cakupan Sub-agent | Semua 5 sub-agent mengembalikan temuan | RISET ULANG (redispatch yang hilang) |
| Jumlah Kontradiksi | <= 3 kontradiksi tidak terselesaikan | RISET ULANG |
| Cakupan Pertanyaan | >= 80% pertanyaan riset terjawab | RISET ULANG |

**Jika ADA ambang batas di bawah minimum → keputusan = RISET ULANG**

**Jika SEMUA ambang batas terpenuhi → keputusan = LULUS**

---

### Phase 0: Preflight

Sebelum mulai refleksi:

1. **Verifikasi artifact ada** (GATE 0)
2. **Cek memory MCP** untuk konteks proyek:
   - Cari entitas proyek: `memory_search_nodes(query="{project_name}")`
   - Ambil riwayat sesi
3. **Muat artifact riset:**
   - Baca `research-report.md`
   - Baca `references.json`
   - Baca `validation-report.md` jika ada
   - Baca `research-spec.md` dan `research-plan.md` asli untuk perbandingan
4. **Tentukan hitungan iterasi riset ulang** dari memory atau sistem file (cek suffix `-iter1`, `-iter2`)
5. **Inisialisasi checklist refleksi:**
   ```
   Proyek: [nama]
   Iterasi: [0/1/2/3]
   Artifact dimuat: [daftar]
   ```

**Output:** Preflight selesai — siap menilai.

---

### Phase 1: Muat Laporan Riset + Validasi

Muat dan parse artifact riset:

1. **Parse research-report.md:**
   - Ekstrak klaim dan temuan kunci
   - Ekstrak skor kepercayaan (jika dihitung oleh synthesizing)
   - Ekstrak jumlah sumber
   - Ekstrak penyebutan kontradiksi

2. **Parse validation-report.md (jika ada):**
   - Ekstrak vonis: Dikonfirmasi / Dibantah / Tidak meyakinkan
   - Hitung setiap kategori
   - Identifikasi klaim yang dibantah (ini adalah red flag)

3. **Parse references.json:**
   - Hitung sumber unik
   - Cek keragaman sumber (berdasarkan tipe: akademik, berita, sosial, pasar, internet)
   - Identifikasi sumber dengan penanda kredibilitas rendah

4. **Parse research-spec.md asli:**
   - Ekstrak daftar pertanyaan riset
   - Ini adalah tolok ukur untuk penilaian cakupan

---

### Phase 2: Nilai Celah Cakupan

Bandingkan apa yang ditanya vs apa yang dijawab:

1. **Audit per pertanyaan:**
   Untuk setiap pertanyaan riset dari research-spec.md:
   - Apakah diaddress di laporan riset? (Y/N)
   - Apakah dijawab dengan bukti? (Y/N)
   - Apakah dijawab dengan kedalaman cukup? (Y/N/Sebagian)
   - Tingkat kepercayaan untuk jawaban ini (0.0-1.0)

2. **Identifikasi celah:**
   - Pertanyaan tidak diaddress sama sekali
   - Pertanyaan diaddress tapi tanpa bukti
   - Pertanyaan dengan kepercayaan < 0.5
   - Sub-topik yang muncul selama riset tapi tidak dieksplorasi

3. **Peta cakupan sumber:**
   ```
   | Tipe Sumber | Sumber Ditemukan | Cakupan |
   |---|---|---|
   | Akademik | [jumlah] | [Baik/Tipis/Tidak Ada] |
   | Berita | [jumlah] | [Baik/Tipis/Tidak Ada] |
   | Sosial | [jumlah] | [Baik/Tipis/Tidak Ada] |
   | Pasar | [jumlah] | [Baik/Tipis/Tidak Ada] |
   | Internet | [jumlah] | [Baik/Tipis/Tidak Ada] |
   ```

4. **Cakupan temporal:**
   - Rentang tanggal apa yang dicakup sumber?
   - Apakah ada perkembangan terkini (< 6 bulan) yang terlewat?
   - Apakah ada preseden historis yang terlewat?

---

### Phase 3: Cek Ambang Batas Kepercayaan

1. **Skor kepercayaan keseluruhan** (dari synthesizing atau dihitung ulang):
   - Jika >= 0.7: LULUS ambang batas ini
   - Jika < 0.7: GAGAL ambang batas ini

2. **Kepercayaan per pertanyaan:**
   - Hitung rata-rata kepercayaan per pertanyaan
   - Identifikasi pertanyaan dengan kepercayaan < 0.5 (risiko tinggi)

3. **Kepercayaan per tipe sumber:**
   - Apakah temuan terlalu bergantung pada satu tipe sumber?
   - Contoh: jika 90% sitasi dari media sosial, kepercayaan rigor akademik rendah

4. **Distribusi vonis validasi:**
   - Jika validasi dijalankan:
     - Dikonfirmasi: [jumlah] — baik
     - Dibantah: [jumlah] — red flag, setiap pembantahan perlu diaddress
     - Tidak meyakinkan: [jumlah] — risiko moderat
   - Jika > 30% klaim Tidak meyakinkan → GAGAL ambang batas ini

---

### Phase 4: Evaluasi Keragaman Sumber

1. **Distribusi tipe sumber:**
   ```
   Akademik: [X] sumber ([X%])
   Berita: [X] sumber ([X%])
   Sosial: [X] sumber ([X%])
   Pasar: [X] sumber ([X%])
   Internet: [X] sumber ([X%])
   ```

2. **Penilaian keragaman:**
   - Apakah ada tipe sumber > 60% dari total? → Risiko terlalu bergantung
   - Apakah ada tipe sumber 0? → Celah cakupan
   - Apakah sumber dari penerbit/platform beragam? (tidak semua dari blog yang sama)

3. **Keragaman geografis dan linguistik:**
   - Apakah semua sumber dari satu negara/wilayah?
   - Apakah semua sumber dalam satu bahasa?
   - Bisakah sumber non-Inggris yang relevan ada?

4. **Keragaman temporal:**
   - Apakah semua sumber dari periode waktu yang sama?
   - Apakah ada bias keterkini (hanya 6 bulan terakhir)?
   - Apakah ada bias warisan (hanya sumber lama)?

---

### Phase 5: Keputusan — LULUS atau RISET ULANG

Berdasarkan semua penilaian:

#### Kondisi LULUS (SEMUA harus benar):
- Kepercayaan >= 0.7
- Jumlah sumber >= 5
- Semua 5 sub-agent mengembalikan temuan
- Kontradiksi tidak terselesaikan <= 3
- Cakupan pertanyaan >= 80%
- Tidak ada celah kritis teridentifikasi

→ **Keputusan: LULUS. Lanjut ke pembuatan dokumen atau pengiriman.**

#### Kondisi RISET ULANG (salah SATU memicu):
- Kepercayaan < 0.7
- Jumlah sumber < 5
- Ada sub-agent yang hilang
- Kontradiksi tidak terselesaikan > 3
- Cakupan pertanyaan < 80%
- Celah kritis teridentifikasi

→ **Keputusan: RISET ULANG. Kembali ke cariak-researching dengan pertanyaan disempurnakan.**

#### Kondisi MANUAL_REVIEW:
- Hitungan iterasi riset ulang >= 2
- Ambang batas masih belum terpenuhi setelah 2 iterasi

→ **Keputusan: MANUAL_REVIEW. Tanya pengguna.** (GATE 2)

---

### Phase 6: Tulis Laporan Refleksi

Tulis ke: `docs/cariak/synthesized/YYYY-MM-DD-slug/reflection-report.md`

**Template:**
```markdown
# Laporan Refleksi: [Nama Proyek]

**Tanggal:** YYYY-MM-DD
**Iterasi:** [0/1/2/3]
**Keputusan:** [LULUS / RISET ULANG / MANUAL_REVIEW]

## Ringkasan Eksekutif

[1-2 paragraf ringkasan penilaian]

## Penilaian Kualitas

### Skor Kepercayaan
- Keseluruhan: [X.XX] (ambang: 0.7)
- Rata-rata per pertanyaan: [X.XX]
- Status: [LULUS/GAGAL]

### Jumlah Sumber
- Total sumber unik: [X] (ambang: 5)
- Distribusi tipe sumber:
  - Akademik: [X]
  - Berita: [X]
  - Sosial: [X]
  - Pasar: [X]
  - Internet: [X]
- Status: [LULUS/GAGAL]

### Cakupan Pertanyaan
- Pertanyaan diaddress: [X/[total]]
- Tingkat cakupan: [X%] (ambang: 80%)
- Pertanyaan tidak diaddress:
  1. [teks pertanyaan]
  2. [teks pertanyaan]
- Status: [LULUS/GAGAL]

### Resolusi Kontradiksi
- Kontradiksi tidak terselesaikan: [X] (ambang: 3)
- Kontradiksi terselesaikan: [X]
- Status: [LULUS/GAGAL]

### Hasil Validasi (jika ada)
- Klaim dikonfirmasi: [X]
- Klaim dibantah: [X]
- Klaim tidak meyakinkan: [X]
- Status: [LULUS/GAGAL]

## Celah Cakupan

[Daftar celah teridentifikasi dengan prioritas: Tinggi/Sedang/Rendah]

## Penilaian Keragaman Sumber

[Penilaian ketergantungan berlebih, bias geografis, bias temporal]

## Rekomendasi

[Jika LULUS: rekomendasi untuk pembuatan dokumen]
[Jika RISET ULANG: pertanyaan spesifik untuk diulang, sumber untuk ditargetkan, sub-agent untuk redispatch]

## Keputusan

**[LULUS / RISET ULANG / MANUAL_REVIEW]**

[Penalaran untuk keputusan]
```

---

### Phase 7: Handoff

Setelah menulis laporan refleksi, sajikan keputusan ke pengguna:

#### Jika LULUS:
"Riset telah lulus penilaian kualitas.
- Kepercayaan: [X.XX]
- Sumber: [X]
- Cakupan: [X%]

Pilihan:
1. **Lanjut ke pembuatan dokumen** — hasilkan deliverable final
2. **Validasi temuan** — jalankan cariak-validating untuk verifikasi klaim
3. **Simpan dan berhenti** — arsipkan riset"

#### Jika RISET ULANG:
"Riset tidak lulus penilaian kualitas.
- Masalah: [kepercayaan/cakupan/sumber/kontradiksi]
- Iterasi: [saat ini] dari maks 2

Pilihan:
1. **Riset ulang** — kembali ke cariak-researching dengan pertanyaan disempurnakan (auto-invoke di balik konfirmasi)
2. **Terima apa adanya** — lanjut meski ada masalah kualitas
3. **Simpan dan berhenti** — arsipkan untuk nanti"

#### Jika MANUAL_REVIEW (GATE 2):
"Riset sudah diulang [2] kali. Ambang batas kualitas masih belum terpenuhi.
- Masalah tersisa: [daftar]

Ini membutuhkan keputusan manusia:
1. **Terima apa adanya** — lanjut dengan riset saat ini
2. **Satu iterasi lagi** — dengan pertanyaan yang disempurnakan manual
3. **Batal** — hentikan riset"

---

### Reference Triggers

| Trigger | Lokasi | Digunakan di Phase |
|---|---|---|
| `quality-thresholds.yaml` | `/references/` | Phase 5 (Keputusan) |
| `reflection-template.md` | `/templates/` | Phase 6 (Tulis Laporan) |
| `coverage-matrix.csv` | `/references/` | Phase 2 (Cakupan) |
| `research-spec.md` | `docs/cariak/spec/` | Phase 1 (Muat) |
| `research-report.md` | `docs/cariak/synthesized/` | Phase 1 (Muat) |
| `validation-report.md` | `docs/cariak/synthesized/` | Phase 1 (Muat) |

---

### Output Path

```
docs/cariak/synthesized/YYYY-MM-DD-slug/
  ├── research-report.md       (dari synthesizing)
  ├── references.json          (dari synthesizing)
  ├── validation-report.md     (dari validating, opsional)
  └── reflection-report.md     ← OUTPUT SKILL INI
```
