---
name: cariak-synthesizing
description: Resolve multiple research findings into a coherent, cited, confidence-graded report. Use AFTER cariak-researching when 5 sub-agent findings files exist. Cross-references sources, deduplicates, resolves contradictions, generates research-report.docx (primary DOCX output) + research-report.md (plain text fallback) + references.json, and computes a confidence score. Trigger on "synthesize", "compile research", "merge findings", "sintesis", "gabungkan temuan", or when cariak-researching hands off with 5 findings files.
---

# Synthesizing / Mensintesis

<!-- CARIAK SKILL: cariak-synthesizing - v1.1 -->

## English

### Core Principle

> **"Synthesis is not summary. It is the resolution of multiple perspectives into a coherent, cited, confidence-graded whole."**

A summary lists what each sub-agent found. A synthesis resolves those findings—reconciling contradictions, deduplicating overlapping sources, filling gaps, and grading confidence—into a single coherent narrative that a reader can trust. If two sub-agents contradict each other, the synthesis must say so explicitly, present both sides, and explain why. Hiding contradictions behind a bland "on the other hand" is forbidden.

### Structural Method

This phase uses real academic methods:
- **Thematic Synthesis** (Thomas & Harden, 2008, BMC Medical Research Methodology) — line-by-line coding of findings → descriptive themes → analytical themes → map to RQs.
- **Framework Synthesis** (Carroll et al., 2013, BMC Medical Research Methodology) — index findings against an a-priori framework, refine with new data.
- Output structures derived from **Technology Assessment** (US GAO, 2021) and **Feasibility Study methodology** (USACE, 2023).


### When to Use

- `cariak-researching` has produced 5 findings files and handed off
- User says "synthesize", "compile research", "merge findings", "sintesis"
- Re-research loop completed and a new synthesis is needed
- User wants the final report generated from existing findings

### Do NOT Use

- Fewer than 5 findings files exist (return to `cariak-researching`)
- The research spec doesn't exist (synthesis needs the spec to map findings to questions)
- User wants to validate findings (use `cariak-validating` after synthesis)
- User wants a quick summary, not a full report (just ask for a brief)

### Boundary Table

| Adjacent Skill | Relationship | Boundary Rule |
|---|---|---|
| `cariak-researching` | Upstream | Provides 5 findings files; synthesizing does not re-run research |
| `cariak-validating` | Downstream | Consumes research-report.md to extract key claims for refutation |
| `cariak-reflecting` | Downstream (alt) | May receive synthesis if validation is skipped |
| `cariak-planning` | Feedback loop | May trigger re-planning if synthesis reveals gap |
| `cariak-advising` | Orthogonal | Not typically called during synthesis |

### Hard Gates

**GATE 0: ALL 5 FINDINGS MUST EXIST**

Before any synthesis work begins, verify:
```
docs/cariak/research/YYYY-MM-DD-slug/
  ├── internet-findings.md     ✓
  ├── social-findings.md       ✓
  ├── academic-findings.md     ✓
  ├── news-findings.md         ✓
  └── market-findings.md       ✓
```

If ANY file is missing → STOP. Do not synthesize with partial data. Report the missing file and invoke `cariak-researching` to re-run the failed sub-agent.

**GATE 1: NO CLAIM WITHOUT SOURCE**

Every assertion in `research-report.md` MUST have an inline citation `[N]` that maps to an entry in `references.json`. Uncited claims are FORBIDDEN. If a claim cannot be sourced, it must be marked as `[UNSOURCED]` and flagged for the user.

**GATE 2: CONTRADICTIONS MUST BE EXPLICITLY RESOLVED**

When two findings contradict each other:
1. Both perspectives must be presented with citations
2. The contradiction must be named explicitly ("Source A claims X; Source B claims Y")
3. The synthesis must explain the contradiction (different methodologies, different timeframes, different definitions)
4. If resolution is impossible, the report must say "unresolved contradiction" and lower the confidence score

Averaging or hiding contradictions is FORBIDDEN.

**GATE 2.5: ADVISOR CONTRADICTION CHALLENGE MANDATORY — ANTITHESIS BEFORE REPORT**

