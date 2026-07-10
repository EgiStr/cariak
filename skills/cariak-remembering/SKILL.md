---
name: cariak-remembering
description: Persistent memory and session management across the research lifecycle. Use at the start/end of any phase, or on "remember", "save session", "resume research", "what did we find", "load project". Manages the ResearchProject entity graph (projects, artifacts, sessions, insights, decisions, gaps) via the memory MCP. Trigger on "cariak remember", "save session", "resume research", "load project", or when any phase needs to recall prior context.
---

# cariak-remembering

<!-- CARIAK SKILL: cariak-remembering - v1.1 -->

### When to Use / Do NOT Use

Use: start/end of any phase, "resume research"/"load project", new session with prior work, phase produces decision/insight/gap.
Skip: standalone research activity, replacing file artifacts, storing raw data, long-term archival.

### Boundary Table

| Skill | Before | After |
|---|---|---|
| cariak-pitching | Loads context | Stores pitch doc |
| cariak-grinding | Loads pitch | Stores spec |
| cariak-planning | Loads spec | Stores plan |
| cariak-researching | Loads plan | Stores findings |
| cariak-synthesizing | Loads findings | Stores report |
| cariak-validating | Loads report | Stores verdict |
| cariak-reflecting | Loads all artifacts | Stores reflection |
| cariak-advising | Loads context | Stores counsel |

### Hard Gates

**GATE 0:** Preflight must scan memory MCP before any read/write. If MCP unavailable → warn user, proceed statelessly.
**GATE 1:** Every ResearchArtifact must have valid file path on disk.
**GATE 2:** Relations must be bidirectional. Orphan entities flagged.
**GATE 3:** Search before create. Same slug → merge, don't duplicate.

### Entity Model

1. **ResearchProject** — root. Fields: name, slug, topic, status, created, last_updated, confidence_score, slug_path
2. **ResearchArtifact** — file pointer. Fields: path, type, phase, created, sources_count, confidence
3. **ResearchSession** — interaction. Fields: project_id, phase, timestamp, summary, user_intent
4. **ResearchInsight** — learned fact. Fields: project_id, insight_text, source_refs, confidence, phase_origin
5. **ResearchDecision** — choice. Fields: project_id, decision_text, rationale, timestamp, phase_origin
6. **ResearchGap** — gap. Fields: project_id, gap_description, priority, status, identified_in_phase

### Relations

ResearchProject → HAS_ARTIFACT/SESSION/PRODUCED_INSIGHT/MADE_DECISION/HAS_GAP → respective entities. ResearchArtifact → PRODUCED_BY → ResearchSession. ResearchInsight → DERIVED_FROM → ResearchArtifact. ResearchGap → IDENTIFIED_IN → ResearchArtifact.

### Phase 0: Preflight

Check MCP availability. Search for existing ResearchProject. Load entity graph. If none → prepare to create. Identify invoking phase.

### Phase 1: Context Recall

Open project + related nodes via `memory_open_nodes`. Build summary: name, topic, status, dates, prior artifacts, top insights, active decisions, open gaps, recommended next phase.

### Phase 2: Store Artifact

Identify output, verify file exists (GATE 1), create/update ResearchArtifact (path, type, phase, created, sources_count, confidence), link HAS_ARTIFACT.

### Phase 3: Store Insights

Extract key insights. **Also store advisor challenge outputs (ANTITHESIS) as ResearchInsight** with `advisor_phase: true` for cross-phase bias tracking. Create entity + relations PRODUCED_INSIGHT, DERIVED_FROM.

### Phase 4: Store Decisions

Extract decisions (scope changes, method choices, pivots). Create ResearchDecision + MADE_DECISION.

### Phase 5: Store Gaps

Identify gaps. Create ResearchGap + HAS_GAP.

### Phase 6: Update Project Status

Set status to next phase, last_updated, confidence_score.

### Phase 7: Handoff

Summary: "Project [name] — Status: [phase]. Stored: [X artifacts, Y insights, Z decisions, W gaps]. Resume: 'cariak resume [slug]'"

### Resume Protocol

Search memory for slug → load graph → read latest artifact → present context → "Resume from [phase]?"

### Graceful Degradation

MCP unavailable → log warning, operate statelessly via file-based context. Do NOT fail invoking skill. Offer backfill when MCP returns.

### Reference Triggers

| Trigger | Action |
|---|---|
| Phase start/end | Load / store context |
| "remember this" | ResearchInsight (user attribution) |
| "save session" | ResearchSession |
| "resume research" / "load [slug]" | Resume Protocol |
| "what did we find" | Load & summarize insights |
| Contradiction | ResearchGap, priority high |
| Decision made | ResearchDecision |
