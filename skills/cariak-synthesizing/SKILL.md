---
name: cariak-synthesizing
description: Resolve multiple research findings into a coherent, cited, confidence-graded report. Use AFTER cariak-researching when 6 sub-agent findings files exist. Cross-references sources, deduplicates, resolves contradictions, generates research-report.docx (primary DOCX output) + research-report.md (plain text fallback) + references.json, and computes a confidence score. Trigger on "synthesize", "compile research", "merge findings", or when cariak-researching hands off with 6 findings files.
---

# Synthesizing

<!-- CARIAK SKILL: cariak-synthesizing - v1.1 -->

### When to Use

- cariak-researching produced 6 findings files and handed off
- User says "synthesize", "compile research", "merge findings"
- Re-research loop completed, new synthesis needed
- Generate final report from existing findings

### Do NOT Use

- Fewer than 6 findings files exist (return to cariak-researching)
- No research spec (needs spec to map findings to questions)
- User wants validation (use cariak-validating after synthesis)
- User wants quick summary (just ask for brief)

### Boundary Table

| Skill | Relationship | Rule |
|---|---|---|
| cariak-researching | Upstream | Provides 6 findings files |
| cariak-validating | Downstream | Consumes report for claim refutation |
| cariak-reflecting | Downstream (alt) | May receive synthesis if validation skipped |
| cariak-planning | Feedback loop | May trigger re-planning if gap found |

### Hard Gates

**GATE 0: All 6 findings must exist.** Verify all files in `docs/cariak/research/YYYY-MM-DD-slug/`. If any missing → STOP, invoke cariak-researching.

**GATE 1: No claim without source.** Every assertion must have inline citation `[N]` mapping to references.json. Uncited → mark as `[UNSOURCED]` and flag.

**GATE 2: Contradictions must be explicitly resolved.** Both sides cited, named explicitly, explained (methodology/timing/definition difference). If unresolvable → state "unresolved" and lower confidence. Averaging/hiding is FORBIDDEN.

**GATE 2.5: Advisor Contradiction Challenge mandatory (ANTITHESIS) before final report.** Contradiction Hunter + Devil's Advocate must hunt for missed contradictions, cherry-picking, forced narratives.

### Phase 0: Preflight

1. Check Memory MCP for project context and research plan
2. Verify all 6 findings files exist (GATE 0)
3. Load research-spec.md for RQs
4. Load references/citation-standards.csv
5. Create output dir: `docs/cariak/synthesized/YYYY-MM-DD-slug/`

### Phase 1: Load 6 Findings

Per findings file: parse structure, extract claims with citations, build internal claim registry:

```
claim_id | source_subagent | claim_text | citation_id | source_url | confidence_note
```

Extract all unique sources into preliminary bibliography.

### Phase 2: Cross-reference & Deduplicate

**Source dedup:** Group by URL, merge duplicates.
**Claim dedup:** Group by semantic similarity, merge into single claim with multiple supporting citations. Track contributing sub-agents.
**Cross-referencing:** Map each claim to RQ from spec. Flag claims not mapping to any RQ as off-topic.

### Phase 3: Resolve Contradictions

For each RQ, examine all claims. Classify contradictions:
- Factual: Source A says X, Source B says ¬X
- Methodological: Different methods yield different results
- Temporal: Different time periods disagree
- Definitional: Different definitions of same term

Resolution: present both sides with citations, analyze why (methodology/timing/definition/bias), note lean if evidence stronger. If unresolvable, mark as "unresolved" and reduce confidence.

### Phase 3.5: Advisor Contradiction Challenge (ANTITHESIS)

1. Dispatch Contradiction Hunter + Devil's Advocate via cariak-advising (different model/persona)
2. Advisor hunts for: missed contradictions, cherry-picking, forced narratives, weak-evidence RQs
3. Advisor MUST cite specific sources for every contradiction claimed
4. Output feeds back into Phase 3 — resolve any newly found contradictions before Phase 4

**Gate 2.5 check:** Advisor challenge executed BEFORE writing final report.

### Phase 4: Generate Report

Primary: DOCX (via `npx cariak-pi report --template research-report`)
Fallback: MD

Structure:
```markdown
# Research Report: [Topic]
**Confidence Score:** [X.XX]

## Executive Summary

## Research Questions Answered
### RQ-1: [Question]
**Finding:** [synthesized answer]
**Evidence:** [Claim] [1], [Claim] [2,3]
**Contradictions:** [both sides]
**Confidence:** [0.0-1.0]

## Expert Technical Deep Dive (technical topics)
### First-Principles Explanation
### State of the Art
### Methods Used in the Field
### Method Comparison Matrix
| Method | Accuracy | Data | Cost | Latency | Complexity | Risk |
### Recommended Architecture
### Implementation Roadmap
### Data Strategy
### Evaluation Protocol
### Failure Modes & Mitigations
### Build-vs-Buy Options
### Gaps / Unknowns / Required Experiments

## Contradictions & Resolutions

## Source Diversity
- Internet: [N], Social: [N], Academic: [N], News: [N], Market: [N]

## Gaps Identified

## References
```

Write: `docs/cariak/synthesized/YYYY-MM-DD-slug/research-report.docx` and `research-report.md`

### Phase 5: Generate references.json

Machine-readable citation database with id, type, title, authors, url, published_date, accessed_date, subagents_citing, reliability_tier.

Write to: `docs/cariak/synthesized/YYYY-MM-DD-slug/references.json`

### Phase 6: Compute Confidence Score

```
confidence = (source_diversity * 0.25) + (source_count * 0.20) + (contradiction_penalty * 0.20) + (citation_coverage * 0.20) + (recency * 0.15)
```

Per-RQ confidence: based on sources addressing it (min 3 for > 0.5), contradiction resolution, source diversity.

### Phase 7: Handoff

Present: paths to report.docx, report.md, references.json, confidence score, contradiction count, gaps.

Options: 1. Validate findings → cariak-validating [RECOMMENDED], 2. Reflect → cariak-reflecting, 3. Save and stop.

Auto-invoke: if confidence ≥ 0.7 and no unresolved contradictions → cariak-validating behind confirmation. If < 0.7 → recommend cariak-reflecting.

Memory: store ResearchArtifact (report), ResearchInsight (key findings), ResearchGap (unresolved gaps).

### Reference Triggers

| File | Phase | Purpose |
|---|---|---|
| references/citation-standards.csv | 4, 5 | Citation format |
| references/synthesis-template.md | 2, 3 | Structure template |
| research-spec.md | 0, 1 | RQs for mapping |
| 6 findings files | 1 | Source claims |
| Memory MCP | 0, 7 | Context and artifact storage |