The Contradiction Hunter + Devil's Advocate advisor challenge (Phase 3.5) is not optional. Before writing the final research report:
1. The cross-referenced claim registry (thesis) must be challenged by an independent advisor (antithesis).
2. The advisor must hunt for missed contradictions, cherry-picking, and forced narratives.
3. Any newly found contradictions must be resolved (loop back to Phase 3) before proceeding.
4. Do not skip the antithesis step. The synthesis engine's own contradiction detection has blind spots — the independent advisor catches what was missed.

### Phase 0: Preflight

**Goal:** Verify all inputs exist before synthesis.

1. Check Memory MCP for project context and research plan
2. Verify all 5 findings files exist (GATE 0)
3. Load `research-spec.md` to recover research questions
4. Load `references/citation-standards.csv` for citation format
6. Create output directory: `docs/cariak/synthesized/YYYY-MM-DD-slug/`
7. Log synthesis start to Memory MCP

**Gate 0 check:** All 5 files present? If no → halt.

### Phase 1: Load 5 Findings

**Goal:** Parse all findings into a unified internal representation.

For each findings file:
1. Parse the markdown structure (headings, claims, citations)
2. Extract all claims with their citations
3. Build an internal claim registry:
   ```
   claim_id | source_subagent | claim_text | citation_id | source_url | confidence_note
   ```
4. Extract all unique sources into a preliminary bibliography

After loading all 5 files, you should have:
- N total claims
- M unique sources (after dedup)

### Phase 2: Cross-reference & Deduplicate

**Goal:** Identify overlapping sources and redundant claims.

**Source deduplication:**
1. Group sources by URL (canonical form)
2. For sources with same title but different URLs, flag as "possibly same source"
3. Merge duplicate source entries

**Claim deduplication:**
1. Group claims by semantic similarity (same assertion, different phrasing)
2. For each group, merge into a single claim with multiple supporting citations
3. Track which sub-agents contributed to each merged claim

**Cross-referencing:**
1. For each research question (from spec), collect all claims that address it
2. Tag each claim with the RQ it answers
3. Identify claims that don't map to any RQ (flag as "off-topic")

**Output:** Internal deduplicated claim registry.

### Phase 3: Resolve Contradictions

**Goal:** Identify and resolve conflicting findings.

**Contradiction detection:**
1. For each RQ, examine all claims that address it
2. Identify pairs/groups of claims that assert opposite conclusions
3. For each contradiction, classify:
   - **Factual contradiction:** Source A says X is true; Source B says X is false
   - **Methodological contradiction:** Different methodologies yield different results
   - **Temporal contradiction:** Sources from different time periods disagree
   - **Definitional contradiction:** Sources use different definitions of the same term

**Resolution protocol:**
For each contradiction:
1. Present both sides with full citations
2. Analyze why they contradict (methodology, timing, definition, bias)
3. If one side has stronger evidence (more sources, higher quality, more recent), note the lean
4. If unresolvable, mark as "unresolved" and reduce confidence for that RQ

**Gate 2 enforcement:** Every contradiction must appear in the report with both perspectives.

### Phase 3.5: Advisor Contradiction Challenge (ANTITHESIS)

**Goal:** Dispatch a Contradiction Hunter + Devil's Advocate advisor to independently challenge the cross-source merge BEFORE writing the final report.

This is the THESIS → ANTITHESIS step. The cross-referenced, deduplicated claim registry is the thesis. Now an independent advisor must hunt for contradictions that the synthesis may have missed or suppressed.

1. **Dispatch a Contradiction Hunter + Devil's Advocate advisor sub-agent** (via `cariak-advising`):
   - The advisor is a **different model/persona**, not self-critique.
   - The advisor's job: find contradictions, cherry-picking, forced narratives in the cross-source merge.
   - The advisor MUST cite specific sources for every contradiction they claim.
2. **Advisor challenge questions:**
   - "Where do sources disagree? What contradictions did the cross-reference phase miss?"
   - "What evidence is being cherry-picked? What sources that don't fit the narrative were excluded?"
   - "What narrative is being forced by the synthesis? What alternative interpretations exist?"
   - "Which RQs have the weakest evidence base? Where is the confidence over-estimated?"
