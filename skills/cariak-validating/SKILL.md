---
name: cariak-validating
description: Falsification-based verification of research findings. Use AFTER cariak-synthesizing when research-report.md exists. Extracts key claims, frames them as falsifiable questions, selects research methods (at least one must seek refutation), executes validation, and grades verdicts (Confirmed/Refuted/Inconclusive). Trigger on "validate", "verify findings", "check claims", "validasi", "verifikasi", or when cariak-synthesizing hands off.
---

# Validating / Memvalidasi

<!-- CARIAK SKILL: cariak-validating - v1.1 -->

## English

### Core Principle

> "A verdict without evidence is opinion. Evidence without refutation is cherry-picking."

Validation is the falsification phase. It does not seek to confirm what the synthesis already concluded—it seeks to break those conclusions. A claim that survives a genuine attempt to refute it is worth more than a claim that was only ever supported. This mirrors the structured-research methodology: every key claim becomes a falsifiable question, every question gets a research method, and at least one method must actively seek counter-evidence.

### Iron Laws

These laws are non-negotiable. Violating them invalidates the entire validation report.

**LAW 1: NO VERDICT WITHOUT EVIDENCE**

Every verdict (Confirmed, Refuted, Inconclusive) must be backed by cited evidence. A verdict that rests on "it seems right" or "I believe so" is forbidden. If you cannot cite a source for your verdict, the verdict defaults to Inconclusive.

**LAW 2: SEEK REFUTATION, NOT JUST CONFIRMATION**

For every key claim, at least one selected research method must actively seek to refute the claim. If all methods only seek confirming evidence, the validation is invalid and must be re-run with at least one refutation-seeking method.

**LAW 3: CITE SOURCES**

Every piece of evidence cited in the validation report must have a source. Sources must be traceable. URLs must be live (or archived). Paper references must include DOIs or arXiv IDs.

### When to Use

- `cariak-synthesizing` has produced `research-report.md` and handed off
- User says "validate", "verify findings", "check claims", "validasi", "verifikasi"
- The research report contains high-stakes claims that need independent verification
- User wants to stress-test the synthesis before delivery

### Do NOT Use

- No `research-report.md` exists (return to `cariak-synthesizing`)
- User wants to reflect on research quality (use `cariak-reflecting`)
- User wants a quick fact-check on a single claim (just use search tools directly)
- Research is still in progress (validation is post-synthesis)

### Boundary Table

| Adjacent Skill | Relationship | Boundary Rule |
|---|---|---|
| `cariak-synthesizing` | Upstream | Provides research-report.md for validation |
| `cariak-reflecting` | Downstream | Receives validation report to assess overall quality |
| `cariak-researching` | Sub-routine | Validation may invoke specific sub-agents to gather counter-evidence |
| `cariak-advising` | Orthogonal | Not typically called during validation |

### Hard Gates

**GATE 0: RESEARCH REPORT MUST EXIST**

Verify `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.md` exists and is non-empty. If missing → halt and invoke `cariak-synthesizing`.

**GATE 1: AT LEAST ONE REFUTATION-SEEKING METHOD PER CLAIM**

For each key claim extracted from the report, at least one selected research method must be designed to seek counter-evidence (refutation). If all methods only confirm, the validation for that claim is invalid.

**GATE 2: VERDICTS MUST BE GRADED, NOT BINARY**

Verdicts must be one of: Confirmed, Refuted, Inconclusive. Binary "true/false" verdicts are forbidden because research rarely produces certainty. Each verdict must include a confidence level (High/Medium/Low) and rationale.

**GATE 3: ALL EVIDENCE CITED**

Every piece of evidence in the validation report must have a citation. Uncited evidence is removed. If removing uncited evidence leaves a verdict unsupported, the verdict becomes Inconclusive.

### Phase 0: Preflight

**Goal:** Verify the research report exists and set up validation context.

