<!-- CARIAK TEMPLATE: engineering-deep-dive - v1.0 -->
<!-- PRIMARY OUTPUT: .docx (generated via npx cariak-pi report --template engineering-deep-dive) -->
<!-- This template is for technical deep research. Add to existing template set. -->
# Engineering Deep Dive — Technical Research Report

> **Goal:** satu file, orang awam paham riset secara mendalam. Setiap section harus self-contained — tidak perlu baca sumber lain untuk mengerti.

---

## Bahasa Indonesia

### 1. Ringkasan untuk Orang Awam
> Jelaskan dalam 3-5 kalimat sederhana: apa masalahnya, apa yang ditemukan, apa rekomendasinya. Hindari jargon. Contoh: "Kita ingin tahu apakah kamera bisa menimbang buah jambu. Jawabannya: bisa, tapi..."

{{layperson_summary}}

### 2. Masalah yang Diselesaikan
- **Konteks:** {{problem_context}}
- **Mengapa penting:** {{problem_importance}}
- **Siapa yang terdampak:** {{problem_stakeholders}}
- **Apa yang terjadi kalau tidak diselesaikan:** {{problem_cost_of_inaction}}

### 3. Apa yang Kita Cari Tahu (Pertanyaan Riset)
{{#research_questions}}
#### {{rq_number}}. {{rq_title}}
- **Yang sudah diketahui:** {{rq_given}}
- **Yang diselidiki:** {{rq_investigated}}
- **Yang diharapkan ditemukan:** {{rq_expected}}
{{/research_questions}}

### 4. Bagaimana Kita Mencarinya (Metode)
- **Pendekatan:** {{methodology_approach}} [^1]
- **Sumber data:** dicek dari {{source_count}} sumber: internet ({{internet_count}}), media sosial ({{social_count}}), jurnal akademik ({{academic_count}}), berita ({{news_count}}), data pasar ({{market_count}})
- **Periode riset:** {{study_period}}
- **Metode validasi:** klaim dicek dengan GRADE (Guyatt et al., 2008, BMJ) dan CASP checklist (UK NHS, 2018)

### 5. Penjelasan dari Dasar (First Principles)
> Jelaskan mekanisme dasarnya — fisika, matematika, logika sistem. Seperti ngajarin anak SD.

{{first_principles_explanation}} [^2]

### 6. Apa yang Sudah Ada Sekarang (State of the Art)
> Metode yang ada di paper akademik, produk komersial, dan praktik engineering.

#### 6a. Dari Literatur Akademik
{{academic_state_of_art}}

#### 6b. Dari Produk dan Industri
{{industry_state_of_art}}

#### 6c. Dari Praktik Lapangan
> Bukan cuma yang mungkin di paper, tapi yang benar-benar dipakai orang di lapangan.

{{field_practice}}

### 7. Perbandingan Metode
> Tabel perbandingan langsung: mana yang bagus untuk apa.

| Metode | Akurasi | Data yang dibutuhkan | Biaya | Kecepatan | Kompleksitas | Risiko lapangan | Paling cocok untuk |
|---|---:|---:|---:|---:|---:|---|---|
{{#method_rows}}
| {{method_name}} | {{method_accuracy}} | {{method_data}} | {{method_cost}} | {{method_latency}} | {{method_complexity}} | {{method_risk}} | {{method_best_use}} |
{{/method_rows}}

### 8. Arsitektur yang Direkomendasikan
> Kalau mau bikin, ini blueprint-nya.

{{recommended_architecture}}

**Komponen utama:**
{{#components}}
- **{{component_name}}:** {{component_description}}
{{/components}}

**Aliran data:** {{data_flow}}

**Target deployment:** {{deployment_target}}

### 9. Peta Jalan Implementasi
> Dari nol sampai production, per fase.

| Fase | Target | Yang dibangun | Cara validasi | Kapan selesai |
|---|---|---|---|---|
{{#phases}}
| {{phase_name}} | {{phase_goal}} | {{phase_build}} | {{phase_validation}} | {{phase_exit}} |
{{/phases}}

### 10. Data yang Dibutuhkan
- **Dataset:** {{dataset_requirements}}
- **Label/Anotasi:** {{label_requirements}}
- **Kalibrasi:** {{calibration_requirements}}
- **Sampling:** {{sampling_plan}}
- **Risiko kualitas data:** {{data_quality_risks}}

### 11. Bagaimana Mengukur Keberhasilan
- **Metrik utama:** {{primary_metric}}
- **Metrik pendukung:** {{secondary_metrics}}
- **Baseline:** {{baseline}}
- **Threshold diterima:** {{acceptance_threshold}}
- **Desain validasi:** {{validation_design}}

### 12. Apa yang Bisa Gagal
> Setiap teknologi ada titik lemahnya. Harus jujur.

| Mode kegagalan | Penyebab | Dampak | Cara deteksi | Cara mitigasi |
|---|---|---|---|---|
{{#failure_modes}}
| {{failure_name}} | {{failure_cause}} | {{failure_impact}} | {{failure_detection}} | {{failure_mitigation}} |
{{/failure_modes}}

### 13. Alternatif dan Opsi Make vs Buy
> Tidak harus bikin sendiri. Apa opsi lain?

{{alternatives_analysis}}

**Opsi yang dievaluasi:**
{{#options}}
- **{{option_name}}:** {{option_description}} — {{option_verdict}}
{{/options}}

### 14. Celah Pengetahuan
> Apa yang BELUM kita tahu. Jujur, apa yang masih perlu riset lanjutan atau prototype.

{{knowledge_gaps}}

**Riset lanjutan yang dibutuhkan:**
{{#gaps}}
- {{gap_description}}
{{/gaps}}

### 15. Rekomendasi Final
> Kalau cuma boleh baca 1 paragraf, baca ini.

{{final_recommendation}}

**Yang harus dilakukan sekarang:**
1. {{action_1}}
2. {{action_2}}
3. {{action_3}}

**Yang harus dihindari:**
- {{avoid_1}}
- {{avoid_2}}

**Kapan evaluasi ulang:** {{reevaluation_trigger}}

### 16. Tingkat Kepercayaan
- **Skor keseluruhan:** {{confidence_score}}/1.0
- **Kualitas bukti (GRADE):** {{grade_rating}}
- **Klaim kuat (confidence ≥ 0.7):** {{strong_claims}} dari {{total_claims}}
- **Klaim lemah (confidence < 0.5):** {{weak_claims}} dari {{total_claims}}
- **Kontradiksi belum teratasi:** {{unresolved_contradictions}}

### 17. Sumber
{{#references}}
[^{{ref_number}}] {{ref_authors}} ({{ref_year}}). *{{ref_title}}*. {{ref_venue}}. {{ref_url}}
{{/references}}

---

## English

### 1. Layperson's Summary
{{layperson_summary}}

### 2. The Problem
- **Context:** {{problem_context}}
- **Why it matters:** {{problem_importance}}
- **Who is affected:** {{problem_stakeholders}}
- **Cost of inaction:** {{problem_cost_of_inaction}}

### 3. Research Questions
{{#research_questions}}
#### {{rq_number}}. {{rq_title}}
- **Given:** {{rq_given}}
- **Investigated:** {{rq_investigated}}
- **Expected:** {{rq_expected}}
{{/research_questions}}

### 4. Methods
- **Approach:** {{methodology_approach}} [^1]
- **Sources:** {{source_count}} total (internet: {{internet_count}}, social: {{social_count}}, academic: {{academic_count}}, news: {{news_count}}, market: {{market_count}})
- **Period:** {{study_period}}
- **Validation:** GRADE (Guyatt et al., 2008, BMJ) + CASP (UK NHS, 2018)

### 5. First-Principles Explanation
{{first_principles_explanation}} [^2]

### 6. State of the Art
#### 6a. Academic Literature
{{academic_state_of_art}}

#### 6b. Commercial & Industry
{{industry_state_of_art}}

#### 6c. Field Practice
{{field_practice}}

### 7. Method Comparison
| Method | Accuracy | Data Needed | Cost | Speed | Complexity | Field Risk | Best For |
|---|---:|---:|---:|---:|---:|---|---|
{{#method_rows}}
| {{method_name}} | {{method_accuracy}} | {{method_data}} | {{method_cost}} | {{method_latency}} | {{method_complexity}} | {{method_risk}} | {{method_best_use}} |
{{/method_rows}}

### 8. Recommended Architecture
{{recommended_architecture}}

### 9. Implementation Roadmap
| Phase | Goal | Build | Validation | Exit Criteria |
|---|---|---|---|---|
{{#phases}}
| {{phase_name}} | {{phase_goal}} | {{phase_build}} | {{phase_validation}} | {{phase_exit}} |
{{/phases}}

### 10. Data Strategy
- **Datasets:** {{dataset_requirements}}
- **Labels:** {{label_requirements}}
- **Calibration:** {{calibration_requirements}}
- **Sampling:** {{sampling_plan}}
- **Quality risks:** {{data_quality_risks}}

### 11. Evaluation Protocol
- **Primary metric:** {{primary_metric}}
- **Secondary metrics:** {{secondary_metrics}}
- **Baseline:** {{baseline}}
- **Acceptance threshold:** {{acceptance_threshold}}
- **Validation design:** {{validation_design}}

### 12. Failure Modes
| Failure Mode | Cause | Impact | Detection | Mitigation |
|---|---|---|---|---|
{{#failure_modes}}
| {{failure_name}} | {{failure_cause}} | {{failure_impact}} | {{failure_detection}} | {{failure_mitigation}} |
{{/failure_modes}}

### 13. Alternatives & Build-vs-Buy
{{alternatives_analysis}}

### 14. Knowledge Gaps
{{knowledge_gaps}}

### 15. Final Recommendation
{{final_recommendation}}

### 16. Confidence Assessment
- **Overall score:** {{confidence_score}}/1.0
- **GRADE rating:** {{grade_rating}}
- **Strong claims:** {{strong_claims}}/{{total_claims}}
- **Weak claims:** {{weak_claims}}/{{total_claims}}
- **Unresolved contradictions:** {{unresolved_contradictions}}

### 17. References
{{#references}}
[^{{ref_number}}] {{ref_authors}} ({{ref_year}}). *{{ref_title}}*. {{ref_venue}}. {{ref_url}}
{{/references}}