3. **Advisor returns:**
   - List of specific contradictions that need explicit resolution (with source citations).
   - Evidence of cherry-picking or narrative-forcing.
   - RQs with weak evidence where confidence should be lowered.
   - Recommendations: what to re-examine before writing the final report.

**Gate 2.5 check:** Advisor contradiction challenge executed BEFORE writing the final research report? If no → halt and run the challenge. The advisor output feeds back into Phase 3 (resolve any newly found contradictions) before proceeding to Phase 4.

**Output:** Advisor contradiction report — unresolved contradictions, cherry-picking flags, weak-evidence RQs.

### Phase 4: Generate research-report.docx (primary) + research-report.md (fallback)

**Goal:** Write the synthesized research report in professional DOCX format, with a plain-text markdown fallback.

**DOCX generation uses the `npx cariak-pi report` CLI command internally, which drives the `docx` npm package (v9.7.1).**

**Primary output format: DOCX** (McKinsey/BCG-grade professional report with cover page, headers, footers, styled tables, and inline citations).

**Fallback output format: Markdown** — same structure for plain-text consumers.

**Structure (applies to both formats):**
```markdown
# Research Report: [Topic]
**Date:** YYYY-MM-DD
**Slug:** [slug]
**Status:** Synthesized
**Confidence Score:** [computed in Phase 7]

## Executive Summary
[2-3 paragraph overview of key findings]

## Problem Framing
[What decision this research supports, what is in/out of scope, and what success means]

## Research Questions Answered

### RQ-1: [Question]
**Finding:** [synthesized answer]
**Evidence:**
- [Claim 1] [1]
- [Claim 2] [2, 3]
- [Claim 3] [4]
**Contradictions:** [if any, with both sides]
**Confidence:** [0.0-1.0] — [rationale]

### RQ-2: [Question]
...

## Expert Technical Deep Dive (mandatory for technical topics)

### First-Principles Explanation
[Physical, mathematical, system, or operational mechanism behind the solution]

### State of the Art
[Methods used in academic literature, mature products, and production engineering]

### Methods Used in the Field
[What industry/operators actually use, including non-AI or hybrid methods]

### Method Comparison Matrix
| Method | Accuracy potential | Data need | Cost | Latency | Complexity | Field risk | Best use |
|---|---:|---:|---:|---:|---:|---|---|

### Recommended Architecture
[Components, data flow, deployment target, integration points, calibration/monitoring]

### Implementation Roadmap
| Phase | Goal | Build | Validation | Exit criteria |
|---|---|---|---|---|

### Data Strategy
[Datasets, labels, sampling, calibration, quality checks, governance]

### Evaluation Protocol
[Metrics, baseline, acceptance thresholds, experiment design]

### Failure Modes & Mitigations
| Failure mode | Cause | Impact | Detection | Mitigation |
|---|---|---|---|---|

### Alternatives and Build-vs-Buy Options
[Simpler methods, commercial options, open-source options, hybrid/fallback approach]

### Gaps / Unknowns / Required Experiments
[What remains unproven and what prototype or field test is needed]

### Final Technical Recommendation
[Recommended path, what to avoid, when to revisit]

## Contradictions & Resolutions
[All contradictions explicitly addressed]

## Source Diversity
- Internet sources: [N]
- Social sources: [N]
- Academic sources: [N]
- News sources: [N]
- Market sources: [N]
- Total unique sources: [N]

## Gaps Identified
[Claims that couldn't be sourced, RQs with thin evidence]

## References
[Numbered bibliography — also written to references.json]
```

Write DOCX to: `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.docx`
Write MD fallback to: `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.md`

### Phase 5: Generate references.json

**Goal:** Machine-readable citation database.

```json
{
  "project_slug": "YYYY-MM-DD-slug",
  "generated_at": "ISO-8601 timestamp",
  "citation_standard": "inline-numbered",
  "sources": [
    {
      "id": 1,
      "type": "web|academic|social|news|market",
      "title": "...",
      "authors": ["..."],
      "url": "...",
      "published_date": "YYYY-MM-DD",
      "accessed_date": "YYYY-MM-DD",
      "subagents_citing": ["internet", "academic"],
      "reliability_tier": 1
    }
  ],
  "total_sources": N
}
```

