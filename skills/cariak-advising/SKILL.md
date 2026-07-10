---
name: cariak-advising
description: LLM-to-LLM counsel and second opinions. Use when a phase needs multi-perspective review before commitment, or when pitching/grinding explicitly calls for advisor counsel. Selects 3-5 personas from advisor-personas.csv and dispatches parallel counsel, then synthesizes contradictions and agreements. Trigger on "advise", "counsel", "second opinion", "get perspectives", "challenge this", "play devil's advocate", or when cariak-pitching Phase 3 or cariak-grinding invokes it. Can be called standalone or as a sub-routine of pitching/grinding.
---

# Advising

<!-- CARIAK SKILL: cariak-advising - v1.1 -->

### When to Use

- cariak-pitching Phase 3 (Advisor Counsel)
- cariak-grinding needs second opinions on refined research questions
- User asks for "second opinion", "devil's advocate", "challenge this direction"
- Before committing to a research spec

### Do NOT Use

- As substitute for actual research (advisors opine, don't gather data)
- When only 1-2 personas are relevant (minimum 3)
- After research is synthesized (use cariak-reflecting)
- When user wants a single authoritative answer

### Boundary Table

| Adjacent Skill | Boundary |
|---|---|
| cariak-pitching | Pitching calls advising in Phase 2d (ANTITHESIS) and Phase 3 (SYNTHESIS). Advising returns counsel; pitching owns converge decision. |
| cariak-grinding | Grinding calls advising in Phase 2.5 (ANTITHESIS). Advising returns counsel; grinding owns the spec. |
| cariak-planning | Planning calls advising after task decomposition (ANTITHESIS). Advising returns counsel; planning owns the plan. |
| cariak-researching | Researching calls advising per sub-agent finding (ANTITHESIS). Advising runs in parallel across findings. |
| cariak-synthesizing | Synthesizing calls advising after cross-source merge (ANTITHESIS). Advising returns identified contradictions. |
| cariak-validating | Validating calls advising for each claim (ANTITHESIS). Advising actively attempts to falsify grade-A claims. |
| cariak-reflecting | Reflecting calls advising after quality assessment (ANTITHESIS). Advising identifies what was NOT researched. |
| cariak-closing | Closing verifies every phase had its advisor gate passed. |

### Hard Gates

- **GATE 0: MINIMUM 3 PERSONAS** — HARD STOP if fewer than 3 selected from advisor-personas.csv
- **GATE 1: ALL COUNSEL MUST CITE OR STATE OPINION** — Either cite source/prior finding, or prefix with "OPINION:"
- **GATE 2: CONTRADICTIONS MUST BE SURFACED** — If advisors disagree, synthesis must explicitly call out disagreement. Averaging contradictory advice is FORBIDDEN.

### Phase 0: Preflight

1. Determine invoking context:
   - cariak-pitching: read pitch exploration draft and problem statement
   - cariak-grinding: read research-spec draft and research questions
   - Standalone: ask user what needs counsel
2. Check memory MCP for prior advisor sessions: `memory_search_nodes(query: "advisor counsel [topic]")`
3. Load advisor-personas.csv to enumerate available personas
4. Confirm artifact under review with user

**Gate 0 Check:** If artifact is empty, HARD STOP.

### Phase 1: Select Personas

Criteria: diversity of expertise, risk profile (≥1 risk-seeking + ≥1 risk-averse), relevance to topic.

Steps:
1. Parse advisor-personas.csv (name, expertise, perspective, risk_profile, description)
2. Select 3-5 personas. Default: 1 domain expert, 1 methodologist, 1 skeptic/devil's advocate, 1 practitioner (if applicable), 1 ethicist/contrarian (if warranted)
3. Present selection to user: "Selected counselors: [names]. Add, remove, or proceed?"

**Gate 0 Check (again):** Confirm ≥3 personas.

### Phase 2: Dispatch Parallel Counsel

For each persona, construct a counsel prompt:
1. Adopt persona's voice, expertise, risk profile
2. Provide artifact as context
3. Ask persona to: identify strongest aspect, weakest aspect/blind spot, one unconsidered question, recommendation (proceed/revise/abandon) with reasoning
4. Instruct persona to cite sources or mark claims as opinion (Gate 1)

Dispatch ALL counsel requests in a single parallel call. Sequential dispatch risks context leakage.

**Gate 1 Enforcement:** Scan each response for uncited claims. Re-dispatch if found.

### Phase 3: Collect & Synthesize

```
## Advisor Counsel Synthesis
### Points of Agreement
- [point] — cited by Persona A, Persona B

### Points of Contradiction
- **Contradiction:** On [topic]
  - Persona A: "[quote]"
  - Persona B: "[quote]"
  - Analysis: [why they disagree, what would resolve]

### Unique Insights (raised by one persona)
- Persona C: [insight] — relevance: [why it matters]

### Recommendations Summary
| Persona | Verdict | Confidence |
|---|---|---|

### Net Recommendation
[Weigh reasoning strength, not vote count]
```

**Gate 2 Enforcement:** Every contradiction must appear. Zero contradictions with ≥3 personas is suspicious.

### Phase 4: Present Counsel Summary

1. Present synthesis to user (standalone) or return to invoking phase (sub-routine)
2. If standalone, offer options: (1) Incorporate and iterate, (2) Proceed to next phase, (3) Save and stop
3. If sub-routine, embed in parent artifact as "## Advisor Counsel" section

### Phase 5: Persist Counsel

1. Write counsel synthesis to `docs/cariak/spec/YYYY-MM-DD-slug/advisor-counsel.md` (standalone/pitching) or embed in parent artifact (sub-routine)
2. Store in memory MCP: `memory_create_entities` for each unique insight (ResearchInsight), `memory_create_relations` linking to ResearchProject

### Reference Triggers

| Trigger | Location | Action |
|---|---|---|
| `references/advisor-personas.csv` | Phase 1 | Enumerate and select personas |
| `references/advisor-phase-mapping.csv` | Phase 1 | Phase → advisor → challenge mapping |
| `references/brainstorming-methods.csv` | Phase 2 (pitching context) | Divergent framing reference |
| `references/citation-standards.csv` | Phase 2 (Gate 1) | Validate citation format |

### Handoff

- **Auto-invoke:** If called by cariak-pitching Phase 3 or cariak-grinding, embed synthesis in parent artifact, return control
- **User-driven:** If standalone, present 3-option menu
