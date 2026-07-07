# Cariak — Agen Riset Mendalam Open-Source

[![Lisensi: MIT](https://img.shields.io/badge/Lisensi-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenCode Skill](https://img.shields.io/badge/OpenCode-Skill-blue.svg)](https://github.com/sst/opencode)
[![Versi](https://img.shields.io/badge/versi-v1.3.1-green.svg)](CHANGELOG.md)
[![Dwibahasa](https://img.shields.io/badge/bahasa-ID%20%2B%20EN-orange.svg)](README.md)

> **Hukum Besi: TIDAK ADA KLAIM TANPA SUMBER.**
> Every claim must be sourced. Setiap klaim harus bersumber.

---

## Apa itu Cariak?

Cariak adalah agen riset mendalam open-source yang dibangun sebagai kumpulan [OpenCode](https://github.com/sst/opencode) skills, terinspirasi dari arsitektur skill-based agent [Pocketto](https://github.com/rfxlamia/pocketto). Cariak melakukan riset komprehensif melintasi internet, media sosial, makalah akademik, berita, dan sumber pasar — lalu mensintesis temuan menjadi dokumen proyek yang bersumber dan dinilai tingkat kepercayaannya.

Alih-alih satu prompt monolitik, Cariak mengurai riset menjadi **9 skill khusus** yang membentuk pipeline: dari pitching (mengklarifikasi niat) melalui grinding (riset paralel) hingga reflecting (gerbang kualitas) dan remembering (persistensi memori). Setiap skill memiliki satu tanggung jawab, kontrak input/output yang jelas, dan Hard Gate yang mencegah kemajuan fase sebelum kriteria kualitas terpenuhi.

Cariak bersifat **dwibahasa** — beroperasi dalam Bahasa Indonesia dan Inggris, menyesuaikan bahasa pengguna sepanjang siklus riset.

---
## Filosofi Inti

Cariak dibangun di atas metode dialektika: setiap output di setiap fase ditantang oleh persona advisor independen sebelum melanjutkan.

```
TESIS → ANTITESIS → SINTESIS
```

- **Tesis**: fase saat ini menghasilkan output (brainstorm, rencana, sintesis, klaim)
- **Antitesis**: sub-agen advisor independen menantang output tersebut — memburu titik buta, asumsi tak teruji, kontradiksi, dan bukti yang hilang
- **Sintesis**: output fase direvisi dengan memasukkan tantangan advisor, dan baru kemudian maju ke fase berikutnya

Ini bukan self-critique. Self-critique rentan terhadap bias konfirmasi — sebuah sistem tidak dapat mendeteksi titik butanya sendiri secara andal. Cariak menyelesaikan ini dengan memunculkan **7 persona advisor berbeda** sebagai sub-agen independen, masing-masing khusus untuk tantangan di fase tertentu:

| Fase | Persona Advisor | Tantangan |
|---|---|---|
| Pitching | Devil's Advocate | "Titik buta apa? Asumsi tak teruji apa?" |
| Grinding | Methodologist + Skeptic | "Apakah skenario GWT benar-benar dapat diuji? Edge case apa yang hilang?" |
| Planning | System Architect | "Apakah task benar-benar independen? Ada dependensi tersembunyi?" |
| Researching | Domain Expert (×5, dirotasi) | "Apakah temuan ini bias? Sumber apa yang bertentangan?" |
| Synthesizing | Contradiction Hunter | "Di mana sumber-sumber tidak setuju? Apa yang cherry-picked?" |
| Validating | Falsificationist (gaya Popper) | "Bagaimana Anda akan MEMBUKTIKAN setiap klaim salah?" |
| Reflecting | Blind Spot Auditor | "Apa yang TIDAK kami riset? Apa temuan terlemah?" |

Setiap tantangan advisor dicatat di `advisor-phase-mapping.csv` dan bersifat wajib — tidak ada fase yang maju tanpa melewati gerbang advisor-nya.

---

## Fitur

- **9 Skill** — pipeline riset lengkap: pitching → grinding → planning → researching → synthesizing → validating → reflecting → remembering
- **Advisor dialektik di setiap fase** — 7 persona advisor berbeda menantang setiap output; tanpa self-critique, semua tantangan via sub-agen independen
- **Arsitektur anti-bias** — setiap output ditantang sebelum maju; Falsificationist mencoba membuktikan klaim salah; Contradiction Hunter menemukan cherry-picking; Blind Spot Auditor menemukan apa yang terlewat
- **5 Sub-agen Riset Paralel** — peneliti internet, sosial, akademik, berita, dan pasar berjalan bersamaan, masing-masing dengan domain sumber dan MCP tools khusus
- **Output utama DOCX** — dokumen `.docx` kelas profesional dengan format, header, dan tabel via `npx cariak-pi report`; `.md` sebagai cadangan
- **12 Output Dokumen On-Demand** — PRD, tech-spec, ADR, competitive-analysis, risk-register, literature-review, experiment-design, feasibility-study, implementation-roadmap, research-proposal, technical-report, recommendation-report
- **2 Output Selalu-Aktif** — `research-report.docx` (sintesis utama, primer) / `research-report.md` (cadangan) dan `references.json` (graf sitasi terstruktur) dihasilkan setiap kali dijalankan
- **Memori Multi-Sesi** — menyimpan entitas, relasi, dan observasi lintas sesi melalui Memory MCP, memungkinkan riset kumulatif
- **Gerbang Kualitas Auto-Reflection** — skill `reflecting` mengevaluasi setiap output terhadap kriteria kepercayaan, cakupan sumber, dan bias sebelum dirilis
- **Dwibahasa (Indonesia + Inggris)** — setiap skill, prompt, dan template output mendukung kedua bahasa
- **Setiap Klaim Bersumber** — Hukum Besi: *TIDAK ADA KLAIM TANPA SUMBER*. Klaim tanpa sumber ditandai dan ditolak di gerbang validasi
- **Metode Riset Terstruktur** — setiap fase memakai metode akademis/industri asli yang bersumber — lihat `references/research-methods.csv` untuk sumber lengkap (SCAMPER, PICO, PRISMA-P, OSINT Cycle, Thematic Synthesis, GRADE, AMSTAR 2, FAIR, dll.)

---

## Inspirasi

Terinspirasi dari [Pocketto](https://github.com/rfxlamia/pocketto) — arsitektur skill-based agent yang menampilkan Hard Gates, Phase pipelines, dan kurasi advisor LLM-to-LLM. Cariak mengadaptasi pola inti Pocketto ke domain riset mendalam:

| Pola Pocketto | Adaptasi Cariak |
|---|---|
| Skill = satu tanggung jawab | 9 skill riset, masing-masing satu tugas |
| Hard Gates | Clarify Gate (pitching), Quality Gate (reflecting), Validation Gate (validating) |
| Phase pipelines | Alur skill berurutan dengan output wajib per fase |
| Kurasi advisor LLM-to-LLM | Advisor dialektik di setiap fase — 7 persona menantang setiap output |

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

### Metode riset terstruktur

Cariak membawa registry metode per fase agar setiap skill memakai teknik akademis/industri yang auditable, bukan prompt generik.

Lihat: [`docs/structural-research-methods.md`](docs/structural-research-methods.md) dan [`references/research-methods.csv`](references/research-methods.csv).

Untuk topik teknis, Cariak memakai **Engineering Lens Canvas** dan **Expert Technical Report**. Laporan akhir wajib membahas first principles, state of the art, praktik lapangan, arsitektur implementasi, strategi data, protokol evaluasi, failure modes, alternatif, unknowns, dan roadmap build konkret.

### Contoh sesi

```
Pengguna: cariak — saya butuh feasibility study tentang mengganti REST API kami dengan GraphQL

Cariak: [pitching] Mengklarifikasi niat riset...
        → Pertanyaan riset dikonfirmasi: "Apakah migrasi dari REST ke GraphQL layak untuk tim kami?"
        → Bahasa output: Bahasa Indonesia

Cariak: [advisor: Devil's Advocate] Menantang pertanyaan...
        → "Apakah Anda bertanya tentang kelayakan migrasi, atau tentang apakah GraphQL tepat?"
        → Tesis direvisi dengan masukan advisor

Cariak: [grinding] Mengurai menjadi aliran riset...
        → Aliran 1: Kelayakan teknis (desain skema, N+1, autentikasi)
        → Aliran 2: Kapabilitas tim (kurva belajar, rekrutmen)
        → Aliran 3: Benchmark performa (REST vs GraphQL)

Cariak: [advisor: Methodologist] Menantang aliran...
        → "Apakah benchmark performa dapat diuji? Baseline apa yang dibandingkan?"

Cariak: [planning] Membangun rencana riset dengan masukan advisor...

Cariak: [advisor: System Architect] Menantang rencana...
        → "Task 3 dan 5 memiliki dependensi tersembunyi. Riset kapabilitas tim harus selesai sebelum benchmarking."

Cariak: [researching] Meluncurkan 5 sub-agen paralel...
        → internet:  mencari artikel web, blog post
        → social:    mencari diskusi Reddit, HN, X
        → academic:  mencari arXiv, Semantic Scholar
        → news:      mencari berita tech, pengumuman
        → market:    mencari API kompetitor, laporan pasar

Cariak: [advisor: Domain Expert ×5] Menantang setiap temuan sub-agen...
        → "Klaim performa GraphQL ini tidak memiliki kontra-bukti. Ditolak."
        → "Thread HN ini mewakili satu opini. Perlu 2 sumber lagi."

Cariak: [synthesizing] Menggabungkan 5 aliran riset...
        → 47 sumber dikumpulkan
        → 3 tingkat kepercayaan ditetapkan (Tinggi / Sedang / Rendah)

Cariak: [advisor: Contradiction Hunter] Menantang sintesis...
        → "Sumber A dan D bertentangan langsung. Cherry-picking terdeteksi pada klaim #7."

Cariak: [validating] Memeriksa kepatuhan Hukum Besi...
        → 0 klaim tanpa sumber ✓
        → 2 klaim kepercayaan rendah ditandai

Cariak: [advisor: Falsificationist] Mencoba memfalsifikasi klaim...
        → "Klaim #3: 'GraphQL mengurangi over-fetching' — akan gagal jika REST API menggunakan sparse fieldsets."

Cariak: [reflecting] Evaluasi gerbang kualitas...
        → Cakupan sumber:   LULUS (4+ sumber per klaim utama)
        → Cek bias:         LULUS (multi perspektif)
        → Penilaian kepercayaan: LULUS (hedging yang tepat)

Cariak: [advisor: Blind Spot Auditor] Tantangan akhir...
        → "Anda tidak meriset pola GraphQL federation atau schema stitching."

Cariak: [remembering] Menyimpan ke memori...
        → 15 entitas, 12 relasi disimpan

✅ Output: docs/cariak/feasibility-study.docx
✅ Output: docs/cariak/research-report.docx
✅ Output: docs/cariak/references.json
```

### Pembuatan DOCX

Cariak v1.3.0 menghasilkan dokumen `.docx` profesional sebagai output utama. Format `.md` lama dipertahankan sebagai cadangan.

```bash
# Utama: menghasilkan laporan DOCX
npx cariak-pi report --template research-report

# Cadangan: menghasilkan laporan MD
npx cariak-pi report --template research-report --format md
```

---

## Pipeline

9 skill membentuk pipeline berurutan dengan gerbang advisor di setiap fase. Setiap skill harus selesai dan melewati Hard Gate-nya sebelum yang berikutnya dimulai.

```
 ┌──────────┐   ┌──────────────────────┐
 │ PITCHING │──→│ advisor: Devil's     │──Clarify Gate──┐
 │  (gate)  │   │ Advocate             │               │
 └──────────┘   └──────────────────────┘               │
      │ TESIS → ANTITESIS → SINTESIS                   │
      ▼                                                 │
 ┌──────────┐   ┌──────────────────────┐               │
 │ GRINDING │──→│ advisor: Methodologist│              │
 │          │   │ + Skeptic            │               │
 └──────────┘   └──────────────────────┘               │
      │ TESIS → ANTITESIS → SINTESIS                   │
      ▼                                                 │
 ┌──────────┐   ┌──────────────────────┐               │
 │ PLANNING │──→│ advisor: System       │              │
 │          │   │ Architect            │               │
 └──────────┘   └──────────────────────┘               │
      │ TESIS → ANTITESIS → SINTESIS                   │
      ▼                                                 │
 ┌──────────────────────────────────────┐              │
 │         RESEARCHING                  │              │
 │  ┌───────┐ ┌───────┐ ┌───────┐      │              │
 │  │internet│ │sosial │ │akademik│      │              │
 │  └───────┘ └───────┘ └───────┘      │              │
 │  ┌───────┐ ┌───────┐                 │              │
 │  │ berita│ │ pasar │  ← 5 sub-agen   │              │
 │  └───────┘ └───────┘    paralel      │              │
 └──────────────────┬───────────────────┘              │
      │             │                                  │
      │  ┌──────────────────────────┐                  │
      │  │ advisor: Domain Expert   │                  │
      │  │ ×5 (dirotasi per topik)   │                  │
      │  └──────────────────────────┘                  │
      │ TESIS → ANTITESIS → SINTESIS                   │
      ▼                                                 │
 ┌─────────────┐ ┌──────────────────────┐             │
 │ SYNTHESIZING│─→│ advisor: Contradiction│            │
 │             │  │ Hunter               │             │
 └──────┬──────┘ └──────────────────────┘             │
      │ TESIS → ANTITESIS → SINTESIS                   │
      ▼                                                 │
 ┌────────────┐  ┌──────────────────────┐             │
 │ VALIDATING │──→│ advisor: Falsification-│           │
 │  (gate)    │  │ ist (gaya Popper)     │            │
 └──────┬─────┘  └──────────────────────┘             │
        │ TESIS → ANTITESIS → SINTESIS                 │
        ▼                                                 │
 ┌─────────────┐ ┌──────────────────────┐              │
 │ REFLECTING  │─→│ advisor: Blind Spot  │              │
 │  (gate)     │  │ Auditor             │              │
 └──────┬──────┘ └──────────────────────┘              │
        │ TESIS → ANTITESIS → SINTESIS                 │
        ▼                                                 │
 ┌─────────────┐                                        │
 │ REMEMBERING │  Simpan ke Memory MCP                   │
 └──────┬──────┘                                        │
        │                                                 │
        ▼                                                 │
   ╔═══════════════════════╗                            │
   ║  OUTPUT DOKUMEN       ║                            │
   ║  • research-report    ║  (selalu-aktif, DOCX)      │
   ║    .docx              ║                            │
   ║  • references.json    ║  (selalu-aktif)            │
   ║  • + dokumen on-demand║  (DOCX primer, MD cadangan) │
   ╚═══════════════════════╝                            │
```

---

## Referensi Skill

| # | Skill | Advisor Kunci | Pemicu | Output | Status |
|---|---|---|---|---|---|
| 1 | **pitching** | Devil's Advocate | Pengguna memulai riset | `research-question.md` — niat terklarifikasi, ruang lingkup, bahasa | ✅ Stabil |
| 2 | **grinding** | Methodologist + Skeptic | Setelah pitching | `research-streams.md` — sub-pertanyaan riset terurai | ✅ Stabil |
| 3 | **planning** | System Architect | Setelah grinding | `research-plan.md` — rencana eksekusi detail | ✅ Stabil |
| 4 | **researching** | Domain Expert (×5) | Setelah planning | 5× `sub-agent-report.md` — hasil riset paralel | ✅ Stabil |
| 5 | **synthesizing** | Contradiction Hunter | Setelah researching | `research-report.docx` + dokumen on-demand — sintesis gabungan | ✅ Stabil |
| 6 | **validating** | Falsificationist | Setelah synthesizing | `validation-report.md` — cek kepatuhan Hukum Besi | ✅ Stabil |
| 7 | **reflecting** | Blind Spot Auditor | Setelah validating | `reflection-report.md` — evaluasi gerbang kualitas | ✅ Stabil |
| 8 | **remembering** | — | Setelah reflecting | Entitas + relasi Memory MCP disimpan | ✅ Stabil |

> **Catatan**: v1.3.0 menggabungkan skill `advising` sebelumnya ke dalam arsitektur advisor dialektik. Persona advisor kini beroperasi sebagai sub-agen independen di setiap fase, bukan sebagai satu fase tunggal.

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

**Utama: DOCX (profesional), Cadangan: MD (teks biasa)**

Cariak v1.3.0 menghasilkan dokumen `.docx` profesional via `npx cariak-pi report`. Format `.md` lama dipertahankan sebagai cadangan via `--format md`.

| # | Dokumen | Kapan | Tipe |
|---|---|---|---|
| 1 | `research-report.docx` / `.md` | Setiap kali dijalankan | Selalu-aktif |
| 2 | `references.json` | Setiap kali dijalankan | Selalu-aktif |
| 3 | `prd.docx` / `.md` | On-demand | Product Requirements Document |
| 4 | `tech-spec.docx` / `.md` | On-demand | Spesifikasi Teknis |
| 5 | `adr.docx` / `.md` | On-demand | Architecture Decision Record |
| 6 | `competitive-analysis.docx` / `.md` | On-demand | Analisis Kompetitif |
| 7 | `risk-register.docx` / `.md` | On-demand | Daftar Risiko |
| 8 | `literature-review.docx` / `.md` | On-demand | Tinjauan Literatur Akademik |
| 9 | `experiment-design.docx` / `.md` | On-demand | Desain Eksperimen |
| 10 | `feasibility-study.docx` / `.md` | On-demand | Studi Kelayakan |
| 11 | `implementation-roadmap.docx` / `.md` | On-demand | Peta Jalan Implementasi |
| 12 | `research-proposal.docx` / `.md` | On-demand | Proposal Riset |
| 13 | `technical-report.docx` / `.md` | On-demand | Laporan Teknis |
| 14 | `recommendation-report.docx` / `.md` | On-demand | Laporan Rekomendasi |

Semua output ditulis ke `docs/cariak/` secara default. Setiap klaim di setiap dokumen menyertakan sitasi inline `[n]` yang memetakan ke entri di `references.json`.

---

## Mengapa Arsitektur Ini?

Kebanyakan agen riset AI menggunakan self-critique: "tinjau output Anda sendiri untuk mencari kesalahan." Ini gagal karena:

1. **Bias konfirmasi** — LLM yang menghasilkan klaim sudah terprogram untuk mempertahankannya, bukan menyerangnya.
2. **Titik buta persisten** — Model yang sama dengan konteks yang sama memiliki titik buta yang sama.
3. **Tanpa tekanan adversarial** — Tanpa lawan nyata, klaim lemah lolos tanpa tantangan.

Arsitektur dialektik Cariak menyelesaikan ini:

- **Sub-agen independen**: Setiap persona advisor berjalan sebagai agen terpisah dengan konteksnya sendiri. Ia tidak berbagi bias agen pembuat.
- **Spesialisasi persona**: Methodologist menantang metodologi, Falsificationist mencoba membuktikan klaim salah, Blind Spot Auditor menemukan kesenjangan — persona berbeda untuk mode kegagalan berbeda.
- **Gerbang wajib**: Tidak ada fase yang maju tanpa melewati tantangan advisor-nya. Tantangan gagal akan berputar kembali untuk revisi.
- **Tantangan tercatat**: Setiap output advisor disimpan di `advisor-phase-mapping.csv`, membuat proses tantangan dapat diaudit.

Hasilnya: klaim bertahan dari pemeriksaan adversarial sebelum mencapai pengguna. Ini bukan "review" — ini adalah tesis, antitesis, sintesis di setiap langkah.

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
Sumber: arXiv, PubMed, Semantic Scholar, CrossRef, DOAJ, bioRxiv, medRxiv,
        PMC, Europe PMC, HAL, Zenodo, BASE, IACR, IEEE, SSRN, OpenAlex,
        CORE, OpenAIRE, dblp, CiteSeerX, Unpaywall
Tools:  search_arxiv, search_pubmed, search_semantic, search_crossref,
        search_doaj, search_pmc, search_europepmc, search_biorxiv,
        search_medrxiv, read_arxiv_paper, read_semantic_paper
```

#### 3. tavily

Riset web mendalam bertenaga AI, crawling situs, dan ekstraksi konten.

```
Tools:   tavily_search, tavily_crawl, tavily_extract, tavily_map
```

#### 4. memory

Knowledge graph entitas-relasi persisten via Memory MCP.

```
Tools:   create_entities, create_relations, add_observations,
         search_nodes, open_nodes, read_graph
```

#### 5. playwright

Otomasi browser untuk halaman dinamis, konten JavaScript-rendered, dan situs terproteksi.

```
Tools:   browser_navigate, browser_snapshot, browser_click,
         browser_take_screenshot, browser_console_messages
```

---

## Contoh

Lihat output riset nyata di direktori contoh:

- [`docs/examples/guava-cut-cost/`](docs/examples/guava-cut-cost/) — Satu jalankan riset lengkap yang menyelidiki strategi pemotongan biaya untuk operasi pertanian jambu biji. Termasuk semua dokumen yang dihasilkan: research-report.docx, references.json, feasibility-study.docx, dan laporan sub-agen.

---

## Berkontribusi

Kontribusi diterima! Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan tentang:

- Melaporkan bug dan menyarankan fitur
- Menambahkan skill baru (ikuti pola Pocketto)
- Menambahkan sub-agen atau persona advisor baru
- Meningkatkan file CSV referensi (setiap metode harus bersumber)
- Kebijakan dokumentasi dwibahasa

---

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT — lihat [LICENSE](LICENSE) untuk detail.

---

## Ucapan Terima Kasih

- **[Pocketto](https://github.com/rfxlamia/pocketto)** — Arsitektur skill-based agent yang menginspirasi desain Cariak. Hard Gates, Phase pipelines, dan kurasi advisor LLM-to-LLM adalah semua pola Pocketto.
- **[OpenCode](https://github.com/sst/opencode)** — Framework agen coding AI yang menampung Cariak sebagai skills.
- **[Ekosistem MCP](https://modelcontextprotocol.io/)** — Model Context Protocol yang mendukung integrasi tools Cariak. Cariak berdiri di atas bahu para maintainer MCP server.
- **Komunitas Akademik & Open Source** — Setiap sumber yang disitir Cariak berasal dari peneliti, pengembang, dan penulis yang membagikan karya mereka secara terbuka.

---

<p align="center">
  <strong>Cariak v1.3.0</strong> — Riset mendalam. Tantang segalanya. Selalu bersumber.<br>
  <em>Research deep. Challenge everything. Cite always.</em>
</p>