Write to: `docs/cariak/synthesized/YYYY-MM-DD-slug/references.json`

### Phase 6: Compute Confidence Score

**Goal:** Quantify the reliability of the synthesis.

**Confidence formula:**
```
confidence = (
  (source_diversity_score * 0.25) +
  (source_count_score * 0.20) +
  (contradiction_penalty * 0.20) +
  (citation_coverage_score * 0.20) +
  (recency_score * 0.15)
)
```

**Sub-scores:**
- **Source diversity (0-1):** (number of distinct source types / 5)
- **Source count (0-1):** min(total_sources / 20, 1.0)
- **Contradiction penalty (0-1):** max(1 - (unresolved_contradictions / 5), 0)
- **Citation coverage (0-1):** (cited_claims / total_claims)
- **Recency (0-1):** (sources from last 12 months / total_sources)

**Per-RQ confidence:**
Each RQ gets its own confidence score based on:
- Number of sources addressing it (min 3 for confidence > 0.5)
- Whether contradictions were resolved
- Source diversity for that specific question

**Output:** Confidence score added to research-report.md header.

### Phase 7: Handoff

**Goal:** Present the synthesis and hand off.

**Present to user:**
- Path to `research-report.docx` (primary), `research-report.md` (fallback), and `references.json`
- Confidence score (overall + per-RQ)
- Number of contradictions (resolved / unresolved)
- Gaps identified

**3-option menu:**
```
1. Validate findings → invoke cariak-validating [RECOMMENDED]
2. Reflect on quality → invoke cariak-reflecting (skips validation)
3. Save and stop → report preserved, resume later
```

**Auto-invoke rule:** If confidence ≥ 0.7 and no unresolved contradictions, auto-invoke `cariak-validating` behind a confirmation prompt. If confidence < 0.7, recommend `cariak-reflecting` to trigger re-research.

**Memory update:**
- Store `ResearchArtifact` (path=research-report.docx, type="report", confidence, sources_count)
- Store `ResearchInsight` for each key finding
- Store `ResearchGap` for each unresolved gap

### Reference Triggers

| Reference File | Phase | Purpose |
|---|---|---|
| `references/citation-standards.csv` | Phase 4, 5 | Citation format per source type |
| `references/synthesis-template.md` | Phase 2, 3 | Structure for synthesized findings |
| `research-spec.md` | Phase 0, 1 | Recover RQs to map findings |
| 5 findings files | Phase 1 | Source claims and citations |
| Memory MCP | Phase 0, 7 | Project context and artifact storage |

---

## Bahasa Indonesia

---
name: cariak-synthesizing
description: Menyelesaikan beberapa temuan riset menjadi laporan yang koheren, dikutip, dan diberi nilai kepercayaan. Gunakan SETELAH cariak-researching ketika 5 file temuan sub-agen ada. Cross-reference sumber, deduplikasi, selesaikan kontradiksi, hasilkan research-report.docx (output DOCX primer) + research-report.md (fallback plain text) + references.json, dan hitung skor kepercayaan. Trigger pada "synthesize", "compile research", "merge findings", "sintesis", "gabungkan temuan", atau saat cariak-researching menyerah dengan 5 file temuan.
---

### Prinsip Inti

> **"Sintesis bukan ringkasan. Ini adalah resolusi multiple perspektif menjadi keseluruhan yang koheren, dikutip, dan diberi nilai kepercayaan."**

Ringkasan mendaftar apa yang ditemukan setiap sub-agen. Sintesis menyelesaikan temuan tersebut—merekonsiliasi kontradiksi, mendeduplikasi sumber yang tumpang tindih, mengisi celah, dan memberi nilai kepercayaan—menjadi satu narasi koheren yang dapat dipercaya pembaca. Jika dua sub-agen kontradiksi, sintesis harus mengatakannya secara eksplisit, menyajikan kedua sisi, dan menjelaskan mengapa. Menyembunyikan kontradiksi di balik "di sisi lain" yang hambar dilarang.