1. Check Memory MCP for project context and prior validation attempts
2. Verify `research-report.md` exists at the expected path (GATE 0)
3. Load `references/research-methods.csv` to enumerate available methods
4. Create output path: `docs/cariak/synthesized/YYYY-MM-DD-slug/validation-report.md`
5. Log validation start to Memory MCP

**Gate 0 check:** Report exists? If no → halt.

### Phase 1: Extract Key Claims

**Goal:** Identify the claims that warrant validation.

From `research-report.md`:
1. Parse all findings (the "Finding:" lines under each RQ)
2. Parse all evidence citations
3. Extract claims that meet any of these criteria:
   - High-stakes (a decision depends on this claim)
   - Contested (the synthesis noted a contradiction)
   - Surprising (counterintuitive or novel)
   - Quantitative (specific numbers, statistics)
   - Causal (X causes Y)
4. For each extracted claim, record:
   - Claim text
   - Source RQ
   - Original citation(s) from the report
   - Claim type (factual, causal, quantitative, predictive, normative)

**Output:** Internal claim list (typically 5-15 claims for a standard report).

### Phase 2: Frame as Falsifiable Questions

**Goal:** Convert each claim into a question that can be tested.

For each claim, produce a falsifiable question:

| Claim Type | Falsifiable Question Pattern |
|---|---|
| Factual | "Is it true that [claim]? What evidence contradicts this?" |
| Causal | "Does [X] actually cause [Y]? What alternative causes exist?" |
| Quantitative | "Is the number [N] accurate? What other sources report different numbers?" |
| Predictive | "Has [prediction] come true? What evidence exists for/against?" |
| Normative | "Is [value judgment] widely shared? What dissenting views exist?" |

**Output:** List of falsifiable questions, one per claim.

### Phase 3: Select Research Method

**Goal:** Choose validation methods from `research-methods.csv`.

Load `references/research-methods.csv`. Available methods typically include:

| Method | Seeks | Good For |
|---|---|---|
| `source-verification` | Confirmation | Checking original sources cited |
| `counter-source-search` | Refutation | Finding sources that contradict |
| `expert-counsel` | Both | Independent expert opinion |
| `temporal-check` | Refutation | Checking if claim still holds over time |
| `methodology-audit` | Refutation | Examining how source evidence was gathered |
| `replication-check` | Confirmation | Attempting to reproduce the finding |
| `bias-check` | Refutation | Identifying source bias |
| `cross-reference` | Both | Checking against independent databases |

**Selection rules:**
- Select 2-4 methods per claim
- At least ONE method per claim must be refutation-seeking (GATE 1)
- Methods should be appropriate to claim type:
  - Quantitative claims → `source-verification` + `counter-source-search`
  - Causal claims → `methodology-audit` + `expert-counsel`
  - Predictive claims → `temporal-check` + `replication-check`

**Gate 1 check:** For each claim, verify at least one refutation-seeking method is selected.

### Phase 4: Execute Validation

**Goal:** Run the selected methods for each claim.

For each claim, execute the selected methods:

1. **source-verification:** Re-fetch the original cited source. Does it say what the report claims? Is the source reliable?
2. **counter-source-search:** Search for sources that contradict the claim. Use `search_web`, `search_arxiv`, `search_semantic` with negation queries ("X is false", "X does not cause Y", "X is overestimated").
3. **expert-counsel:** Invoke `cariak-advising` with the claim as a falsifiable question. Select 2-3 personas including at least one skeptic.
4. **temporal-check:** Check the publication date of cited sources. Has more recent evidence emerged?
5. **methodology-audit:** Examine the methodology of cited sources. Are there known flaws?
6. **replication-check:** Attempt to reproduce the finding independently.
7. **bias-check:** Identify potential biases in the cited sources.
8. **cross-reference:** Check the claim against independent databases (e.g., Snopes, FactCheck, academic databases).

**Execution note:** Methods may invoke research sub-agents (`cariak-researching` sub-agents) to gather evidence. This is expected.

