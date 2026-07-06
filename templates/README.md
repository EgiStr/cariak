# Cariak Templates

Templates come in two formats:

| Format | Purpose | Extension |
|--------|---------|-----------|
| **DOCX** (primary) | Professional McKinsey/BCG-grade reports with cover page, headers, footers, styled tables, and inline citations | `.docx` (generated) |
| **Markdown** (fallback) | Plain text representation for consumers that cannot process DOCX | `.md` |

## Generating DOCX

```bash
npx cariak-pi report --template <name> --input <references.json> --output <output.docx>
```

If no `--template` is specified, defaults to `research-report`.

## Template Names (12)

| # | Template Name | Description |
|---|---------------|-------------|
| 1 | `research-report` | Core synthesized research report (default) |
| 2 | `prd` | Product Requirements Document |
| 3 | `tech-spec` | Technical Specification |
| 4 | `adr` | Architecture Decision Record |
| 5 | `competitive-analysis` | Competitive Analysis Report |
| 6 | `risk-register` | Risk Register |
| 7 | `literature-review` | Literature Review |
| 8 | `experiment-design` | Experiment Design |
| 9 | `implementation-roadmap` | Implementation Roadmap |
| 10 | `research-proposal` | Research Proposal |
| 11 | `feasibility-study` | Feasibility Study (TELOS) |
| 12 | `technical-report` | Technical Report (long-form) |
| 13 | `recommendation-report` | Recommendation Report |

### Example

```bash
# Generate a PRD from research data
npx cariak-pi report --template prd --input docs/cariak/synthesized/2026-07-06-guava/references.json --output guava-prd.docx

# Generate a competitive analysis
npx cariak-pi report --template competitive-analysis --input market-data.json --output competitive-analysis.docx

# JSON output mode
npx cariak-pi report --template research-report --input references.json --json
```

## Markdown Fallback Files

The `.md` files in this directory are fallback templates. Each `.md` template starts with:

```html
<!-- PRIMARY OUTPUT: .docx (generated via npx cariak-pi report). This .md is a fallback. -->
```

DOCX generation uses the `docx` npm package (v9.7.1) internally. The markdown templates serve as structural references and are used when a DOCX renderer is unavailable.
