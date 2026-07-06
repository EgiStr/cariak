# Changelog

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
### Changed
- Primary output format changed from .md to .docx (professional-grade)
- cariak-synthesizing generates DOCX via `npx cariak-pi report`
- .md templates retained as fallback only
### Added
- `npx cariak-pi report` CLI command for DOCX generation
- Support for 13 document templates in DOCX format
- `templates/README.md` documenting dual-format template system
### Fixed
- Planning phase now properly documented with research-plan.md artifact

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
| 1.1.0 | 2026-07-06 | Initial public release with 9 skills, 5 sub-agents, 14 document outputs |
