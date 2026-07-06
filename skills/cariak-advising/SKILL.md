---
name: cariak-advising
description: LLM-to-LLM counsel and second opinions. Use when a phase needs multi-perspective review before commitment, or when pitching/grinding explicitly calls for advisor counsel. Selects 3-5 personas from advisor-personas.csv and dispatches parallel counsel, then synthesizes contradictions and agreements. Trigger on "advise", "counsel", "second opinion", "get perspectives", "challenge this", "play devil's advocate", or when cariak-pitching Phase 3 or cariak-grinding invokes it. Can be called standalone or as a sub-routine of pitching/grinding.
---

# Advising / Penasihat

<!-- CARIAK SKILL: cariak-advising - v1.1 -->

## English

### Core Principle

> "A single perspective is a blind spot. Counsel widens the view before commitment."

The advisor skill exists because any single LLM perspective — including CARIAK's own — contains implicit biases shaped by training data, context window, and recent prompts. By dispatching the same problem to multiple distinct personas (each with different expertise, risk tolerance, and worldview), we surface blind spots, contradictions, and opportunities that no single perspective would produce.

### When to Use

- cariak-pitching Phase 3 (Advisor Counsel) explicitly calls this skill.
- cariak-grinding needs second opinions on refined research questions.
- The user asks for a "second opinion", "devil's advocate", or "challenge this direction."
- A research direction feels too narrow or too broad and needs stress-testing.
- Before committing to a research spec (pre-commitment review).

### Do NOT Use

- As a substitute for actual research. Advisors opine; they do not gather new data.
- When only 1-2 personas are relevant — the minimum is 3 for meaningful diversity.
- After research has already been synthesized — use cariak-reflecting instead for post-hoc review.
- If the user wants a single authoritative answer — counseling produces perspectives, not verdicts.

### Boundary Table

