# Contributing to Cariak / Berkontribusi ke Cariak

Thank you for your interest in contributing to Cariak! This document guides you through the process.

Terima kasih atas minat Anda berkontribusi ke Cariak! Dokumen ini memandu Anda melalui prosesnya.

---

## How to Contribute / Cara Berkontribusi

There are many ways to contribute to Cariak:

Ada banyak cara untuk berkontribusi ke Cariak:

| Contribution Type | Tipe Kontribusi | How / Cara |
|---|---|---|
| **Report bugs** | Laporkan bug | Open a GitHub Issue with reproduction steps |
| **Suggest features** | Sarankan fitur | Open a GitHub Issue with the `feature-request` label |
| **Add skills** | Tambah skill | Follow the Skill Structure below, submit a PR |
| **Add sub-agents** | Tambah sub-agen | Add a new researcher to the `researching` skill |
| **Improve references** | Tingkatkan referensi | Add sourced methods to the CSV files |
| **Improve docs** | Tingkatkan dokumen | Fix typos, add examples, translate |
| **Test & report** | Uji & laporkan | Run Cariak on real research tasks, report gaps |

---

## Development Setup / Persiapan Development

### Prerequisites / Prasyarat

- [OpenCode](https://github.com/sst/opencode) installed and configured
- MCP servers configured: `web-search-mcp`, `paper-search-mcp`, `tavily`, `memory`, `playwright`
- Git

### Steps / Langkah

1. **Fork & clone / Fork & clone**
   ```bash
   git clone https://github.com/EgiStr/cariak.git
   cd cariak
   ```

2. **Create a branch / Buat branch**
   ```bash
   git checkout -b feature/my-new-skill
   ```

3. **Link to OpenCode / Tautkan ke OpenCode**
   Add the local clone path to your OpenCode skills config so changes are picked up immediately.

4. **Test your changes / Uji perubahan Anda**
   Run a research session triggering the skill you modified. Verify outputs in `docs/cariak/`.

5. **Verify the Iron Law / Verifikasi Hukum Besi**
   Ensure no unsourced claims appear in any output. Every claim must have a `[n]` citation mapping to `references.json`.

---

## Skill Structure / Struktur Skill

Cariak skills follow the [Pocketto](https://github.com/rfxlamia/pocketto) pattern. Each skill is a single-responsibility unit with a defined input/output contract and optional Hard Gate.

Skill Cariak mengikuti pola [Pocketto](https://github.com/rfxlamia/pocketto). Setiap skill adalah unit dengan satu tanggung jawab, kontrak input/output yang jelas, dan Hard Gate opsional.

### Anatomy of a Skill / Anatomi Skill

```
skills/
  my-new-skill/
    skill.md          ← Skill definition (trigger, description, instructions)
    input.md          ← Input contract (what the skill expects)
    output.md         ← Output contract (what the skill produces)
    gate.md           ← (Optional) Hard Gate criteria
```

### `skill.md` Template

```markdown
---
name: my-new-skill
description: >
  One-sentence description of what this skill does.
  Satu kalimat deskripsi apa yang dilakukan skill ini.
triggers:
  - "my new skill"
  - "skill baru ku"
phase: 7  # Position in the pipeline (1-9)
language: bilingual  # id | en | bilingual
---

# My New Skill

## Responsibility / Tanggung Jawab
Single clear statement of what this skill does.

## Input
- Previous skill output: `previous-output.md`
- User language preference

## Process
1. Step one
2. Step two
3. Step three

## Output
- `my-output.md` — description of output

## Hard Gate (if applicable)
- [ ] Criterion 1
- [ ] Criterion 2
```

### Rules for New Skills / Aturan untuk Skill Baru

1. **Single responsibility** — One skill, one job. If you need to do two things, make two skills.
2. **Defined contract** — Every skill must declare its input and output.
3. **Bilingual** — All skill content must support both Indonesian and English.
4. **Pipeline position** — Specify where in the 9-skill pipeline your skill sits. If inserting between existing skills, update the downstream skills' input contracts.
5. **No unsourced claims** — If a skill produces claims, they must be sourced. Iron Law applies to skills too.

---

## Reference Files / File Referensi

Cariak includes CSV reference files in `references/` that catalog research methods, search strategies, and source taxonomies. These are used by skills to guide research execution.

Cariak menyertakan file CSV referensi di `references/` yang mengkatalogkan metode riset, strategi pencarian, dan taksonomi sumber. Ini digunakan oleh skill untuk memandu eksekusi riset.

### CSV Structure / Struktur CSV

Each CSV file follows this pattern:

```csv
method_id,method_name,description,source_type,source_url,confidence_tier
M001,"Systematic keyword search","Search using multiple query variations","web","https://example.com/method",High
M002,"Snowball sampling","Follow citation chains from seed papers","academic","https://example.com/snowball",High
```

### Rules for Adding Methods / Aturan untuk Menambah Metode

1. **Every method must have a source** — The `source_url` field is mandatory. Methods without sources violate the Iron Law and will be rejected in review.
2. **Real sources only** — Use actual URLs to papers, documentation, or methodology guides. Do not fabricate sources.
3. **Confidence tier** — Assign one of: `High`, `Medium`, `Low` based on the source's authority and the method's evidence base.
4. **Bilingual descriptions** — If possible, provide descriptions in both languages. At minimum, English is required.
5. **Unique method_id** — Use the pattern `M###` with sequential numbering per file.

### Existing Reference Files / File Referensi yang Ada

| File | Purpose / Tujuan |
|---|---|
| `references/search-methods.csv` | Web and social search methodologies |
| `references/academic-search-methods.csv` | Academic database search strategies |
| `references/source-taxonomy.csv` | Source type classification and trust scoring |
| `references/confidence-rubric.csv` | Confidence tier assignment criteria |
| `references/citation-format.csv` | Citation and reference formatting rules |
| `references/bias-checklist.csv` | Bias detection checklist for validation |

---

## Pull Request Process / Proses Pull Request

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/my-contribution
   ```

2. **Make your changes** following the guidelines above.

3. **Test thoroughly**:
   - Run a complete Cariak research session
   - Verify all outputs are generated correctly
   - Check the Iron Law: no unsourced claims
   - Test in both Indonesian and English

4. **Update documentation** if needed:
   - If adding a skill: update the Skill Reference table in `README.md` and `README.id.md`
   - If adding a sub-agent: update the Sub-Agent table
   - If adding a document output: update the Document Outputs table
   - Update `CHANGELOG.md` under `[Unreleased]`

5. **Commit with a clear message**:
   ```bash
   git commit -m "feat: add market-trends sub-agent to researching skill"
   ```

   Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation only
   - `refactor:` code restructuring
   - `chore:` maintenance

6. **Open a Pull Request** against `main`. Include:
   - Summary of changes
   - Which skill(s) or file(s) are affected
   - Test results (link to or paste a sample research output)
   - Confirmation that the Iron Law is satisfied

7. **Address review feedback** — Reviewers will check for:
   - Pocketto pattern compliance
   - Iron Law compliance (all claims sourced)
   - Bilingual support
   - Documentation updates

---

## Code of Conduct / Kode Etik

### Our Pledge / Janji Kami

We are committed to making Cariak a welcoming and inclusive project for everyone. We pledge to:

Kami berkomitmen membuat Cariak proyek yang ramah dan inklusif untuk semua. Kami berjanji untuk:

- **Be respectful** — Treat all contributors with respect, regardless of experience level.
- **Be constructive** — Provide helpful, actionable feedback in reviews.
- **Be collaborative** — Work together toward better research tooling.
- **Be honest** — Never fabricate sources, claims, or research results. The Iron Law applies to contributors too.

### Unacceptable Behavior / Perilaku yang Tidak Dapat Diterima

- Harassment, discrimination, or personal attacks
- Fabricating sources or research results
- Plagiarism — always attribute ideas to their origin
- Spam or off-topic contributions

Violations should be reported via GitHub Issues (private reports can email the maintainer).

---

## Bilingual Policy / Kebijakan Dwibahasa

Cariak is a bilingual project (Indonesian + English). The policy is:

Cariak adalah proyek dwibahasa (Indonesia + Inggris). Kebijakannya adalah:

| Layer | Language | Kebijakan |
|---|---|---|
| **Code & skill files** | English (canonical) | All skill definitions, prompts, and logic in English. English is the canonical source of truth. |
| **Skill content** | Bilingual | Skills must support both ID and EN output. Use `language: bilingual` in frontmatter. |
| **Documentation** | Dual files | `README.md` (EN canonical) + `README.id.md` (ID translation). Both must stay in sync. |
| **Comments** | English | Code comments in English for accessibility. |
| **Issues & PRs** | Either | Contributors may write in ID or EN. Maintainers will respond in the same language. |
| **Changelog** | English | `CHANGELOG.md` in English for consistency. |

### Translation Guidelines / Pedoman Terjemahan

1. **EN is canonical** — When in conflict, the English version is authoritative.
2. **Natural translation** — Translate naturally, not literally. Indonesian should read as natural Bahasa Indonesia.
3. **Technical terms** — Keep technical terms in English where common in Indonesian tech context (e.g., "skill", "pipeline", "gate", "sub-agent").
4. **Sync both files** — When updating documentation, update both `README.md` and `README.id.md` in the same PR.

---

## Questions? / Pertanyaan?

Open a GitHub Issue with the `question` label, and we'll help you out.

Buka GitHub Issue dengan label `question`, dan kami akan membantu Anda.

---

<p align="center">
  <em>Cariak is built on the shoulders of Pocketto, OpenCode, and the MCP ecosystem.</em><br>
  <em>Cariak dibangun di atas bahu Pocketto, OpenCode, dan ekosistem MCP.</em>
</p>