### Phase 5: Grade Verdict

**Goal:** Assign a verdict to each claim based on collected evidence.

**Verdict definitions:**

| Verdict | Criteria | Confidence |
|---|---|---|
| **Confirmed** | Multiple independent sources support; refutation attempts failed to find credible counter-evidence | High/Medium |
| **Refuted** | Credible counter-evidence found; original sources retracted or contradicted | High/Medium |
| **Inconclusive** | Evidence is mixed, insufficient, or contradictory; cannot confirm or refute with confidence | Low |

**Confidence levels:**
- **High:** Multiple high-quality sources, no contradictions
- **Medium:** Some sources support, minor contradictions, sources are credible
- **Low:** Few sources, contradictions present, sources questionable

**Gate 2 check:** Every verdict is one of the three allowed values. No binary "true/false."

**Gate 3 check:** Every piece of evidence supporting the verdict has a citation.

### Phase 6: Write Validation Report

**Goal:** Produce the validation artifact.

Write to `docs/cariak/synthesized/YYYY-MM-DD-slug/validation-report.md`:

```markdown
# Validation Report: [Topic]
**Date:** YYYY-MM-DD
**Slug:** [slug]
**Source Report:** research-report.md
**Overall Verdict:** [X/N Confirmed, Y/N Refuted, Z/N Inconclusive]

## Iron Laws Compliance
- LAW 1 (No verdict without evidence): ✓ All verdicts cited
- LAW 2 (Seek refutation): ✓ ≥1 refutation method per claim
- LAW 3 (Cite sources): ✓ All evidence cited

## Validated Claims

### Claim 1: [claim text]
- **Source RQ:** RQ-1
- **Claim type:** [factual/causal/quantitative/...]
- **Falsifiable question:** [question]
- **Methods used:** [list, with refutation-seeking marked]
- **Evidence found:**
  - [Evidence 1] [citation]
  - [Evidence 2] [citation]
- **Refutation attempts:**
  - [Counter-evidence search] → [result]
- **Verdict:** Confirmed / Refuted / Inconclusive
- **Confidence:** High / Medium / Low
- **Rationale:** [why this verdict]

### Claim 2: [claim text]
...

## Summary Statistics
- Total claims validated: N
- Confirmed: X
- Refuted: Y
- Inconclusive: Z
- High confidence: A
- Medium confidence: B
- Low confidence: C

## Implications for Research Report
- [Which RQs are weakened by refuted claims?]
- [Which RQs are strengthened by confirmed claims?]
- [Which RQs remain uncertain?]
```

### Phase 7: Handoff

**Goal:** Present the validation report and hand off.

**Present to user:**
- Path to validation report
- Summary statistics (X confirmed, Y refuted, Z inconclusive)
- Iron Laws compliance check
- Implications for the research report

**3-option menu:**
```
1. Reflect on quality → invoke cariak-reflecting [RECOMMENDED]
2. Re-synthesize with validation findings → invoke cariak-synthesizing (loop)
3. Save and stop → validation report preserved
```

**Auto-invoke rule:** If no claims were refuted and ≥70% are Confirmed with High/Medium confidence, auto-invoke `cariak-reflecting` behind a confirmation prompt. If any claims were Refuted, recommend looping back to `cariak-synthesizing` to revise the report.

**Memory update:**
- Store `ResearchArtifact` (path=validation-report.md, type="validation")
- Store `ResearchDecision` for each verdict (decision, rationale, timestamp)
- Update `ResearchInsight` entities with validation results

### Reference Triggers

| Reference File | Phase | Purpose |
|---|---|---|
| `references/research-methods.csv` | Phase 3 | Method selection |
| `references/citation-standards.csv` | Phase 4, 6 | Citation format for evidence |
| `research-report.md` | Phase 1 | Source of claims to validate |
| `subagents/*.md` | Phase 4 | Sub-agents for evidence gathering |
| Memory MCP | Phase 0, 7 | Project context and decision storage |

