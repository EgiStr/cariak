---
name: cariak-remembering
description: Persistent memory and session management across the research lifecycle. Use at the start/end of any phase, or on "remember", "save session", "resume research", "what did we find", "load project". Manages the ResearchProject entity graph (projects, artifacts, sessions, insights, decisions, gaps) via the memory MCP. Trigger on "cariak remember", "save session", "resume research", "load project", "ingat ini", "lanjutkan riset", "muat proyek", or when any phase needs to recall prior context.
---

# cariak-remembering / Mengingat-Cariak

<!-- CARIAK SKILL: cariak-remembering - v1.1 -->

## English

### Core Principle

> "Research is cumulative. What was learned today informs what is asked tomorrow. Forgetting is the most expensive bug in the system."

### When to Use

- At the **start of any phase** to load prior context
- At the **end of any phase** to persist artifacts and insights
- When the user says "resume research", "load project", "what did we find before"
- When a new research session begins and prior work may exist
- When a phase produces a decision, insight, or gap that future phases need
- When the user explicitly says "remember this" or "save session"

### Do NOT Use

- As a standalone research activity (it supports other skills)
- To replace file artifacts (memory is a graph index, files are the source of truth)
- To store raw research data (store summaries and pointers, not full text)
- For long-term archival (memory MCP is session-grade, not a database)

### Boundary Table

| Adjacent Skill        | Boundary                                                                   |
|-----------------------|----------------------------------------------------------------------------|
| cariak-pitching       | Remembering loads context BEFORE pitching; stores pitch doc AFTER          |
| cariak-grinding       | Remembering loads pitch BEFORE grinding; stores spec AFTER                 |
| cariak-planning       | Remembering loads spec BEFORE planning; stores plan AFTER                  |
| cariak-researching    | Remembering loads plan BEFORE research; stores findings AFTER              |
| cariak-synthesizing   | Remembering loads findings BEFORE synthesis; stores report AFTER           |
| cariak-validating     | Remembering loads report BEFORE validation; stores verdict AFTER           |
| cariak-reflecting     | Remembering loads all artifacts for reflection; stores reflection AFTER    |
| cariak-advising       | Remembering loads advisor context; stores counsel AFTER                    |

### Hard Gates

**GATE 0: PREFLIGHT MUST COMPLETE BEFORE ANY MEMORY OPERATION**
- The preflight phase MUST scan the memory MCP for existing entities related to the current project before any read or write.
- If memory MCP is unavailable, the skill MUST warn the user and proceed in stateless mode (graceful degradation).
- The skill MUST NOT silently skip memory operations — if memory is unavailable, the user MUST be informed.

**GATE 1: NO ENTITY WITHOUT A SOURCE ARTIFACT**
- Every `ResearchArtifact` entity MUST have a valid file path that exists on disk.
- The skill MUST NOT create artifact entities for files that do not exist.
- Every `ResearchInsight` and `ResearchDecision` MUST include source references.

**GATE 2: RELATIONS MUST BE BIDIRECTIONAL**
- When creating a relation (e.g., ResearchProject→ResearchArtifact), the skill MUST also create the inverse relation.
- Orphan entities (no relations) MUST be flagged for review.

**GATE 3: SEARCH BEFORE CREATE**
- Before creating any new entity, the skill MUST search memory for existing entities with the same name or topic.
- Duplicate entities MUST be merged, not created anew.
- The skill MUST NOT create a new ResearchProject if one with the same slug already exists.

### Entity Model

#### Entity Types

1. **ResearchProject**
   - Fields: `name`, `slug`, `topic`, `status` (pitching|grinding|planning|researching|synthesizing|validating|reflecting|completed|abandoned), `created`, `last_updated`, `confidence_score`, `slug_path`
   - The root entity for every research project.

2. **ResearchArtifact**
   - Fields: `path`, `type` (pitch|spec|plan|findings|report|references|validation|reflection), `phase`, `created`, `sources_count`, `confidence`
   - Points to a file on disk in `docs/cariak/`.

3. **ResearchSession**
   - Fields: `project_id`, `phase`, `timestamp`, `summary`, `user_intent`
   - A single interaction session within a phase.

4. **ResearchInsight**
   - Fields: `project_id`, `insight_text`, `source_refs` (array of citation IDs), `confidence` (0.0-1.0), `phase_origin`
   - A learned fact or conclusion worth carrying forward.