### Kapan Digunakan

- `cariak-researching` telah menghasilkan 5 file temuan dan menyerahkan
- Pengguna mengatakan "synthesize", "compile research", "merge findings", "sintesis"
- Loop re-research selesai dan sintesis baru diperlukan
- Pengguna ingin laporan akhir dihasilkan dari temuan yang ada

### JANGAN Digunakan

- Kurang dari 5 file temuan ada (kembali ke `cariak-researching`)
- Spec riset tidak ada (sintesis butuh spec untuk memetakan temuan ke pertanyaan)
- Pengguna ingin memvalidasi temuan (gunakan `cariak-validating` setelah sintesis)
- Pengguna ingin ringkasan cepat, bukan laporan penuh (cukup minta brief)

### Tabel Batasan

| Skill Terkait | Hubungan | Aturan Batasan |
|---|---|---|
| `cariak-researching` | Hulu | Menyediakan 5 file temuan; synthesizing tidak menjalankan ulang riset |
| `cariak-validating` | Hilir | Mengonsumsi research-report.docx untuk ekstrak klaim kunci untuk sanggahan |
| `cariak-reflecting` | Hilir (alt) | Bisa menerima sintesis jika validasi dilewati |
| `cariak-planning` | Loop umpan balik | Bisa memicu re-planning jika sintesis mengungkap celah |
| `cariak-advising` | Ortogonal | Biasanya tidak dipanggil selama sintesis |

### Hard Gates

**GATE 0: SEMUA 5 TEMUAN HARUS ADA**

Sebelum pekerjaan sintesis dimulai, verifikasi semua 5 file ada. Jika ADA file yang hilang → BERHENTI. Jangan sintesis dengan data parsial. Laporkan file yang hilang dan jalankan `cariak-researching` untuk menjalankan ulang sub-agen yang gagal.

**GATE 1: TIDAK ADA KLAIM TANPA SUMBER**

Setiap pernyataan dalam `research-report.md` HARUS memiliki kutipan inline `[N]` yang memetakan ke entri di `references.json`. Klaim tanpa kutipan DILARANG. Jika klaim tidak bisa disumberi, harus ditandai sebagai `[UNSOURCED]` dan di-flag untuk pengguna.

**GATE 2: KONTRADIKSI HARUS DISELESAIKAN SECARA EKSPLISIT**

Ketika dua temuan kontradiksi: kedua perspektif harus disajikan dengan kutipan, kontradiksi harus dinamai secara eksplisit, sintesis harus menjelaskan kontradiksi, dan jika resolusi mustahil, laporan harus mengatakan "kontradiksi tidak teratasi" dan menurunkan skor kepercayaan. Membuat rata-rata atau menyembunyikan kontradiksi DILARANG.

**GATE 2.5: ADVISOR CONTRADICTION CHALLENGE WAJIB — ANTITESIS SEBELUM LAPORAN**

Challenge advisor Contradiction Hunter + Devil's Advocate (Fase 3.5) tidak opsional. Sebelum menulis laporan riset final:
1. Registry klaim yang sudah di-cross-reference (tesis) harus ditantang oleh advisor independen (antitesis).
2. Advisor harus berburu kontradiksi yang terlewat, cherry-picking, dan narasi paksa.
3. Setiap kontradiksi baru yang ditemukan harus diselesaikan (loop kembali ke Fase 3) sebelum melanjutkan.
4. Jangan lewati langkah antitesis. Deteksi kontradiksi mesin sintesis sendiri memiliki titik buta — advisor independen menangkap apa yang terlewat.

### Fase 0: Preflight

**Tujuan:** Verifikasi semua input ada sebelum sintesis.

1. Cek Memory MCP untuk konteks proyek dan rencana riset
2. Verifikasi semua 5 file temuan ada (GATE 0)
3. Muat `research-spec.md` untuk memulihkan pertanyaan riset
4. Muat `references/citation-standards.csv` untuk format kutipan
5. Buat direktori output: `docs/cariak/synthesized/YYYY-MM-DD-slug/`
6. Catat awal sintesis ke Memory MCP

