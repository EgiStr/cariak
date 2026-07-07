# Changelog

## [1.3.1] - 2026-07-07

### Added
- Structural research method registry: `references/structural-research-methods.csv` and `.md`.
- Engineering Lens Canvas for technical grinding: first principles, field practice, architecture, data, metrics, failure modes, tradeoffs, alternatives, unknowns.
- Implementation Evidence Plan in planning/researching: repos, docs, benchmarks, datasets, model cards, standards, patents, commercial products, field deployments.
- Expert Technical Report structure in synthesizing and `templates/technical-report.md`.
- Technical report quality audit in reflecting: implementation actionability, alternatives, failure modes, roadmap.
- Documentation: `docs/structural-research-methods.md`, README/README.id references.

### Changed
- Pitching now loads structural method references before handoff.
- Grinding/planning/researching/synthesizing/validating/reflecting/closing now each declares its structural method.

All notable changes to Cariak will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Additional sub-agents (patent researcher, regulatory researcher)
- Multi-language expansion beyond ID + EN
- Cariak CLI for standalone execution outside OpenCode
- Research session comparison and diffing

---

## [1.3.0] - 2026-07-06

### Added
- **Dialectic advisor at every phase** — 7 independent advisor personas challenge every pipeline output (THESIS → ANTITHESIS → SYNTHESIS)
- **7 advisor persona sub-agents**: Devil's Advocate, Methodologist + Skeptic, System Architect, Domain Expert (×5 rotated), Contradiction Hunter, Falsificationist (Popper-style), Blind Spot Auditor
- `references/advisor-phase-mapping.csv` — complete persona rotation table with challenge questions and output contracts
- `advisor_phase` observations on `ResearchSession` memory entities — full audit trail of every advisor challenge
- `advisors/` directory with 7 SKILL.md files, one per advisor persona
- `npx cariak-pi report` CLI command for DOCX generation with template routing
- Planning phase artifact: `research-plan.md` is now properly generated and documented
- Anti-bias architecture documentation — explains why self-critique fails and how independent sub-agents prevent confirmation bias
- `"Why This Architecture?"` section in README explaining the dialectic approach
- `"Core Philosophy"` / `"Filosofi Inti"` section in English and Indonesian READMEs

### Changed
- **Pipeline redesigned**: Former `advising` skill merged into dialectic advisor architecture. Advisor personas now run as independent sub-agents at every phase (Pitching, Grinding, Planning, Researching, Synthesizing, Validating, Reflecting), not as a single standalone phase.
- **Primary output format**: DOCX (professional-grade) via `npx cariak-pi report --template research-report`. MD format retained as fallback via `--format md`.
- Skill count updated from 9 to 8 (advising absorbed into advisor gates)
- Pipeline diagrams updated in all documentation to show advisor gates at each phase
- Skill Reference tables now include "Key Advisor" / "Advisor Kunci" column
- **ARCHITECTURE.md** major update: added full "Dialectic Advisor Pattern" section, advisor persona rotation table, updated memory model with ResearchSession and AdvisorPhase entities, updated document generation flow to show DOCX primary path
- **llms.txt** updated: version, pipeline with advisors, DOCX output format, install commands for v1.3.0
- Banner badges and all version references updated from v1.1.0 / v1.2.0 to v1.3.0
- Output documents table: all entries updated to show `.docx` as primary, `.md` as fallback
- Example session in READMEs expanded to show advisor interactions at every phase

### Fixed
- Planning phase now properly documented with research-plan.md artifact
- Test fixes across the pipeline for advisor gate integration

---

## [1.2.0] - 2026-07-06
### Added
- `.skill` bundle builder (`npx cariak-pi bundle`) — package skills into distributable ZIP archives
- Codex plugin manifest (`.codex-plugin/codex.json`)
- Cursor plugin manifest (`.cursor-plugin/cursor.json`)
- Per-skill `references/` directories with copies of shared references
### Changed
- Bumped version to 1.2.0

## [1.1.0] - 2026-07-06

### Added
- **9 skills**: pitching, grinding, advising, planning, researching, synthesizing, validating, reflecting, remembering
- **5 sub-agents**: internet researcher, social researcher, academic researcher, news researcher, market researcher
- **12 on-demand document templates**: PRD, tech-spec, ADR, competitive-analysis, risk-register, literature-review, experiment-design, feasibility-study, implementation-roadmap, research-proposal, technical-report, recommendation-report
- **2 always-on outputs**: research-report.md, references.json
- **6 CSV reference files** with sourced methods:
  - `references/search-methods.csv`
  - `references/academic-search-methods.csv`
  - `references/source-taxonomy.csv`
  - `references/confidence-rubric.csv`
  - `references/citation-format.csv`
  - `references/bias-checklist.csv`
- **Bilingual support** (Indonesian + English) across all skills, prompts, and outputs
- **Memory MCP integration** with 6 entity types: ResearchProject, ResearchQuestion, Source, Finding, Claim, Advisor
- **Auto-reflection quality gate** — the `reflecting` skill evaluates source coverage, bias, and confidence grading
- **Iron Law enforcement** — no claim without source, enforced at the `validating` skill gate
- **Pocketto-inspired architecture** — Hard Gates, Phase pipelines, LLM-to-LLM advisor curation
- **Example research output**: `docs/examples/guava-cut-cost/` — complete feasibility study with all generated documents
- Project documentation: README.md, README.id.md, CONTRIBUTING.md, architecture.md

### MCP Dependencies
- `web-search-mcp` — web search, page extraction, social platform search
- `paper-search-mcp` — academic paper search and full-text extraction (20+ repositories)
- `tavily` — AI-powered web research, site crawling, content extraction
- `memory` — persistent entity-relation knowledge graph
- `playwright` — browser automation for dynamic/JS-rendered pages

---

## Version History / Riwayat Versi

| Version | Date | Summary |
|---|---|---|
| 1.3.0 | 2026-07-06 | Dialectic advisor architecture — 7 personas challenge every phase. DOCX primary output. Anti-bias by design. |
| 1.2.0 | 2026-07-06 | Bundle builder, Codex/Cursor plugin manifests, per-skill reference directories |
| 1.1.0 | 2026-07-06 | Initial public release with 9 skills, 5 sub-agents, 14 document outputs |