5. **ResearchDecision**
   - Fields: `project_id`, `decision_text`, `rationale`, `timestamp`, `phase_origin`
   - A choice made (e.g., "Narrowed scope to EU markets", "Chose qualitative method over quantitative").

6. **ResearchGap**
   - Fields: `project_id`, `gap_description`, `priority` (high|medium|low), `status` (open|addressed|wont_fix), `identified_in_phase`
   - A known gap in the research that should be addressed or acknowledged.

#### Relation Types

| From               | Relation          | To                 |
|--------------------|-------------------|--------------------|
| ResearchProject    | HAS_ARTIFACT      | ResearchArtifact   |
| ResearchProject    | HAS_SESSION       | ResearchSession    |
| ResearchProject    | PRODUCED_INSIGHT  | ResearchInsight    |
| ResearchProject    | MADE_DECISION     | ResearchDecision   |
| ResearchProject    | HAS_GAP           | ResearchGap        |
| ResearchArtifact   | PRODUCED_BY       | ResearchSession    |
| ResearchInsight    | DERIVED_FROM      | ResearchArtifact   |
| ResearchGap        | IDENTIFIED_IN     | ResearchArtifact   |

### Phase 0: Preflight

**Actions:**

1. Check memory MCP availability (call `memory_search_nodes` with a test query).
2. If available, search for existing `ResearchProject` entities matching the current topic or slug.
3. Load the project entity graph (all related artifacts, sessions, insights, decisions, gaps).
4. If no project exists, prepare to create one.
5. Identify the current phase context (which skill invoked remembering).

**Preflight Output:**

```
Project: [name or "NEW"]
Slug: [slug or "TBD"]
Status: [current phase or "UNINITIALIZED"]
Existing Artifacts: [count and list]
Existing Insights: [count]
Existing Gaps: [count]
Memory MCP: [AVAILABLE | UNAVAILABLE]
```

### Phase 1: Context Recall (if project exists)

**Actions:**

1. Open the project node and all related nodes via `memory_open_nodes`.
2. Build a context summary:

```
## Project Context Loaded

**Project:** [name]
**Topic:** [topic]
**Status:** [phase]
**Created:** [date]
**Last Updated:** [date]

### Prior Artifacts
- [artifact type]: [path] (confidence: [score])

### Key Insights (top 5)
- [insight text] (confidence: [score])

### Active Decisions
- [decision text]

### Open Gaps
- [gap description] (priority: [level])

### Recommended Next Phase
Based on status "[current]", the next phase is: [next_phase]
```

3. Present this context to the invoking skill or user.

### Phase 2: Store Session Artifact

**Actions:**

1. Identify what was produced in the current session (pitch doc, spec, plan, findings, report, etc.).
2. Verify the file exists on disk (GATE 1).
3. Create or update the `ResearchArtifact` entity:

```json
{
  "name": "artifact-[slug]-[type]-[date]",
  "entityType": "ResearchArtifact",
  "observations": [
    "path: docs/cariak/[subdir]/[date]-[slug]/[filename]",
    "type: [pitch|spec|plan|findings|report|references|validation|reflection]",
    "phase: [phase_name]",
    "created: [ISO timestamp]",
    "sources_count: [number]",
    "confidence: [score or 'N/A']"
  ]
}
```

4. Create relation: `ResearchProject → HAS_ARTIFACT → ResearchArtifact`

### Phase 3: Store Insights

**Actions:**

1. Extract key insights from the current session (ask the invoking skill or parse the artifact).
2. For each insight, create a `ResearchInsight` entity:

```json
{
  "name": "insight-[slug]-[sequential_id]",
  "entityType": "ResearchInsight",
  "observations": [
    "project_id: [project_name]",
    "insight_text: [the insight]",
    "source_refs: [citation IDs]",
    "confidence: [0.0-1.0]",
    "phase_origin: [phase_name]"
  ]
}
```

3. Create relation: `ResearchProject → PRODUCED_INSIGHT → ResearchInsight`
4. Create relation: `ResearchInsight → DERIVED_FROM → ResearchArtifact`

### Phase 4: Store Decisions

**Actions:**