**Cek Gate 0:** Semua 5 file ada? Jika tidak → berhenti.

### Fase 1: Muat 5 Temuan

**Tujuan:** Parsing semua temuan menjadi representasi internal terpadu.

Untuk setiap file temuan: parse struktur markdown, ekstrak semua klaim dengan kutipannya, bangun registry klaim internal, ekstrak semua sumber unik ke bibliografi preliminer.

Setelah memuat semua 5 file, Anda seharusnya memiliki: N total klaim, M sumber unik (setelah dedup).

### Fase 2: Cross-reference & Deduplikasi

**Tujuan:** Identifikasi sumber yang tumpang tindih dan klaim redundan.

**Deduplikasi sumber:** Kelompokkan sumber berdasarkan URL, untuk sumber dengan judul sama tapi URL berbeda flag sebagai "mungkin sumber sama", gabungkan entri sumber duplikat.

**Deduplikasi klaim:** Kelompokkan klaim berdasarkan kesamaan semantik, untuk setiap kelompok gabungkan menjadi satu klaim dengan multiple kutipan pendukung, lacak sub-agen mana yang berkontribusi ke setiap klaim yang digabung.

**Cross-referencing:** Untuk setiap pertanyaan riset (dari spec), kumpulkan semua klaim yang menjawabnya, tag setiap klaim dengan RQ-nya, identifikasi klaim yang tidak memetakan ke RQ apa pun (flag sebagai "off-topic").

**Output:** Registry klaim internal yang sudah dideduplikasi.

### Fase 3: Selesaikan Kontradiksi

**Tujuan:** Identifikasi dan selesaikan temuan yang konflik.

**Deteksi kontradiksi:** Untuk setiap RQ, periksa semua klaim yang menjawabnya, identifikasi pasaran/kelompok klaim yang menegaskan kesimpulan berlawanan.

**Protokol resolusi:** Untuk setiap kontradiksi: sajikan kedua sisi dengan kutipan penuh, analisis mengapa mereka kontradiksi, jika satu sisi punya bukti lebih kuat catat kecenderungan, jika tidak bisa diselesaikan tandai sebagai "tidak teratasi" dan turunkan kepercayaan untuk RQ itu.

**Penegakan Gate 2:** Setiap kontradiksi harus muncul di laporan dengan kedua perspektif.

### Fase 3.5: Advisor Contradiction Challenge (ANTITESIS)

**Tujuan:** Kirim advisor Contradiction Hunter + Devil's Advocate untuk menantang cross-source merge secara independen SEBELUM menulis laporan final.

Ini adalah langkah TESIS → ANTITESIS. Registry klaim yang sudah di-cross-reference dan dideduplikasi adalah tesis. Sekarang advisor independen harus berburu kontradiksi yang mungkin terlewat atau ditekan oleh sintesis.

1. **Kirim advisor Contradiction Hunter + Devil's Advocate** (via `cariak-advising`):
   - Advisor adalah **model/persona BERBEDA**, bukan kritik-diri.
   - Tugas advisor: temukan kontradiksi, cherry-picking, narasi paksa dalam cross-source merge.
   - Advisor HARUS menyitir sumber spesifik untuk setiap kontradiksi yang diklaim.
2. **Pertanyaan challenge advisor:**
   - "Di mana sumber-sumber tidak setuju? Kontradiksi apa yang terlewat oleh fase cross-reference?"
   - "Bukti apa yang sedang di-cherry-pick? Sumber apa yang tidak cocok dengan narasi yang dikecualikan?"
   - "Narasi apa yang sedang dipaksakan oleh sintesis? Interpretasi alternatif apa yang ada?"
   - "RQ mana yang memiliki basis bukti terlemah? Di mana kepercayaan diestimasi terlalu tinggi?"
3. **Advisor mengembalikan:**
   - Daftar kontradiksi spesifik yang perlu resolusi eksplisit (dengan kutipan sumber).
   - Bukti cherry-picking atau pemaksaan narasi.
   - RQ dengan bukti lemah di mana kepercayaan harus diturunkan.
   - Rekomendasi: apa yang perlu ditinjau ulang sebelum menulis laporan final.