| Adjacent Skill | Boundary |
|---|---|
| cariak-pitching | Pitching calls advising in Phase 2d (ANTITHESIS: Devil's Advocate challenge) and Phase 3 (SYNTHESIS: multi-persona counsel). Advising returns counsel; pitching owns the converge decision. |
| cariak-grinding | Grinding calls advising in Phase 2.5 (ANTITHESIS: Methodologist granularity check). Advising returns counsel; grinding owns the spec. |
| cariak-planning | Planning calls advising after task decomposition (ANTITHESIS: System Architect coverage check). Advising returns counsel; planning owns the plan. |
| cariak-researching | Researching calls advising per sub-agent finding (ANTITHESIS: Domain Expert review). Advising runs in parallel across findings. |
| cariak-synthesizing | Synthesizing calls advising after cross-source merge (ANTITHESIS: Contradiction Hunter challenge). Advising returns identified contradictions. |
| cariak-validating | Validating calls advising for each claim (ANTITHESIS: Falsificationist challenge). Advising actively attempts to falsify grade-A claims. |
| cariak-reflecting | Reflecting calls advising after quality assessment (ANTITHESIS: Blind Spot Auditor). Advising identifies what was NOT researched. |
| cariak-closing | Closing verifies that EVERY phase had its advisor gate passed before allowing close. |

### How Other Cariak Skills Use Advising — The Dialectic Advisor Pattern

Every Cariak phase follows a THESIS → ANTITHESIS → SYNTHESIS dialectic where the **ANTITHESIS step is always a dispatch to this advisor skill** with a specific persona. The advisor is a different model/persona — never self-critique. The advisor must cite sources for their challenges (Iron Law: no claim without source).

See the persona rotation table in `references/advisor-phase-mapping.csv` for the full mapping of phase → thesis output → advisor persona → challenge type.

| Phase | Thesis | Advisor Persona | What Advisor Challenges |
|---|---|---|---|
| Pitching | Brainstorm results | Devil's Advocate + Domain Expert | "Are you asking the right question? What assumptions are untested?" |
| Grinding | GWT research spec draft | Methodologist + Skeptic | "Are these GWT scenarios testable? Are they granular enough? What edge cases are missing?" |
| Planning | Task decomposition | System Architect + Ops Reviewer | "Are tasks truly independent? Hidden dependencies? Can each task complete in <10 min?" |
| Researching | Per-sub-agent findings | Domain Expert (rotated per topic) | "Is this finding biased? What sources contradict it? What's the confidence?" |
| Synthesizing | Cross-source merge | Contradiction Hunter + Devil's Advocate | "Where do sources disagree? What's being cherry-picked? What narrative is being forced?" |
| Validating | Claim verification | Falsificationist (Popper-style) | "How would you PROVE this wrong? What evidence would flip the verdict?" |
| Reflecting | Quality assessment | Blind Spot Auditor | "What did we NOT research? What source types are missing? What's the weakest finding?" |

### Hard Gates

- **GATE 0: MINIMUM 3 PERSONAS SELECTED** — Fewer than 3 personas provides no meaningful diversity. HARD STOP if fewer than 3 are selected from advisor-personas.csv. The skill MUST refuse to proceed and prompt the user to add more.
- **GATE 1: ALL COUNSEL MUST CITE SOURCES OR EXPLICITLY STATE OPINION** — Every advisor response must either (a) cite a source, prior finding, or reference document, or (b) explicitly prefix the claim with "OPINION:". Uncited assertions without this prefix are rejected and the advisor is re-prompted.
- **GATE 2: CONTRADICTIONS MUST BE SURFACED, NOT HIDDEN** — If two or more advisors disagree, the synthesis MUST explicitly call out the disagreement with both perspectives quoted. Averaging contradictory advice into a bland middle is FORBIDDEN.

### Phase 0: Preflight

**Purpose:** Establish what is being counseled and from what context.

Steps:
1. Determine the invoking context:
   - If called by cariak-pitching: read the current pitch exploration draft and problem statement.
   - If called by cariak-grinding: read the research-spec draft and research questions.
   - If called standalone: ask the user what they want counseled on.
2. Check memory MCP for prior advisor sessions on this topic:
   - `memory_search_nodes(query: "advisor counsel [topic]")`
   - If prior counsel exists, surface it: "Previous counsel on this topic was given on [date]. Revisit or refresh?"
3. Load advisor-personas.csv to enumerate available personas.
4. Confirm the artifact under review with the user:
   - "I will seek counsel on: [problem statement / research questions]. Correct?"

**Gate 0 Check:** If the artifact under review is empty or undefined, HARD STOP. Ask the user to provide the artifact first.

### Phase 1: Select Personas

**Purpose:** Choose 3-5 personas whose perspectives will meaningfully differ.

Selection criteria:
- **Diversity of expertise**: e.g., a domain expert, a methodologist, a skeptic, a practitioner, an ethicist.
- **Diversity of risk profile**: at least one risk-seeking and one risk-averse persona.
- **Relevance to topic**: personas should have distinct angles on the problem.

Steps:
1. Parse advisor-personas.csv to list available personas with their attributes:
   - `name`: persona identifier
   - `expertise`: domain(s) of expertise
   - `perspective`: worldview / analytical lens
   - `risk_profile`: risk-seeking, neutral, or risk-averse
   - `description`: when to select this persona
2. Select 3-5 personas. Default selection logic:
   - 1 domain expert (deep knowledge of the topic area)
   - 1 methodologist (research design, rigor, methodology)
   - 1 skeptic / devil's advocate (challenges assumptions)
   - 1 practitioner (applied/industry perspective) if applicable
   - 1 ethicist or contrarian if the topic warrants
3. Present the selection to the user:
   - "Selected counselors: [persona names with one-line descriptions]. Add, remove, or proceed?"

**Gate 0 Check (again):** Confirm ≥3 personas before proceeding.

### Phase 2: Dispatch Parallel Counsel

**Purpose:** Send the same artifact to each persona and collect independent responses.

For each selected persona, construct a counsel prompt:
1. Adopt the persona's voice, expertise, and risk profile.
2. Provide the artifact (problem statement or research questions) as context.
3. Ask the persona to:
   - Identify the strongest aspect of the proposal.
   - Identify the weakest aspect or biggest blind spot.
   - Raise one question the proposer has not considered.
   - Give a recommendation: proceed, revise, or abandon — with reasoning.
4. Instruct the persona to cite sources or explicitly mark claims as opinion (Gate 1).

Dispatch all counsel requests in a single parallel call (one message, multiple tool invocations). This ensures independent perspectives — sequential dispatch risks later personas being influenced by earlier ones leaking into context.

**Gate 1 Enforcement:** As each response returns, scan for uncited claims. If a claim has no source and no "OPINION:" prefix, re-dispatch to that persona with: "Your claim '[X]' has no source. Either cite a source or prefix with 'OPINION:'."

### Phase 3: Collect & Synthesize

**Purpose:** Compare counsel responses and surface agreements, contradictions, and unique insights.

Synthesis structure:

```
## Advisor Counsel Synthesis

### Points of Agreement
- [Agreed point 1] — cited by Persona A, Persona B
- [Agreed point 2] — cited by Persona C, Persona D

### Points of Contradiction
- **Contradiction 1:** On [topic]
  - Persona A says: "[quote]"
  - Persona B says: "[quote]"
  - Analysis: [why they disagree, what would resolve it]

### Unique Insights (raised by only one persona)
- Persona C raised: [insight] — relevance: [why it matters]

### Recommendations Summary
| Persona | Verdict | Confidence |
|---|---|---|
| A | Proceed | High |
| B | Revise | Medium |
| C | Abandon | Low |

### Net Recommendation
[Synthesized recommendation — NOT a simple majority vote. Weigh the strength of reasoning, not the count.]
```

**Gate 2 Enforcement:** Every contradiction must appear in "Points of Contradiction" with both quotes. If synthesis has zero contradictions despite ≥3 personas, flag this as suspicious — true unanimity is rare. Re-examine for suppressed disagreement.

### Phase 4: Present Counsel Summary

**Purpose:** Deliver the synthesis to the user or invoking phase.

Output format:
1. Present the synthesis to the user (if standalone) or return it to the invoking phase (if sub-routine).
2. If standalone, ask the user:
   - "How would you like to proceed?"
   - Options: (1) Incorporate counsel and iterate, (2) Proceed to next phase with counsel noted, (3) Save counsel and stop.
3. If called as sub-routine by pitching/grinding, embed the synthesis in the parent artifact:
   - In pitch-exploration.md: add as "## Advisor Counsel" section.
   - In research-spec.md: add as "## Advisor Counsel" section.

### Phase 5: Persist Counsel

**Purpose:** Store counsel for future reference.

Steps:
1. Write the counsel synthesis to:
   - `docs/cariak/spec/YYYY-MM-DD-slug/advisor-counsel.md` (if standalone or pitching context)
   - Embedded in parent artifact (if sub-routine)
2. Store key insights in memory MCP:
   - `memory_create_entities` for each unique insight with `entityType: "ResearchInsight"`, `observations: [insight, source_refs, confidence]`.
   - `memory_create_relations` linking insights to the ResearchProject entity.

### Reference Triggers

| Trigger | Location | Action |
|---|---|---|
| `references/advisor-personas.csv` | Phase 1 | Load to enumerate and select personas |
| `references/advisor-phase-mapping.csv` | Phase 1 | Full mapping of phase → thesis → advisor persona → challenge type |
| `../../references/brainstorming-methods.csv` | Phase 2 (if pitching context) | Reference for divergent framing |
| `../../references/citation-standards.csv` | Phase 2 (Gate 1) | Validate citation format in counsel responses |

### Handoff

- **Option A (auto-invoke):** If called by cariak-pitching Phase 3 or cariak-grinding, embed the synthesis in the parent artifact and return control to the invoking phase.
- **Option B (user-driven):** If standalone, present the 3-option menu to the user:
  1. Incorporate counsel and iterate on the artifact.
  2. Proceed to next phase (grinding or planning) with counsel noted.
  3. Save counsel and stop.

---

## Bahasa Indonesia

---
name: cariak-advising
description: Nasihat LLM-ke-LLM dan pendapat kedua. Gunakan ketika sebuah fase membutuhkan tinjauan multi-perspektif sebelum komitmen, atau ketika pitching/grinding secara eksplisit memanggil advisor. Memilih 3-5 persona dari advisor-personas.csv dan mengirim nasihat paralel, lalu mensintesis kontradiksi dan kesepakatan. Trigger pada "advise", "counsel", "second opinion", "get perspectives", "challenge this", "play devil's advocate", atau ketika cariak-pitching Phase 3 atau cariak-grinding memanggilnya. Dapat dipanggil mandiri atau sebagai sub-rutin dari pitching/grinding.
---

### Prinsip Inti

> "Satu perspektif adalah titik buta. Nasihat memperluas pandangan sebelum komitmen."

Skill advisor ada karena setiap perspektif LLM tunggal — termasuk CARIAK sendiri — mengandung bias implisit yang dibentuk oleh data pelatihan, jendela konteks, dan prompt terbaru. Dengan mengirim masalah yang sama ke multiple persona berbeda (masing-masing dengan keahlian, toleransi risiko, dan worldview berbeda), kita mengungkap titik buta, kontradiksi, dan peluang yang tidak akan dihasilkan oleh satu perspektif pun.

### Kapan Digunakan

- cariak-pitching Phase 3 (Advisor Counsel) secara eksplisit memanggil skill ini.
- cariak-grinding membutuhkan pendapat kedua pada pertanyaan riset yang sudah diperhalus.
- Pengguna meminta "second opinion", "devil's advocate", atau "challenge this direction."
- Arah riset terasa terlalu sempit atau terlalu luas dan perlu diuji.
- Sebelum commit ke spec riset (tinjauan pre-commitment).

### JANGAN Digunakan

- Sebagai pengganti riset aktual. Advisor beropini; mereka tidak mengumpulkan data baru.
- Ketika hanya 1-2 persona yang relevan — minimum 3 untuk keberagaman yang bermakna.
- Setelah riset disintesis — gunakan cariak-reflecting untuk tinjauan post-hoc.
- Jika pengguna ingin satu jawaban otoritatif — counseling menghasilkan perspektif, bukan putusan.

### Tabel Batasan

| Skill Terkait | Batasan |
|---|---|
| cariak-pitching | Pitching memanggil advising di Phase 3. Advising mengembalikan nasihat; pitching memiliki keputusan converge. |
| cariak-grinding | Grinding memanggil advising untuk menguji pertanyaan riset. Advising mengembalikan nasihat; grinding memiliki spec. |
| cariak-reflecting | Reflecting meninjau kualitas post-riset. Advising meninjau framing masalah pre-commitment. |
| cariak-validating | Validating mencari penyangkalan terhadap temuan. Advising mencari perspektif pada masalah/arah. |

### Hard Gates

- **GATE 0: MINIMUM 3 PERSONA DIPILIH** — Kurang dari 3 persona tidak memberikan keberagaman yang bermakna. HARD STOP jika kurang dari 3 dipilih dari advisor-personas.csv. Skill HARUS menolak melanjutkan dan meminta pengguna menambah.
- **GATE 1: SEMUA NASIHAT HARUS MENYITIR SUMBER ATAU MENYATAKAN OPINI SECARA EKSPLISIT** — Setiap respons advisor harus (a) menyitir sumber, temuan sebelumnya, atau dokumen referensi, atau (b) secara eksplisit memberi prefiks klaim dengan "OPINION:". Klaim tanpa sitiran dan tanpa prefiks ini ditolak dan advisor di-prompt ulang.
- **GATE 2: KONTRADIKSI HARUS DIUNGKAP, BUKAN DISEMBUNYIKAN** — Jika dua atau lebih advisor tidak setuju, sintesis HARUS secara eksplisit menyoroti ketidaksetujuan dengan kedua perspektif dikutip. Mencampur nasihat kontradiktif menjadi jalan tengah yang hambar DILARANG.

### Phase 0: Preflight

**Tujuan:** Menetapkan apa yang dinasihati dan dari konteks apa.

Langkah:
1. Tentukan konteks pemanggilan:
   - Jika dipanggil cariak-pitching: baca draft pitch exploration dan problem statement saat ini.
   - Jika dipanggil cariak-grinding: baca draft research-spec dan pertanyaan riset.
   - Jika mandiri: tanyakan pengguna apa yang ingin dinasihati.
2. Periksa memory MCP untuk sesi advisor sebelumnya pada topik ini:
   - `memory_search_nodes(query: "advisor counsel [topic]")`
   - Jika nasihat sebelumnya ada, tampilkan: "Nasihat sebelumnya pada topik ini diberikan pada [tanggal]. Tinjau ulang atau segarkan?"
3. Muat advisor-personas.csv untuk enumerasi persona yang tersedia.
4. Konfirmasi artifact yang ditinjau dengan pengguna:
   - "Saya akan mencari nasihat pada: [problem statement / pertanyaan riset]. Benar?"

**Cek Gate 0:** Jika artifact yang ditinjau kosong atau tidak terdefinisi, HARD STOP. Minta pengguna menyediakan artifact terlebih dahulu.

### Phase 1: Pilih Persona

**Tujuan:** Memilih 3-5 persona yang perspektifnya akan berbeda secara bermakna.

Kriteria seleksi:
- **Keberagaman keahlian**: misalnya, ahli domain, ahli metodologi, skeptik, praktisi, etikus.
- **Keberagaman profil risiko**: setidaknya satu persona risk-seeking dan satu risk-averse.
- **Relevansi dengan topik**: persona harus memiliki sudut pandang berbeda pada masalah.

Langkah:
1. Parse advisor-personas.csv untuk mendaftar persona yang tersedia dengan atributnya:
   - `name`: identifikasi persona
   - `expertise`: domain keahlian
   - `perspective`: worldview / lensa analitis
   - `risk_profile`: risk-seeking, neutral, atau risk-averse
   - `description`: kapan memilih persona ini
2. Pilih 3-5 persona. Logika seleksi default:
   - 1 ahli domain (pengetahuan mendalam area topik)
   - 1 ahli metodologi (desain riset, rigor, metodologi)
   - 1 skeptik / devil's advocate (menantang asumsi)
   - 1 praktisi (perspektif terapan/industri) jika relevan
   - 1 etikus atau kontrarian jika topik memerlukan
3. Tunjukkan seleksi kepada pengguna:
   - "Konselor terpilih: [nama persona dengan deskripsi satu baris]. Tambah, hapus, atau lanjut?"

**Cek Gate 0 (lagi):** Konfirmasi ≥3 persona sebelum melanjutkan.

### Phase 2: Kirim Nasihat Paralel

**Tujuan:** Mengirim artifact yang sama ke setiap persona dan mengumpulkan respons independen.

Untuk setiap persona terpilih, susun prompt nasihat:
1. Adopsi voice, keahlian, dan profil risiko persona.
2. Berikan artifact (problem statement atau pertanyaan riset) sebagai konteks.
3. Minta persona untuk:
   - Identifikasi aspek terkuat dari proposal.
   - Identifikasi aspek terlemah atau titik buta terbesar.
   - Ajukan satu pertanyaan yang belum dipertimbangkan pengusul.
   - Berikan rekomendasi: lanjut, revisi, atau batalkan — dengan alasan.
4. Instruksikan persona untuk menyitir sumber atau menandai klaim secara eksplisit sebagai opini (Gate 1).

Kirim semua permintaan nasihat dalam satu panggilan paralel (satu pesan, multiple tool invocation). Ini memastikan perspektif independen — dispatch berurutan berisiko persona berikutnya dipengaruhi oleh yang sebelumnya bocor ke konteks.

**Penegakan Gate 1:** Saat setiap respons kembali, pindai klaim tanpa sitiran. Jika klaim tidak punya sumber dan tidak ada prefiks "OPINION:", kirim ulang ke persona tersebut: "Klaim Anda '[X]' tidak punya sumber. Sitir sumber atau beri prefiks 'OPINION:'."

### Phase 3: Kumpulkan & Sintesis

**Tujuan:** Membandingkan respons nasihat dan mengungkap kesepakatan, kontradiksi, dan wawasan unik.

Struktur sintesis:

```
## Sintesis Nasihat Advisor

### Poin Kesepakatan
- [Poin disepakati 1] — disitir oleh Persona A, Persona B
- [Poin disepakati 2] — disitir oleh Persona C, Persona D

### Poin Kontradiksi
- **Kontradiksi 1:** Pada [topik]
  - Persona A berkata: "[kutipan]"
  - Persona B berkata: "[kutipan]"
  - Analisis: [mengapa mereka tidak setuju, apa yang akan menyelesaikannya]

### Wawasan Unik (hanya diangkat satu persona)
- Persona C mengangkat: [wawasan] — relevansi: [mengapa penting]

### Ringkasan Rekomendasi
| Persona | Putusan | Keyakinan |
|---|---|---|
| A | Lanjut | Tinggi |
| B | Revisi | Sedang |
| C | Batalkan | Rendah |

### Rekomendasi Bersih
[Rekomendasi sintesis — BUKAN voting mayoritas sederhana. Timbang kekuatan argumentasi, bukan jumlah.]
```

**Penegakan Gate 2:** Setiap kontradiksi harus muncul di "Poin Kontradiksi" dengan kedua kutipan. Jika sintesis memiliki nol kontradiksi meskipun ≥3 persona, flag ini sebagai mencurigakan — kesepakatan sejati jarang terjadi. Periksa ulang untuk ketidaksetujuan yang ditekan.

### Phase 4: Sajikan Ringkasan Nasihat

**Tujuan:** Mengantarkan sintesis kepada pengguna atau fase pemanggil.

Format output:
1. Sajikan sintesis kepada pengguna (jika mandiri) atau kembalikan ke fase pemanggil (jika sub-rutin).
2. Jika mandiri, tanyakan pengguna:
   - "Bagaimana Anda ingin melanjutkan?"
   - Opsi: (1) Integrasikan nasihat dan iterasi, (2) Lanjut ke fase berikutnya dengan nasihat dicatat, (3) Simpan nasihat dan berhenti.
3. Jika dipanggil sebagai sub-rutin oleh pitching/grinding, embed sintesis dalam artifact induk:
   - Di pitch-exploration.md: tambahkan sebagai bagian "## Advisor Counsel".
   - Di research-spec.md: tambahkan sebagai bagian "## Advisor Counsel".

### Phase 5: Simpan Nasihat

**Tujuan:** Menyimpan nasihat untuk referensi masa depan.

Langkah:
1. Tulis sintesis nasihat ke:
   - `docs/cariak/spec/YYYY-MM-DD-slug/advisor-counsel.md` (jika mandiri atau konteks pitching)
   - Embedded dalam artifact induk (jika sub-rutin)
2. Simpan wawasan kunci di memory MCP:
   - `memory_create_entities` untuk setiap wawasan unik dengan `entityType: "ResearchInsight"`, `observations: [wawasan, source_refs, confidence]`.
   - `memory_create_relations` menghubungkan wawasan ke entitas ResearchProject.

### Reference Triggers

| Trigger | Lokasi | Aksi |
|---|---|---|
| `references/advisor-personas.csv` | Phase 1 | Muat untuk enumerasi dan seleksi persona |
| `references/advisor-phase-mapping.csv` | Phase 1 | Pemetaan lengkap fase → tesis → persona advisor → tipe challenge |
| `../../references/brainstorming-methods.csv` | Phase 2 (jika konteks pitching) | Referensi untuk framing divergen |
| `../../references/citation-standards.csv` | Phase 2 (Gate 1) | Validasi format sitiran dalam respons nasihat |

### Handoff

- **Opsi A (auto-invoke):** Jika dipanggil oleh cariak-pitching Phase 3 atau cariak-grinding, embed sintesis dalam artifact induk dan kembalikan kontrol ke fase pemanggil.
- **Opsi B (user-driven):** Jika mandiri, sajikan menu 3 opsi kepada pengguna:
  1. Integrasikan nasihat dan iterasi pada artifact.
  2. Lanjut ke fase berikutnya (grinding atau planning) dengan nasihat dicatat.
  3. Simpan nasihat dan berhenti.