1. Extract decisions made during the session (scope changes, method choices, direction pivots).
2. For each decision, create a `ResearchDecision` entity:

```json
{
  "name": "decision-[slug]-[sequential_id]",
  "entityType": "ResearchDecision",
  "observations": [
    "project_id: [project_name]",
    "decision_text: [the decision]",
    "rationale: [why]",
    "timestamp: [ISO]",
    "phase_origin: [phase_name]"
  ]
}
```

3. Create relation: `ResearchProject → MADE_DECISION → ResearchDecision`

### Phase 5: Store Gaps

**Actions:**

1. Identify gaps discovered during the session (unanswered questions, missing sources, contradictions).
2. For each gap, create a `ResearchGap` entity:

```json
{
  "name": "gap-[slug]-[sequential_id]",
  "entityType": "ResearchGap",
  "observations": [
    "project_id: [project_name]",
    "gap_description: [what's missing]",
    "priority: [high|medium|low]",
    "status: open",
    "identified_in_phase: [phase_name]"
  ]
}
```

3. Create relation: `ResearchProject → HAS_GAP → ResearchGap`

### Phase 6: Update Project Status

**Actions:**

1. Update the `ResearchProject` entity:
   - Set `status` to the current or next phase.
   - Set `last_updated` to current timestamp.
   - Update `confidence_score` if a new one was computed.
2. Add observation: `last_action: [description of what was stored]`

### Phase 7: Context Handoff

**Actions:**

1. Produce a handoff summary:

```
## Memory Update Complete

**Project:** [name]
**Updated Status:** [phase]
**Stored:**
- Artifacts: [count]
- Insights: [count]
- Decisions: [count]
- Gaps: [count] ([open] open)

**Next Phase:** [recommended next skill]
**Resume Command:** "cariak resume [slug]"
```

2. The invoking skill receives this summary and proceeds.

### Resume Protocol

When the user says "resume research" or "load project [slug]":

1. Search memory for `ResearchProject` with matching slug.
2. Load the full entity graph.
3. Read the most recent artifact to understand current state.
4. Present the context summary (Phase 1).
5. Ask: "Resume from [current_phase]? (Y/n)" or offer to jump to a specific phase.

### Graceful Degradation

If memory MCP is unavailable:
- Log a warning: `⚠️ Memory MCP unavailable. Operating in stateless mode.`
- Continue with file-based context only (read prior artifacts from `docs/cariak/`).
- Do NOT fail the invoking skill — remembering is a support function.
- When memory becomes available again, offer to backfill entities from file artifacts.

### Reference Triggers

| Trigger                        | When                                  | Action                                                    |
|--------------------------------|---------------------------------------|-----------------------------------------------------------|
| Phase start                    | Any skill begins                      | Load project context from memory                          |
| Phase end                      | Any skill produces artifact           | Store artifact, insights, decisions, gaps                 |
| "remember this"                | User says "remember"                  | Store as ResearchInsight with user attribution            |
| "save session"                 | User says "save"                      | Store ResearchSession with full summary                   |
| "resume research"              | User says "resume"                    | Execute Resume Protocol                                   |
| "load project [slug]"          | User says "load"                      | Execute Resume Protocol for specific slug                 |
| "what did we find"             | User asks about prior work            | Load and summarize insights from memory                   |
| Contradiction detected         | Synthesizing/validating finds conflict | Store as ResearchGap with priority: high                 |
| Decision made                  | Any phase makes a directional choice  | Store as ResearchDecision                                 |

---

## Bahasa Indonesia

### Prinsip Inti

> "Riset bersifat kumulatif. Apa yang dipelajari hari ini memberi tahu apa yang ditanyakan besok. Lupa adalah bug termahal dalam sistem."

### Kapan Digunakan

- Di **awal fase apa pun** untuk memuat konteks sebelumnya
- Di **akhir fase apa pun** untuk menyimpan artifact dan wawasan
- Saat pengguna mengatakan "lanjutkan riset", "muat proyek", "apa yang kami temukan sebelumnya"
- Saat sesi riset baru dimulai dan pekerjaan sebelumnya mungkin ada
- Saat sebuah fase menghasilkan keputusan, wawasan, atau celah yang dibutuhkan fase berikutnya
- Saat pengguna secara eksplisit mengatakan "ingat ini" atau "simpan sesi"

