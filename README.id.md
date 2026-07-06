# Cariak — Agen Riset Mendalam Open-Source

[![Lisensi: MIT](https://img.shields.io/badge/Lisensi-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenCode Skill](https://img.shields.io/badge/OpenCode-Skill-blue.svg)](https://github.com/sst/opencode)
[![Versi](https://img.shields.io/badge/versi-v1.1.0-green.svg)](CHANGELOG.md)
[![Dwibahasa](https://img.shields.io/badge/bahasa-ID%20%2B%20EN-orange.svg)](README.md)

> **Hukum Besi: TIDAK ADA KLAIM TANPA SUMBER.**
> Every claim must be sourced. Setiap klaim harus bersumber.

---

## Apa itu Cariak?

Cariak adalah agen riset mendalam open-source yang dibangun sebagai kumpulan [OpenCode](https://github.com/sst/opencode) skills, terinspirasi dari arsitektur skill-based agent [Pocketto](https://github.com/rfxlamia/pocketto). Cariak melakukan riset komprehensif melintasi internet, media sosial, makalah akademik, berita, dan sumber pasar — lalu mensintesis temuan menjadi dokumen proyek yang bersumber dan dinilai tingkat kepercayaannya.

Alih-alih satu prompt monolitik, Cariak mengurai riset menjadi **9 skill khusus** yang membentuk pipeline: dari pitching (mengklarifikasi niat) melalui grinding (riset paralel) hingga reflecting (gerbang kualitas) dan remembering (persistensi memori). Setiap skill memiliki satu tanggung jawab, kontrak input/output yang jelas, dan Hard Gate yang mencegah kemajuan fase sebelum kriteria kualitas terpenuhi.

Cariak bersifat **dwibahasa** — beroperasi dalam Bahasa Indonesia dan Inggris, menyesuaikan bahasa pengguna sepanjang siklus riset.

---

## Fitur

- **9 Skill** — pipeline riset lengkap: pitching → grinding → advising → planning → researching → synthesizing → validating → reflecting → remembering
- **5 Sub-agen Riset Paralel** — peneliti internet, sosial, akademik, berita, dan pasar berjalan bersamaan, masing-masing dengan domain sumber dan MCP tools khusus
- **12 Output Dokumen On-Demand** — PRD, tech-spec, ADR, competitive-analysis, risk-register, literature-review, experiment-design, feasibility-study, implementation-roadmap, research-proposal, technical-report, recommendation-report
- **2 Output Selalu-Aktif** — `research-report.md` (sintesis utama) dan `references.json` (graf sitasi terstruktur) dihasilkan setiap kali dijalankan
- **Memori Multi-Sesi** — menyimpan entitas, relasi, dan observasi lintas sesi melalui Memory MCP, memungkinkan riset kumulatif
- **Gerbang Kualitas Auto-Reflection** — skill `reflecting` mengevaluasi setiap output terhadap kriteria kepercayaan, cakupan sumber, dan bias sebelum dirilis
- **Dwibahasa (Indonesia + Inggris)** — setiap skill, prompt, dan template output mendukung kedua bahasa
- **Setiap Klaim Bersumber** — Hukum Besi: *TIDAK ADA KLAIM TANPA SUMBER*. Klaim tanpa sumber ditandai dan ditolak di gerbang validasi

---

## Inspirasi

Terinspirasi dari [Pocketto](https://github.com/rfxlamia/pocketto) — arsitektur skill-based agent yang menampilkan Hard Gates, Phase pipelines, dan kurasi advisor LLM-to-LLM. Cariak mengadaptasi pola inti Pocketto ke domain riset mendalam:

| Pola Pocketto | Adaptasi Cariak |
|---|---|
| Skill = satu tanggung jawab | 9 skill riset, masing-masing satu tugas |
| Hard Gates | Clarify Gate (pitching), Quality Gate (reflecting), Validation Gate (validating) |
| Phase pipelines | Alur skill berurutan dengan output wajib per fase |
| Kurasi advisor LLM-to-LLM | skill `advising` menghasilkan persona ahli yang meninjau rencana riset |

---

## Instalasi

### 1. Clone repositori

```bash
git clone https://github.com/EgiStr/cariak.git
```

### 2. Tambahkan ke konfigurasi OpenCode

Tambahkan direktori skill Cariak ke konfigurasi OpenCode Anda:

```json
{
  "skills": [
    "D:/programming/automation/cariak/skills"
  ]
}
```

Atau, jika Anda clone ke dalam workspace OpenCode, gunakan path relatif.

### 3. Konfigurasi MCP tools

Cariak bergantung pada beberapa MCP server. Pastikan berikut ini terkonfigurasi di lingkungan OpenCode Anda:

| MCP Server | Tujuan |
|---|---|
| `web-search-mcp` | Pencarian web, ekstraksi halaman, pencarian GitHub/Reddit/HN/X |
| `paper-search-mcp` | Pencarian makalah akademik (arXiv, PubMed, Semantic Scholar, dll.) |
| `tavily` | Riset web mendalam, crawling situs, ekstraksi konten |
| `memory` | Knowledge graph entitas-relasi yang persisten |
| `playwright` | Otomasi browser untuk halaman dinamis/JS-rendered |

Lihat [Konfigurasi](#konfigurasi) untuk detail.

---

## Penggunaan

Picu Cariak dengan salah satu frasa berikut di sesi OpenCode Anda:

| Frasa Pemicu | Bahasa | Perilaku |
|---|---|---|
| `cariak` | Universal | Menjalankan pipeline lengkap |
| `research this` | EN | Menjalankan pipeline lengkap |
| `deep research` | EN | Menjalankan pipeline lengkap dengan kedalaman ekstra |
| `gali ini` | ID | Menjalankan pipeline lengkap (output Indonesia) |

### Contoh sesi

```
Pengguna: cariak — saya butuh feasibility study tentang mengganti REST API kami dengan GraphQL

Cariak: [pitching] Mengklarifikasi niat riset...
        → Pertanyaan riset dikonfirmasi: "Apakah migrasi dari REST ke GraphQL layak untuk tim kami?"
        → Bahasa output: Bahasa Indonesia

Cariak: [grinding] Mengurai menjadi aliran riset...
        → Aliran 1: Kelayakan teknis (desain skema, N+1, autentikasi)
        → Aliran 2: Kapabilitas tim (kurva belajar, rekrutmen)
        → Aliran 3: Benchmark performa (REST vs GraphQL)

Cariak: [advising] Menghasilkan persona ahli...
        → Senior Backend Architect
        → DevOps Lead
        → API Product Manager

Cariak: [planning] Membangun rencana riset dengan masukan advisor...

Cariak: [researching] Meluncurkan 5 sub-agen paralel...
        → internet:  mencari artikel web, blog post
        → social:    mencari diskusi Reddit, HN, X
        → academic:  mencari arXiv, Semantic Scholar
        → news:      mencari berita tech, pengumuman
        → market:    mencari API kompetitor, laporan pasar

Cariak: [synthesizing] Menggabungkan 5 aliran riset...
        → 47 sumber dikumpulkan
        → 3 tingkat kepercayaan ditetapkan (Tinggi / Sedang / Rendah)

Cariak: [validating] Memeriksa kepatuhan Hukum Besi...
        → 0 klaim tanpa sumber ✓
        → 2 klaim kepercayaan rendah ditandai

Cariak: [reflecting] Evaluasi gerbang kualitas...
        → Cakupan sumber:   LULUS (4+ sumber per klaim utama)
        → Cek bias:         LULUS (multi perspektif)
        → Penilaian kepercayaan: LULUS (hedging yang tepat)

Cariak: [remembering] Menyimpan ke memori...
        → 12 entitas, 8 relasi disimpan

✅ Output: docs/cariak/feasibility-study.md
✅ Output: docs/cariak/research-report.md
✅ Output: docs/cariak/references.json
```

---

## Pipeline

9 skill membentuk pipeline berurutan. Setiap skill harus selesai dan melewati Hard Gate-nya sebelum yang berikutnya dimulai.

```
 ┌──────────┐
 │ PITCHING │  Klarifikasi niat riset dengan pengguna
 │  (gate)  │  → research-question.md
 └────┬─────┘
      │ Clarify Gate ✓
      ▼
 ┌──────────┐
 │ GRINDING │  Urai pertanyaan menjadi aliran riset
 └────┬─────┘
      │
      ▼
 ┌──────────┐
 │ ADVISING │  Hasilkan persona ahli, tinjau rencana
 └────┬─────┘
      │
      ▼
 ┌──────────┐
 │ PLANNING │  Bangun rencana riset detail
 └────┬─────┘
      │
      ▼
 ┌──────────────────────────────────────────────┐
 │              RESEARCHING                      │
 │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐    │
 │  │inter- │ │social │ │acade- │ │ news  │    │
 │  │ net   │ │       │ │ mic   │ │       │    │
 │  └───────┘ └───────┘ └───────┘ └───────┘    │
 │  ┌───────┐                                   │
 │  │market │  ← 5 sub-agen paralel             │
 │  └───────┘                                   │
 └──────────────────┬───────────────────────────┘
                    │
                    ▼
 ┌─────────────┐
 │ SYNTHESIZING│  Gabungkan aliran, tetapkan kepercayaan
 └──────┬──────┘
        │
        ▼
 ┌────────────┐
 │ VALIDATING │  Cek Hukum Besi: setiap klaim bersumber?
 │  (gate)    │  → klaim tanpa sumber ditolak
 └──────┬─────┘
        │ Validation Gate ✓
        ▼
 ┌─────────────┐
 │ REFLECTING  │  Gerbang kualitas: cakupan, bias, kepercayaan
 │  (gate)     │  → lulus / ulangi / gagal
 └──────┬──────┘
        │ Quality Gate ✓
        ▼
 ┌─────────────┐
 │ REMEMBERING │  Simpan ke Memory MCP
 └──────┬──────┘
        │
        ▼
   ╔═══════════════════════╗
   ║  OUTPUT DOKUMEN       ║
   ║  • research-report.md ║  (selalu-aktif)
   ║  • references.json    ║  (selalu-aktif)
   ║  • + dokumen on-demand║
   ╚═══════════════════════╝
```

---

## Referensi Skill

| # | Skill | Pemicu | Output | Status |
|---|---|---|---|---|
| 1 | **pitching** | Pengguna memulai riset | `research-question.md` — niat terklarifikasi, ruang lingkup, bahasa | ✅ Stabil |
| 2 | **grinding** | Setelah pitching | `research-streams.md` — sub-pertanyaan riset terurai | ✅ Stabil |
| 3 | **advising** | Setelah grinding | `advisor-review.md` — persona ahli + kritik rencana | ✅ Stabil |
| 4 | **planning** | Setelah advising | `research-plan.md` — rencana eksekusi detail | ✅ Stabil |
| 5 | **researching** | Setelah planning | 5× `sub-agent-report.md` — hasil riset paralel | ✅ Stabil |
| 6 | **synthesizing** | Setelah researching | `research-report.md` + dokumen on-demand — sintesis gabungan | ✅ Stabil |
| 7 | **validating** | Setelah synthesizing | `validation-report.md` — cek kepatuhan Hukum Besi | ✅ Stabil |
| 8 | **reflecting** | Setelah validating | `reflection-report.md` — evaluasi gerbang kualitas | ✅ Stabil |
| 9 | **remembering** | Setelah reflecting | Entitas + relasi Memory MCP disimpan | ✅ Stabil |

---

## Sub-Agen

Skill `researching` meluncurkan 5 sub-agen paralel, masing-masing khusus untuk domain sumber:

| Sub-Agen | Domain Sumber | MCP Tools |
|---|---|---|
| **Peneliti Internet** | Web umum, blog, dokumentasi, tutorial | `web-search-mcp` (search_web, fetch_web_page, groq_analyze) |
| **Peneliti Sosial** | Reddit, Hacker News, X/Twitter, forum | `web-search-mcp` (search_reddit, search_hackernews, search_x) |
| **Peneliti Akademik** | arXiv, PubMed, Semantic Scholar, CrossRef, DOAJ | `paper-search-mcp` (search_arxiv, search_pubmed, search_semantic, read_arxiv_paper) |
| **Peneliti Berita** | Berita tech, siaran pers, pengumuman industri | `tavily` (tavily_search), `web-search-mcp` (search_web dengan tipe news) |
| **Peneliti Pasar** | Situs kompetitor, laporan pasar, halaman produk | `tavily` (tavily_crawl, tavily_extract), `playwright` (browser_navigate, browser_snapshot) |

Setiap sub-agen berjalan independen dan mengembalikan laporan terstruktur dengan:
- Temuan (dengan sitasi inline)
- URL sumber
- Penilaian kepercayaan
- Kesenjangan yang teridentifikasi

---

## Output Dokumen

Cariak menghasilkan **2 output selalu-aktif** setiap kali dijalankan, plus **12 output on-demand** yang dapat diminta:

| # | Dokumen | Kapan | Tipe |
|---|---|---|---|
| 1 | `research-report.md` | Setiap kali dijalankan | Selalu-aktif |
| 2 | `references.json` | Setiap kali dijalankan | Selalu-aktif |
| 3 | `prd.md` | On-demand | Product Requirements Document |
| 4 | `tech-spec.md` | On-demand | Spesifikasi Teknis |
| 5 | `adr.md` | On-demand | Architecture Decision Record |
| 6 | `competitive-analysis.md` | On-demand | Analisis Kompetitif |
| 7 | `risk-register.md` | On-demand | Daftar Risiko |
| 8 | `literature-review.md` | On-demand | Tinjauan Literatur Akademik |
| 9 | `experiment-design.md` | On-demand | Desain Eksperimen |
| 10 | `feasibility-study.md` | On-demand | Studi Kelayakan |
| 11 | `implementation-roadmap.md` | On-demand | Peta Jalan Implementasi |
| 12 | `research-proposal.md` | On-demand | Proposal Riset |
| 13 | `technical-report.md` | On-demand | Laporan Teknis |
| 14 | `recommendation-report.md` | On-demand | Laporan Rekomendasi |

Semua output ditulis ke `docs/cariak/` secara default. Setiap klaim di setiap dokumen menyertakan sitasi inline `[n]` yang memetakan ke entri di `references.json`.

---

## Konfigurasi

### MCP Tools

Cariak memerlukan MCP server berikut tersedia di lingkungan OpenCode Anda:

#### 1. web-search-mcp

Pencarian web umum, ekstraksi halaman, dan pencarian platform sosial.

```
Sumber: DuckDuckGo, Reddit, Hacker News, X/Twitter, GitHub, Wikipedia, arXiv, Exa
Tools:  search_web, fetch_web_page, groq_analyze, search_reddit,
        search_hackernews, search_x, search_github, search_wikipedia
```

#### 2. paper-search-mcp

Pencarian makalah akademik dan ekstraksi teks lengkap di 20+ repositori.

```
Sumber: arXiv, PubMed, PubMed Central, Semantic Scholar, CrossRef, DOAJ,
        bioRxiv, medRxiv, IEEE, dblp, HAL, Zenodo, OpenAIRE, CiteSeerX, BASE, SSRN
Tools:  search_arxiv, search_pubmed, search_semantic, search_crossref,
        read_arxiv_paper, download_with_fallback, search_papers (terpadu)
```

#### 3. tavily

Riset web bertenaga AI, crawling situs, dan ekstraksi konten.

```
Tools:  tavily_search, tavily_research, tavily_crawl, tavily_extract, tavily_map
```

#### 4. memory

Knowledge graph persisten untuk memori riset lintas sesi.

```
Tools:  create_entities, create_relations, add_observations,
        search_nodes, open_nodes, read_graph
Tipe entitas: ResearchProject, ResearchQuestion, Source, Finding,
              Claim, Advisor, ConfidenceAssessment
```

#### 5. playwright

Otomasi browser untuk halaman dinamis, JavaScript-rendered, atau ber-login.

```
Tools:  browser_navigate, browser_snapshot, browser_click,
        browser_type, browser_take_screenshot, browser_evaluate
```

---

## Contoh

Lihat output riset nyata di direktori contoh:

- [`docs/examples/guava-cut-cost/`](docs/examples/guava-cut-cost/) — Satu jalankan riset lengkap yang menyelidiki strategi pemotongan biaya untuk operasi pertanian jambu biji. Termasuk semua dokumen yang dihasilkan: research-report.md, references.json, feasibility-study.md, dan laporan sub-agen.

---

## Berkontribusi

Kontribusi diterima! Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan tentang:

- Melaporkan bug dan menyarankan fitur
- Menambahkan skill baru (ikuti pola Pocketto)
- Menambahkan sub-agen baru
- Meningkatkan file CSV referensi (setiap metode harus bersumber)
- Kebijakan dokumentasi dwibahasa

---

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT — lihat [LICENSE](LICENSE) untuk detail.

---

## Ucapan Terima Kasih

- **[Pocketto](https://github.com/rfxlamia/pocketto)** — Arsitektur skill-based agent yang menginspirasi desain Cariak. Hard Gates, Phase pipelines, dan kurasi advisor LLM-to-LLM adalah semua pola Pocketto.
- **[OpenCode](https://github.com/sst/opencode)** — Framework agen coding AI yang menampung Cariak sebagai skills.
- **Ekosistem MCP](https://modelcontextprotocol.io/)** — Model Context Protocol yang mendukung integrasi tools Cariak. Cariak berdiri di atas bahu para maintainer MCP server.
- **Komunitas Akademik & Open Source** — Setiap sumber yang disitir Cariak berasal dari peneliti, pengembang, dan penulis yang membagikan karya mereka secara terbuka.

---

<p align="center">
  <strong>Cariak</strong> — Riset mendalam. Semua bersumber. Selalu diingat.<br>
  <em>Research deep. Cite everything. Remember always.</em>
</p>