**Cek Gate 2.5:** Advisor contradiction challenge dieksekusi SEBELUM menulis laporan riset final? Jika tidak → berhenti dan jalankan challenge. Output advisor kembali ke Fase 3 (selesaikan kontradiksi baru yang ditemukan) sebelum melanjutkan ke Fase 4.

**Output:** Laporan kontradiksi advisor — kontradiksi tidak terselesaikan, flag cherry-picking, RQ dengan bukti lemah.

### Fase 4: Hasilkan research-report.docx (primer) + research-report.md (fallback)

**Tujuan:** Tulis laporan riset yang disintesis dalam format DOCX profesional, dengan fallback markdown plain-text.

**Generasi DOCX menggunakan perintah CLI `npx cariak-pi report` secara internal, yang menjalankan npm package `docx` (v9.7.1).**

**Output primer: DOCX** (laporan profesional tingkat McKinsey/BCG dengan cover page, header, footer, tabel bergaya, dan kutipan inline).

**Output fallback: Markdown** — struktur sama untuk konsumen plain-text.

**Struktur:** Executive Summary, Research Questions Answered (per RQ dengan Finding, Evidence, Contradictions, Confidence), Contradictions & Resolutions, Source Diversity, Gaps Identified, References.

Tulis DOCX ke: `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.docx`
Tulis MD fallback ke: `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.md`

### Fase 5: Hasilkan references.json

**Tujuan:** Database kutipan yang dapat dibaca mesin.

Struktur JSON dengan: project_slug, generated_at, citation_standard, sources array (id, type, title, authors, url, published_date, accessed_date, subagents_citing, reliability_tier), total_sources.

Tulis ke: `docs/cariak/synthesized/YYYY-MM-DD-slug/references.json`

### Fase 6: Hitung Skor Kepercayaan

**Tujuan:** Kuantifikasi reliabilitas sintesis.

**Formula kepercayaan:** weighted sum of source diversity (0.25), source count (0.20), contradiction penalty (0.20), citation coverage (0.20), recency (0.15).

**Kepercayaan per-RQ:** Setiap RQ mendapat skor kepercayaannya sendiri berdasarkan: jumlah sumber yang menjawabnya, apakah kontradiksi diselesaikan, keberagaman sumber untuk pertanyaan spesifik itu.

**Output:** Skor kepercayaan ditambahkan ke header research-report.md.

### Fase 7: Handoff

**Tujuan:** Sajikan sintesis dan serahkan.

**Sajikan ke pengguna:** Path ke `research-report.docx` (primer), `research-report.md` (fallback), dan `references.json`, skor kepercayaan (keseluruhan + per-RQ), jumlah kontradiksi (teratasi/tidak teratasi), celah yang diidentifikasi.

**Menu 3 opsi:**
```
1. Validasi temuan → jalankan cariak-validating [RECOMMENDED]
2. Refleksi kualitas → jalankan cariak-reflecting (lewat validasi)
3. Simpan dan berhenti → laporan dipreservasi, lanjut nanti
```

**Aturan auto-invoke:** Jika kepercayaan ≥ 0.7 dan tidak ada kontradiksi tidak teratasi, auto-invoke `cariak-validating` di balik prompt konfirmasi. Jika kepercayaan < 0.7, rekomendasikan `cariak-reflecting` untuk memicu re-research.

**Update memory:** Simpan ResearchArtifact (path=research-report.docx, type, confidence, sources_count), ResearchInsight untuk setiap temuan kunci, ResearchGap untuk setiap celah tidak teratasi.

### Reference Triggers

| File Referensi | Fase | Tujuan |
|---|---|---|
| `references/citation-standards.csv` | Fase 4, 5 | Format kutipan per tipe sumber |
| `references/synthesis-template.md` | Fase 2, 3 | Struktur untuk temuan yang disintesis |
| `research-spec.md` | Fase 0, 1 | Pulihkan RQ untuk petakan temuan |
| 5 file temuan | Fase 1 | Klaim sumber dan kutipan |
| Memory MCP | Fase 0, 7 | Konteks proyek dan penyimpanan artifact |