### JANGAN Digunakan

- Sebagai aktivitas riset mandiri (ini mendukung skill lain)
- Untuk menggantikan artifact file (memori adalah indeks graf, file adalah sumber kebenaran)
- Untuk menyimpan data riset mentah (simpan ringkasan dan penunjuk, bukan teks penuh)
- Untuk pengarsipan jangka panjang (memory MCP adalah tingkat sesi, bukan database)

### Tabel Batasan

| Skill Terkait       | Batasan                                                                    |
|----------------------|----------------------------------------------------------------------------|
| cariak-pitching      | Remembering memuat konteks SEBELUM pitching; menyimpan pitch doc SESUDAH   |
| cariak-grinding      | Remembering memuat pitch SEBELUM grinding; menyimpan spec SESUDAH          |
| cariak-planning      | Remembering memuat spec SEBELUM planning; menyimpan plan SESUDAH           |
| cariak-researching   | Remembering memuat plan SEBELUM research; menyimpan findings SESUDAH       |
| cariak-synthesizing  | Remembering memuat findings SEBELUM synthesis; menyimpan report SESUDAH    |
| cariak-validating    | Remembering memuat report SEBELUM validation; menyimpan verdict SESUDAH    |
| cariak-reflecting    | Remembering memuat semua artifact untuk reflection; menyimpan reflection SESUDAH |
| cariak-advising      | Remembering memuat konteks advisor; menyimpan counsel SESUDAH              |

### Hard Gates

**GATE 0: PREFLIGHT HARUS SELESAI SEBELUM OPERASI MEMORI APAPUN**
- Fase preflight HARUS memindai memory MCP untuk entitas yang ada sebelum membaca atau menulis.
- Jika memory MCP tidak tersedia, skill HARUS memperingatkan pengguna dan melanjutkan dalam mode stateless (degradasi graceful).
- Skill TIDAK BOLEH diam-diam melewati operasi memori — jika memori tidak tersedia, pengguna HARUS diberi tahu.

**GATE 1: TIDAK ADA ENTITAS TANPA ARTIFACT SUMBER**
- Setiap entitas `ResearchArtifact` HARUS memiliki path file yang valid di disk.
- Skill TIDAK BOLEH membuat entitas artifact untuk file yang tidak ada.
- Setiap `ResearchInsight` dan `ResearchDecision` HARUS menyertakan referensi sumber.

**GATE 2: RELASI HARUS BIDIREKSIONAL**
- Saat membuat relasi (mis. ResearchProject→ResearchArtifact), skill HARUS juga membuat relasi inverse.
- Entitas yatim (tanpa relasi) HARUS ditandai untuk ditinjau.

**GATE 3: CARI SEBELUM BUAT**
- Sebelum membuat entitas baru, skill HARUS mencari di memori untuk entitas yang ada dengan nama atau topik yang sama.
- Entitas duplikat HARUS digabung, tidak dibuat baru.
- Skill TIDAK BOLEH membuat ResearchProject baru jika satu dengan slug yang sama sudah ada.

### Model Entitas

#### Tipe Entitas

1. **ResearchProject** — Entitas akar untuk setiap proyek riset. Fields: name, slug, topic, status, created, last_updated, confidence_score, slug_path.

2. **ResearchArtifact** — Menunjuk ke file di `docs/cariak/`. Fields: path, type, phase, created, sources_count, confidence.

3. **ResearchSession** — Satu sesi interaksi dalam fase. Fields: project_id, phase, timestamp, summary, user_intent.

4. **ResearchInsight** — Fakta atau kesimpulan yang dipelajari. Fields: project_id, insight_text, source_refs, confidence, phase_origin.

5. **ResearchDecision** — Pilihan yang dibuat. Fields: project_id, decision_text, rationale, timestamp, phase_origin.

6. **ResearchGap** — Celah yang diketahui dalam riset. Fields: project_id, gap_description, priority, status, identified_in_phase.

#### Tipe Relasi

| Dari               | Relasi           | Ke                 |
|--------------------|------------------|--------------------|
| ResearchProject    | HAS_ARTIFACT     | ResearchArtifact   |
| ResearchProject    | HAS_SESSION      | ResearchSession    |
| ResearchProject    | PRODUCED_INSIGHT | ResearchInsight    |
| ResearchProject    | MADE_DECISION    | ResearchDecision   |
| ResearchProject    | HAS_GAP          | ResearchGap        |

