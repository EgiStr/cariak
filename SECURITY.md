# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| < 1.1.0 | :x:                |

We release patches for security vulnerabilities in the latest minor version only.
Users on older versions should upgrade to the latest 1.1.x release.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, send a detailed report to the project maintainer via email or private
disclosure. Include as much information as possible:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Affected versions
- Any potential mitigations you've identified

### Response Timeline

- **Acknowledge receipt**: within 48 hours of your report
- **Update on investigation**: within 7 days of acknowledgement
- **Resolution**: target within 30 days, depending on complexity

If the vulnerability is confirmed, we will:

1. Develop and test a fix
2. Release a patch version
3. Publish a security advisory on GitHub
4. Credit the reporter (unless you request anonymity)

### No Bounties

CARIAK is an open-source community project maintained by volunteers. We do not
offer monetary bounties for vulnerability disclosures. We deeply appreciate
responsible disclosure and will publicly credit reporters in our security
advisories.

## Scope

The security policy covers:

- **Skill definitions** (`skills/` directory) — pipeline orchestration logic
- **CLI tool** (`cli/`) — command-line interface and pipeline runner
- **Templates** (`templates/`) — output document templates
- **Reference data** (`references/`) — bundled reference CSVs and configs

### Out of Scope

- **MCP tools** — Model Context Protocol tools are user-provided. CARIAK
  dispatches to them but does not control their security posture. Ensure your
  MCP server configurations follow their own security best practices.
- **Third-party agents or models** — any external LLM or agent service that
  CARIAK connects to is outside our control.

## Best Practices for Users

- Review MCP server configurations before running any CARIAK pipeline
- Run CARIAK in an isolated or sandboxed environment when processing untrusted
  research sources
- Keep your CARIAK installation updated to the latest patch version
- Do not embed secrets (API keys, tokens) in skill definitions or templates —
  use environment variables instead