### Failure Modes

- **No refutation method available for a claim type** → mark claim as Inconclusive with note "no refutation method applicable"
- **Counter-evidence search returns nothing** → this is not a failure; it supports a Confirmed verdict (with note "refutation attempted, no counter-evidence found")
- **Expert counsel unavailable** → skip that method, use other methods; note in report
- **Original source retracted** → verdict becomes Refuted with High confidence

---

## Bahasa Indonesia

---
name: cariak-validating
description: Verifikasi temuan riset berbasis falsifikasi. Gunakan SETELAH cariak-synthesizing ketika research-report.md ada. Ekstrak klaim kunci, bingkaiikan sebagai pertanyaan yang dapat difalsifikasi, pilih metode riset (minimal satu harus mencari sanggahan), eksekusi validasi, dan beri nilai putusan (Confirmed/Refuted/Inconclusive). Trigger pada "validate", "verify findings", "check claims", "validasi", "verifikasi", atau saat cariak-synthesizing menyerahkan.
---

### Prinsip Inti

> "Putusan tanpa bukti adalah opini. Bukti tanpa sanggahan adalah cherry-picking."

Validasi adalah fase falsifikasi. Ini tidak mencoba mengonfirmasi apa yang sudah disimpulkan sintesis—ini mencoba merusak kesimpulan tersebut. Klaim yang bertahan dari upaya penyangkalan asli bernilai lebih dari klaim yang hanya pernah didukung. Ini mencerminkan metodologi structured-research: setiap klaim kunci menjadi pertanyaan yang dapat difalsifikasi, setiap pertanyaan mendapat metode riset, dan setidaknya satu metode harus aktif mencari bukti tanding.

### Hukum Besi (Iron Laws)

Hukum ini non-negosiable. Melanggarnya membatalkan seluruh laporan validasi.

**HUKUM 1: TIDAK ADA PUTUSAN TANPA BUKTI**

Setiap putusan (Confirmed, Refuted, Inconclusive) harus didukung oleh bukti yang dikutip. Putusan yang berdasar "sepertinya benar" atau "saya percaya" dilarang. Jika tidak bisa menyitir sumber untuk putusan Anda, putusan default menjadi Inconclusive.

**HUKUM 2: CARI SANGGAHAN, BUKAN HANYA KONFIRMASI**

Untuk setiap klaim kunci, setidaknya satu metode riset yang dipilih harus aktif mencari penyangkal klaim. Jika semua metode hanya mencari bukti konfirmasi, validasi tidak valid dan harus dijalankan ulang dengan setidaknya satu metode pencarian-sanggahan.

**HUKUM 3: KUTIP SUMBER**

Setiap bukti yang dikutip dalam laporan validasi harus memiliki sumber. Sumber harus dapat ditelusuri. URL harus hidup (atau diarsipkan). Referensi paper harus menyertakan DOI atau ID arXiv.

### Kapan Digunakan

- `cariak-synthesizing` telah menghasilkan `research-report.md` dan menyerahkan
- Pengguna mengatakan "validate", "verify findings", "check claims", "validasi", "verifikasi"
- Laporan riset berisi klaim high-stakes yang perlu verifikasi independen
- Pengguna ingin stress-test sintesis sebelum pengiriman

### JANGAN Digunakan

- Tidak ada `research-report.md` (kembali ke `cariak-synthesizing`)
- Pengguna ingin merefleksi kualitas riset (gunakan `cariak-reflecting`)
- Pengguna ingin fact-check cepat pada satu klaim (cukup gunakan tool search langsung)
- Riset masih berlangsung (validasi adalah pasca-sintesis)

### Tabel Batasan

