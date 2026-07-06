<!-- CARIAK TEMPLATE: recommendation-report - v1.1 -->
<!-- PRIMARY OUTPUT: .docx (generated via npx cariak-pi report). This .md is a fallback. -->
# Recommendation Report

## Bahasa Indonesia

### Judul
{{report_title}}

### Ringkasan Eksekutif
{{executive_summary}}

**Rekomendasi:** {{recommended_option}}

### Opsi yang Dipertimbangkan
**Opsi 1: {{option_1_name}}**
{{option_1_description}}

**Opsi 2: {{option_2_name}}**
{{option_2_description}}

**Opsi 3: {{option_3_name}}**
{{option_3_description}}

### Kriteria Evaluasi (Berbobot)
| Kriteria | Bobot | Justifikasi |
|----------|-------|-------------|
| {{criterion_1}} | {{criterion_1_weight}}% | {{criterion_1_justification}} |
| {{criterion_2}} | {{criterion_2_weight}}% | {{criterion_2_justification}} |
| {{criterion_3}} | {{criterion_3_weight}}% | {{criterion_3_justification}} |
| {{criterion_4}} | {{criterion_4_weight}}% | {{criterion_4_justification}} |
| {{criterion_5}} | {{criterion_5_weight}}% | {{criterion_5_justification}} |
| **Total** | **100%** | |

### Analisis

**Per Kriteria per Opsi:**

| Kriteria | Opsi 1 | Opsi 2 | Opsi 3 |
|----------|--------|--------|--------|
| {{criterion_1}} ({{criterion_1_weight}}%) | {{opt1_c1_score}}/5 | {{opt2_c1_score}}/5 | {{opt3_c1_score}}/5 |
| {{criterion_2}} ({{criterion_2_weight}}%) | {{opt1_c2_score}}/5 | {{opt2_c2_score}}/5 | {{opt3_c2_score}}/5 |
| {{criterion_3}} ({{criterion_3_weight}}%) | {{opt1_c3_score}}/5 | {{opt2_c3_score}}/5 | {{opt3_c3_score}}/5 |
| {{criterion_4}} ({{criterion_4_weight}}%) | {{opt1_c4_score}}/5 | {{opt2_c4_score}}/5 | {{opt3_c4_score}}/5 |
| {{criterion_5}} ({{criterion_5_weight}}%) | {{opt1_c5_score}}/5 | {{opt2_c5_score}}/5 | {{opt3_c5_score}}/5 |
| **Skor Tertimbang** | **{{opt1_total}}** | **{{opt2_total}}** | **{{opt3_total}}** |

**Analisis Detail per Kriteria:**

**{{criterion_1}}:**
- Opsi 1: {{opt1_c1_analysis}} [^1]
- Opsi 2: {{opt2_c1_analysis}}
- Opsi 3: {{opt3_c1_analysis}}

**{{criterion_2}}:**
- Opsi 1: {{opt1_c2_analysis}}
- Opsi 2: {{opt2_c2_analysis}}
- Opsi 3: {{opt3_c2_analysis}}

**{{criterion_3}}:**
- Opsi 1: {{opt1_c3_analysis}} [^2]
- Opsi 2: {{opt2_c3_analysis}}
- Opsi 3: {{opt3_c3_analysis}}

### Rekomendasi
Berdasarkan analisis tertimbang, **{{recommended_option}}** direkomendasikan.

Rasional:
- {{recommendation_rationale_1}}
- {{recommendation_rationale_2}}
- {{recommendation_rationale_3}}

### Pertimbangan Implementasi
- Prasyarat: {{prerequisite_1}}, {{prerequisite_2}}
- Risiko: {{implementation_risk}}
- Linimasa: {{implementation_timeline}}
- Sumber daya: {{resource_requirements}}

### Referensi
[^1]: {{reference_1}}
[^2]: {{reference_2}}

---

## English

### Title
{{report_title}}

### Executive Summary
{{executive_summary}}

**Recommendation:** {{recommended_option}}

### Options Considered
**Option 1: {{option_1_name}}**
{{option_1_description}}

**Option 2: {{option_2_name}}**
{{option_2_description}}

**Option 3: {{option_3_name}}**
{{option_3_description}}

### Evaluation Criteria (Weighted)
| Criterion | Weight | Justification |
|-----------|--------|---------------|
| {{criterion_1}} | {{criterion_1_weight}}% | {{criterion_1_justification}} |
| {{criterion_2}} | {{criterion_2_weight}}% | {{criterion_2_justification}} |
| {{criterion_3}} | {{criterion_3_weight}}% | {{criterion_3_justification}} |
| {{criterion_4}} | {{criterion_4_weight}}% | {{criterion_4_justification}} |
| {{criterion_5}} | {{criterion_5_weight}}% | {{criterion_5_justification}} |
| **Total** | **100%** | |

### Analysis

**Per Criterion per Option:**

| Criterion | Option 1 | Option 2 | Option 3 |
|-----------|----------|----------|----------|
| {{criterion_1}} ({{criterion_1_weight}}%) | {{opt1_c1_score}}/5 | {{opt2_c1_score}}/5 | {{opt3_c1_score}}/5 |
| {{criterion_2}} ({{criterion_2_weight}}%) | {{opt1_c2_score}}/5 | {{opt2_c2_score}}/5 | {{opt3_c2_score}}/5 |
| {{criterion_3}} ({{criterion_3_weight}}%) | {{opt1_c3_score}}/5 | {{opt2_c3_score}}/5 | {{opt3_c3_score}}/5 |
| {{criterion_4}} ({{criterion_4_weight}}%) | {{opt1_c4_score}}/5 | {{opt2_c4_score}}/5 | {{opt3_c4_score}}/5 |
| {{criterion_5}} ({{criterion_5_weight}}%) | {{opt1_c5_score}}/5 | {{opt2_c5_score}}/5 | {{opt3_c5_score}}/5 |
| **Weighted Score** | **{{opt1_total}}** | **{{opt2_total}}** | **{{opt3_total}}** |

**Detailed Analysis per Criterion:**

**{{criterion_1}}:**
- Option 1: {{opt1_c1_analysis}} [^1]
- Option 2: {{opt2_c1_analysis}}
- Option 3: {{opt3_c1_analysis}}

**{{criterion_2}}:**
- Option 1: {{opt1_c2_analysis}}
- Option 2: {{opt2_c2_analysis}}
- Option 3: {{opt3_c2_analysis}}

**{{criterion_3}}:**
- Option 1: {{opt1_c3_analysis}} [^2]
- Option 2: {{opt2_c3_analysis}}
- Option 3: {{opt3_c3_analysis}}

### Recommendation
Based on the weighted analysis, **{{recommended_option}}** is recommended.

Rationale:
- {{recommendation_rationale_1}}
- {{recommendation_rationale_2}}
- {{recommendation_rationale_3}}

### Implementation Considerations
- Prerequisites: {{prerequisite_1}}, {{prerequisite_2}}
- Risks: {{implementation_risk}}
- Timeline: {{implementation_timeline}}
- Resources: {{resource_requirements}}

### References
[^1]: {{reference_1}}
[^2]: {{reference_2}}