### Fase 0: Preflight

Periksa ketersediaan memory MCP. Cari `ResearchProject` yang ada. Muat graf entitas proyek. Jika tidak ada proyek, siapkan untuk membuat. Identifikasi konteks fase saat ini.

### Fase 1: Recall Konteks (jika proyek ada)

Buka node proyek dan semua node terkait. Bangun ringkasan konteks dengan artifacts sebelumnya, insight kunci, keputusan aktif, celah terbuka, dan fase berikutnya yang direkomendasikan. Sajikan ke skill atau pengguna yang memanggil.

### Fase 2: Simpan Artifact Sesi

Identifikasi apa yang dihasilkan. Verifikasi file ada (GATE 1). Buat atau perbarui entitas `ResearchArtifact` dengan path, type, phase, created, sources_count, confidence. Buat relasi HAS_ARTIFACT.

### Fase 3: Simpan Insight

Ekstrak wawasan kunci. Untuk setiap insight, buat `ResearchInsight` dengan project_id, insight_text, source_refs, confidence, phase_origin. Buat relasi PRODUCED_INSIGHT dan DERIVED_FROM.

### Fase 4: Simpan Keputusan

Ekstrak keputusan yang dibuat (perubahan scope, pilihan metode, pivot arah). Buat `ResearchDecision` dengan decision_text, rationale, timestamp. Buat relasi MADE_DECISION.

### Fase 5: Simpan Celah

Identifikasi celah yang ditemukan (pertanyaan tidak terjawab, sumber hilang, kontradiksi). Buat `ResearchGap` dengan gap_description, priority, status: open. Buat relasi HAS_GAP.

### Fase 6: Perbarui Status Proyek

Perbarui entitas `ResearchProject`: set status ke fase saat ini atau berikutnya, perbarui last_updated, perbarui confidence_score jika ada yang baru. Tambahkan observasi last_action.

### Fase 7: Handoff Konteks

Hasilkan ringkasan handoff dengan proyek, status diperbarui, jumlah yang disimpan (artifacts, insights, decisions, gaps), fase berikutnya yang direkomendasikan, dan perintah resume.

### Protokol Resume

Saat pengguna mengatakan "lanjutkan riset" atau "muat proyek [slug]":
1. Cari memori untuk ResearchProject dengan slug yang cocok.
2. Muat graf entitas penuh.
3. Baca artifact terbaru untuk memahami status saat ini.
4. Sajikan ringkasan konteks.
5. Tanyakan: "Lanjutkan dari [fase_saat_ini]? (Y/n)"

### Degradasi Graceful

Jika memory MCP tidak tersedia: log peringatan, lanjutkan dengan konteks berbasis file saja, jangan gagalkan skill yang memanggil. Saat memori tersedia lagi, tawarkan untuk backfill entitas dari file artifact.

### Pemicu Referensi

| Pemicu                          | Kapan                                 | Aksi                                                     |
|---------------------------------|---------------------------------------|----------------------------------------------------------|
| Mulai fase                      | Skill apa pun dimulai                 | Muat konteks proyek dari memori                          |
| Akhir fase                      | Skill apa pun menghasilkan artifact   | Simpan artifact, insight, keputusan, celah               |
| "ingat ini"                     | Pengguna mengatakan "ingat"           | Simpan sebagai ResearchInsight                           |
| "simpan sesi"                   | Pengguna mengatakan "simpan"          | Simpan ResearchSession dengan ringkasan penuh            |
| "lanjutkan riset"               | Pengguna mengatakan "lanjutkan"       | Jalankan Protokol Resume                                 |
| "muat proyek [slug]"            | Pengguna mengatakan "muat"            | Jalankan Protokol Resume untuk slug tertentu             |
| "apa yang kami temukan"          | Pengguna bertanya tentang pekerjaan sebelumnya | Muat dan rangkum insight dari memori             |
| Kontradiksi terdeteksi          | Synthesizing/validating menemukan konflik | Simpan sebagai ResearchGap dengan priority: high     |
| Keputusan dibuat                | Fase apa pun membuat pilihan arah     | Simpan sebagai ResearchDecision                          |