| Skill Terkait | Hubungan | Aturan Batasan |
|---|---|---|
| `cariak-synthesizing` | Hulu | Menyediakan research-report.md untuk validasi |
| `cariak-reflecting` | Hilir | Menerima laporan validasi untuk menilai kualitas keseluruhan |
| `cariak-researching` | Sub-rutin | Validasi dapat memanggil sub-agen spesifik untuk mengumpulkan bukti tanding |
| `cariak-advising` | Ortogonal | Biasanya tidak dipanggil selama validasi |

### Hard Gates

**GATE 0: LAPORAN RISET HARUS ADA**

Verifikasi `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.md` ada dan tidak kosong. Jika hilang → berhenti dan jalankan `cariak-synthesizing`.

**GATE 1: MINIMAL SATU METODE PENCARIAN-SANGGAHAN PER KLAIM**

Untuk setiap klaim kunci yang diekstrak dari laporan, setidaknya satu metode riset yang dipilih harus dirancang untuk mencari bukti tanding (sanggahan). Jika semua metode hanya mengonfirmasi, validasi untuk klaim itu tidak valid.

**GATE 2: PUTUSAN HARUS DINILAI, BUKAN BINER**

Putusan harus salah satu dari: Confirmed, Refuted, Inconclusive. Putusan biner "true/false" dilarang karena riset jarang menghasilkan kepastian. Setiap putusan harus menyertakan level kepercayaan (High/Medium/Low) dan rasional.

**GATE 3: SEMUA BUKTI DIKUTIP**

Setiap bukti dalam laporan validasi harus memiliki kutipan. Bukti tanpa kutipan dihapus. Jika menghapus bukti tanpa kutipan meninggalkan putusan tidak didukung, putusan menjadi Inconclusive.

### Fase 0: Preflight

**Tujuan:** Verifikasi laporan riset ada dan setup konteks validasi.

1. Cek Memory MCP untuk konteks proyek dan upaya validasi sebelumnya
2. Verifikasi `research-report.md` ada di path yang diharapkan (GATE 0)
3. Muat `references/research-methods.csv` untuk enumerasi metode yang tersedia
4. Buat path output: `docs/cariak/synthesized/YYYY-MM-DD-slug/validation-report.md`
5. Catat awal validasi ke Memory MCP

**Cek Gate 0:** Laporan ada? Jika tidak → berhenti.

### Fase 1: Ekstrak Klaim Kunci

**Tujuan:** Identifikasi klaim yang patut divalidasi.

Dari `research-report.md`: parse semua temuan, parse semua kutipan bukti, ekstrak klaim yang memenuhi kriteria: high-stakes, kontestasi, mengejutkan, kuantitatif, kausal. Untuk setiap klaim yang diekstrak, catat: teks klaim, RQ sumber, kutipan asli dari laporan, tipe klaim.

**Output:** Daftar klaim internal (biasanya 5-15 klaim untuk laporan standar).

### Fase 2: Bingkaikan sebagai Pertanyaan yang Dapat Difalsifikasi

**Tujuan:** Konversi setiap klaim menjadi pertanyaan yang dapat diuji.

Untuk setiap klaim, hasilkan pertanyaan yang dapat difalsifikasi berdasarkan tipe klaim (faktual, kausal, kuantitatif, prediktif, normatif).

**Output:** Daftar pertanyaan yang dapat difalsifikasi, satu per klaim.

### Fase 3: Pilih Metode Riset

**Tujuan:** Pilih metode validasi dari `research-methods.csv`.

Muat `references/research-methods.csv`. Metode yang tersedia: source-verification, counter-source-search, expert-counsel, temporal-check, methodology-audit, replication-check, bias-check, cross-reference.

**Aturan seleksi:** Pilih 2-4 metode per klaim, setidaknya SATU metode per klaim harus pencarian-sanggahan (GATE 1), metode harus sesuai dengan tipe klaim.

**Cek Gate 1:** Untuk setiap klaim, verifikasi setidaknya satu metode pencarian-sanggahan dipilih.

### Fase 4: Eksekusi Validasi

