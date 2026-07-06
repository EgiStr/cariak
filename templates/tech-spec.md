<!-- CARIAK TEMPLATE: tech-spec - v1.1 -->
# Technical Specification

## Bahasa Indonesia

### Gambaran Umum
Dokumen ini mendefinisikan spesifikasi teknis untuk {{system_name}}. Tujuan sistem adalah {{system_purpose}}.

### Arsitektur Sistem
{{system_name}} mengadopsi arsitektur {{architecture_pattern}} dengan komponen berikut:
- {{component_1}}: {{component_1_description}} [^1]
- {{component_2}}: {{component_2_description}}
- {{component_3}}: {{component_3_description}}

Alur data: {{data_flow_description}}

### Model Data
```
{{entity_1}} {
  {{field_1}}: {{field_1_type}}
  {{field_2}}: {{field_2_type}}
  {{field_3}}: {{field_3_type}}
}

{{entity_2}} {
  {{field_4}}: {{field_4_type}}
  {{field_5}}: {{field_5_type}}
}
```

### Desain API
| Endpoint | Metode | Deskripsi | Permintaan | Respons |
|----------|--------|-----------|-----------|---------|
| {{endpoint_1}} | {{method_1}} | {{api_desc_1}} | {{request_body_1}} | {{response_body_1}} |
| {{endpoint_2}} | {{method_2}} | {{api_desc_2}} | {{request_body_2}} | {{response_body_2}} |
| {{endpoint_3}} | {{method_3}} | {{api_desc_3}} | {{request_body_3}} | {{response_body_3}} |

### Dependensi
- {{dependency_1}} ({{dependency_version_1}}) [^2]
- {{dependency_2}} ({{dependency_version_2}})
- {{dependency_3}} ({{dependency_version_3}})

### Pertimbangan Keamanan
- Autentikasi: {{auth_method}}
- Otorisasi: {{authz_method}}
- Enkripsi: {{encryption_standard}}
- Kepatuhan: {{compliance_standard}}

### Target Performa
- Latensi P95: {{latency_p95_target}} ms
- Throughput: {{throughput_target}} req/s
- Waktu aktif (Uptime): {{uptime_target}}%
- Ukuran payload maksimum: {{max_payload_size}}

### Strategi Pengujian
- Unit tests: cakupan minimum {{unit_test_coverage}}%
- Integration tests: {{integration_test_scope}}
- End-to-end tests: {{e2e_test_scope}}
- Performance tests: {{perf_test_scope}}
- Keamanan: {{security_test_scope}}

### Deployment
- Lingkungan: {{environments}}
- Strategi: {{deployment_strategy}}
- CI/CD: {{cicd_platform}} [^3]
- Infrastruktur: {{infrastructure_description}}

### Pertanyaan Terbuka
- {{open_question_1}}
- {{open_question_2}}
- {{open_question_3}}

### Referensi
[^1]: {{reference_1}}
[^2]: {{reference_2}}
[^3]: {{reference_3}}

---

## English

### Overview
This document defines the technical specification for {{system_name}}. The system's purpose is {{system_purpose}}.

### System Architecture
{{system_name}} adopts a {{architecture_pattern}} architecture with the following components:
- {{component_1}}: {{component_1_description}} [^1]
- {{component_2}}: {{component_2_description}}
- {{component_3}}: {{component_3_description}}

Data flow: {{data_flow_description}}

### Data Models
```
{{entity_1}} {
  {{field_1}}: {{field_1_type}}
  {{field_2}}: {{field_2_type}}
  {{field_3}}: {{field_3_type}}
}

{{entity_2}} {
  {{field_4}}: {{field_4_type}}
  {{field_5}}: {{field_5_type}}
}
```

### API Design
| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| {{endpoint_1}} | {{method_1}} | {{api_desc_1}} | {{request_body_1}} | {{response_body_1}} |
| {{endpoint_2}} | {{method_2}} | {{api_desc_2}} | {{request_body_2}} | {{response_body_2}} |
| {{endpoint_3}} | {{method_3}} | {{api_desc_3}} | {{request_body_3}} | {{response_body_3}} |

### Dependencies
- {{dependency_1}} ({{dependency_version_1}}) [^2]
- {{dependency_2}} ({{dependency_version_2}})
- {{dependency_3}} ({{dependency_version_3}})

### Security Considerations
- Authentication: {{auth_method}}
- Authorization: {{authz_method}}
- Encryption: {{encryption_standard}}
- Compliance: {{compliance_standard}}

### Performance Targets
- P95 Latency: {{latency_p95_target}} ms
- Throughput: {{throughput_target}} req/s
- Uptime: {{uptime_target}}%
- Max payload size: {{max_payload_size}}

### Testing Strategy
- Unit tests: minimum coverage {{unit_test_coverage}}%
- Integration tests: {{integration_test_scope}}
- End-to-end tests: {{e2e_test_scope}}
- Performance tests: {{perf_test_scope}}
- Security: {{security_test_scope}}

### Deployment
- Environments: {{environments}}
- Strategy: {{deployment_strategy}}
- CI/CD: {{cicd_platform}} [^3]
- Infrastructure: {{infrastructure_description}}

### Open Questions
- {{open_question_1}}
- {{open_question_2}}
- {{open_question_3}}

### References
[^1]: {{reference_1}}
[^2]: {{reference_2}}
[^3]: {{reference_3}}
