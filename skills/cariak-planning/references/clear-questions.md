<!-- CARIAK TEMPLATE: clarify-questions - v1.1 -->

# Clarify Gate — Question Bank

> Used by: cariak-pitching Phase 1 (Clarify Gate)
> Purpose: Surface ambiguity before research begins
> Lenses: Business, Developer, QA

---

## How to Use

1. Pitching agent selects relevant questions from this bank based on the initial brief.
2. Questions are presented to the user (or inferred if user is unavailable).
3. Answers feed into the Context Scan section of the pitch brief.
4. Unanswered questions become Open Questions in pitch-brief-template.md.

---

## Business Lens

### B1: Who is the primary end user?

- **Question:** Who is the primary end user or beneficiary of this solution, and what is their current workflow?
- **Purpose:** Establishes the user persona and context, ensuring research addresses real needs rather than assumed ones. Prevents building for a phantom user.

### B2: What does success look like in business terms?

- **Question:** What specific business outcome would make this project a clear success (e.g., revenue, cost reduction, time saved)?
- **Purpose:** Anchors research priorities to measurable business value. Distinguishes "nice to know" from "must know" research questions.

### B3: What is the competitive landscape?

- **Question:** Are there existing solutions or competitors addressing this problem, and what differentiates our approach?
- **Purpose:** Prevents redundant research. Identifies gaps in existing solutions that research should explore. Avoids reinventing known approaches.

### B4: What is the budget and timeline constraint?

- **Question:** What are the hard constraints on budget, timeline, and resources for both research and implementation?
- **Purpose:** Bounds the scope of research. Determines whether deep multi-source research is feasible or whether a rapid evidence scan is more appropriate.

---

## Developer Lens

### D1: What are the hard technical constraints?

- **Question:** What technology stack, platform, or integration constraints must the solution adhere to?
- **Purpose:** Prevents research from exploring technically infeasible directions. Ensures findings are actionable within the existing architecture.

### D2: What data is available?

- **Question:** What data sources, APIs, datasets, or internal systems are available for this research and eventual implementation?
- **Purpose:** Determines whether research can be evidence-based or must rely on external sources. Identifies data gaps early.

### D3: What is the expected scale?

- **Question:** What is the expected scale (users, data volume, requests/sec, geographic reach) the solution must handle?
- **Purpose:** Ensures research considers performance and scalability dimensions. Different scale regimes may lead to fundamentally different architectural recommendations.

### D4: What existing systems will this interact with?

- **Question:** What existing systems, services, or workflows will this solution interact with, and are there known integration pain points?
- **Purpose:** Identifies dependency risks and integration constraints that research must account for. Prevents recommendations that conflict with existing architecture.

---

## QA Lens

### Q1: How will correctness be defined and measured?

- **Question:** How will we define and measure that the solution is "correct" or "working as intended"?
- **Purpose:** Establishes acceptance criteria for research findings. Ensures research outputs are falsifiable and verifiable, not just plausible narratives.

### Q2: What are the failure modes and risks?

- **Question:** What are the most likely failure modes, edge cases, or risks that research should investigate?
- **Purpose:** Directs research toward refutation-seeking and risk assessment rather than purely confirmatory findings. Ensures critical risks are surfaced early.

### Q3: What compliance or regulatory requirements apply?

- **Question:** Are there regulatory, compliance, privacy, or security requirements that constrain the solution space?
- **Purpose:** Prevents research from recommending non-compliant approaches. Identifies legal feasibility dimensions that must be validated.

### Q4: What is the rollback or fallback plan?

- **Question:** If the recommended approach fails or underperforms, what is the fallback or rollback plan?
- **Purpose:** Ensures research considers alternative paths and doesn't over-commit to a single direction. Research should surface contingency options, not just primary recommendations.

---

## Notes

- Select a minimum of **6 questions** (at least 2 per lens) for any pitching session.
- Questions marked as answered should have their answers recorded in the pitch brief's Context Scan.
- Questions that remain unanswered after Clarify Gate become **Open Questions** and may trigger additional research rounds.