**Tujuan:** Jalankan metode yang dipilih untuk setiap klaim.

Untuk setiap klaim, eksekusi metode yang dipilih. Metode dapat memanggil sub-agen riset (`cariak-researching` sub-agents) untuk mengumpulkan bukti. Ini diharapkan.

### Fase 5: Nilai Putusan

**Tujuan:** Berikan putusan untuk setiap klaim berdasarkan bukti yang dikumpulkan.

**Definisi putusan:** Confirmed (multiple sumber independen mendukung, upaya sanggahan gagal menemukan bukti tanding kredibel), Refuted (bukti tanding kredibel ditemukan, sumber asli dicabut atau dikontradiksi), Inconclusive (bukti campuran, tidak cukup, atau kontradiktif).

**Level kepercayaan:** High (multiple sumber berkualitas, tanpa kontradiksi), Medium (beberapa sumber mendukung, kontradiksi minor, sumber kredibel), Low (sedikit sumber, kontradiksi ada, sumber dipertanyakan).

**Cek Gate 2:** Setiap putusan adalah salah satu dari tiga nilai yang diizinkan. Tidak ada "true/false" biner.

**Cek Gate 3:** Setiap bukti yang mendukung putusan memiliki kutipan.

### Fase 6: Tulis Laporan Validasi

**Tujuan:** Hasilkan artifact validasi.

Tulis ke `docs/cariak/synthesized/YYYY-MM-DD-slug/validation-report.md` dengan struktur: Iron Laws Compliance, Validated Claims (per klaim dengan Sumber RQ, Tipe Klaim, Pertanyaan Falsifiable, Metode, Bukti, Upaya Sanggahan, Putusan, Kepercayaan, Rasional), Summary Statistics, Implications for Research Report.

### Fase 7: Handoff

**Tujuan:** Sajikan laporan validasi dan serahkan.

**Sajikan ke pengguna:** Path ke laporan validasi, statistik ringkasan, cek Iron Laws compliance, implikasi untuk laporan riset.

**Menu 3 opsi:**
```
1. Refleksi kualitas → jalankan cariak-reflecting [RECOMMENDED]
2. Sintesis ulang dengan temuan validasi → jalankan cariak-synthesizing (loop)
3. Simpan dan berhenti → laporan validasi dipreservasi
```

**Aturan auto-invoke:** Jika tidak ada klaim yang disangkal dan ≥70% Confirmed dengan kepercayaan High/Medium, auto-invoke `cariak-reflecting` di balik prompt konfirmasi. Jika ada klaim yang Refuted, rekomendasikan loop kembali ke `cariak-synthesizing` untuk merevisi laporan.

**Update memory:** Simpan ResearchArtifact (path, type="validation"), ResearchDecision untuk setiap putusan, update ResearchInsight dengan hasil validasi.

### Reference Triggers

| File Referensi | Fase | Tujuan |
|---|---|---|
| `references/research-methods.csv` | Fase 3 | Pemilihan metode |
| `references/citation-standards.csv` | Fase 4, 6 | Format kutipan untuk bukti |
| `research-report.md` | Fase 1 | Sumber klaim untuk divalidasi |
| `subagents/*.md` | Fase 4 | Sub-agen untuk pengumpulan bukti |
| Memory MCP | Fase 0, 7 | Konteks proyek dan penyimpanan keputusan |

### Failure Modes

- **Tidak ada metode sanggahan untuk tipe klaim** → tandai klaim sebagai Inconclusive dengan catatan "no refutation method applicable"
- **Pencarian bukti tanding tidak mengembalikan apa pun** → ini bukan kegagalan; ini mendukung putusan Confirmed (dengan catatan "refutation attempted, no counter-evidence found")
- **Counsel ahli tidak tersedia** → lewati metode itu, gunakan metode lain; catat di laporan
- **Sumber asli dicabut** → putusan menjadi Refuted dengan kepercayaan High
