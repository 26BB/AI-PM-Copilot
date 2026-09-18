# Product Requirements Document: AI-PM Copilot

**Version:** 1.0  
**Author:** Bhushan Bhosale  
**Date:** September 2026  
**Status:** Active — MVP Scoping

---

## 1. Problem Statement

Product Managers at early-stage startups and growing tech companies spend **2–3 hours per PRD** on initial structuring alone. The majority of this time is not strategic thinking — it is mechanical formatting: translating a raw user complaint into a structured problem statement, writing a user story in the correct format, and estimating a RICE score from scratch.

This problem is acutely felt by:
- **Junior PMs / APMs** who are still building their PRD muscle memory
- **Founder's Office operators** who need to ship product briefs fast with no dedicated PM
- **Solo founders** running product and engineering simultaneously

User feedback exists in abundance — App Store reviews, G2 complaints, Twitter/X threads, Intercom tickets. The bottleneck is not *finding* feedback; it is *processing* it into actionable product artifacts quickly enough to stay competitive.

---

## 2. Target Personas

### Persona A: Arjun, 24 — APM at a Series A Fintech (Primary)
- **Context:** 8 months into his first PM role. Gets Slack messages from Customer Success with raw complaints daily.
- **Frustration:** Spends Sunday evenings structuring PRDs for Monday standups. Feels like a "fancy formatter."
- **Goal:** Spend his time on *strategy and stakeholder alignment*, not document scaffolding.
- **Behavior:** Already uses ChatGPT for rough drafts but has to re-prompt 5–6 times to get the format right.

### Persona B: Priya, 29 — Founder's Office at a YC-backed Startup (Secondary)
- **Context:** Reports directly to the CEO. Wears 4 hats. Has no dedicated PM.
- **Frustration:** Product briefs take her 3 hours. She has 3 other fires burning simultaneously.
- **Goal:** Get a "good enough" product brief out in 20 minutes so the engineering team can start scoping.
- **Behavior:** Would pay for a tool that saves her 2 hours per week.

---

## 3. Goals

1. Reduce time-to-first-PRD-draft from ~2.5 hours to **under 15 minutes**.
2. Produce consistent, structured output that follows PM best practices.
3. Be **live-demo-able** — a recruiter can see it work in real-time in under 60 seconds.

---

## 4. Non-Goals

- **NOT a full PRD editor** — no rich text, comments, version history. That is Notion's job.
- **NOT a project management tool** — no task tracking, sprint boards.
- **NOT a real-time collaboration tool** — single-user sessions for MVP.
- **NOT a multi-LLM comparison tool** — Gemini only for MVP.

---

## 5. Core Features (MVP Scope)

### Feature 1: Complaint Input Interface
- Single large text area: *"Paste a user complaint, review, or feedback here..."*
- Optional source tag: App Store / G2 / Twitter / Intercom / Other
- Optional product context field: *"What product is this feedback for?"*
- **Submit** button triggers Gemini API call

### Feature 2: AI-Generated PRD Skeleton
Output includes:
- **Problem Statement** (1 paragraph, user-grounded)
- **User Persona** (name, role, context, frustration, goal)
- **User Story** (As a [persona], I want [action], so that [outcome])
- **Acceptance Criteria** (Given / When / Then format, 3 criteria)

### Feature 3: RICE Priority Score
Auto-estimated with visible reasoning:
- **Reach** — How many users affected per quarter?
- **Impact** — (0.25 / 0.5 / 1 / 2 / 3 scale)
- **Confidence** — % certainty of estimates
- **Effort** — person-weeks
- **RICE Score** = (Reach × Impact × Confidence) / Effort
- Reasoning shown per dimension (not a black box)

### Feature 4: A/B Test Suggestion
- **Hypothesis** (If we [change X], we expect [metric Y] to improve by [Z%] because [reason])
- **Control Variant** (current state)
- **Test Variant** (proposed change)
- **Primary Success Metric** (specific, measurable)
- **Minimum Sample Size** estimate

### Feature 5: Export & Save
- **Copy to Clipboard** (Markdown format)
- **Save to History** (Neon DB, requires Firebase Auth)
- **Export as PDF** (basic, print-optimized)

---

## 6. User Stories

### Story 1: Generate PRD Draft
**As an** APM, **I want** to paste a raw user complaint and get a structured PRD skeleton, **so that** I can start my PRD in minutes instead of hours.

**Acceptance Criteria:**
- [ ] Given a text input of at least 20 characters, when I click Submit, the Gemini API call fires within 500ms.
- [ ] When the response arrives, the PRD skeleton renders within 3 seconds.
- [ ] Output contains all 4 sections: Problem Statement, User Persona, User Story, Acceptance Criteria.

### Story 2: See RICE Score Reasoning
**As an** APM, **I want** to see *why* the tool assigned each RICE score dimension, **so that** I can defend the prioritization in stakeholder meetings.

**Acceptance Criteria:**
- [ ] Each RICE dimension displays a 1-sentence reasoning alongside the score.
- [ ] Final RICE score is prominently displayed with a priority label (High / Medium / Low).

### Story 3: Save and Revisit
**As a** repeat user, **I want** to save analyses to a history log, **so that** I can revisit past PRDs without re-generating.

**Acceptance Criteria:**
- [ ] Logged-in user sees their last 20 analyses in a sidebar.
- [ ] Each item shows: source tag, first 100 chars of input, date.
- [ ] Clicking an item restores the full output view.

---

## 7. Success Metrics

| Metric | Baseline | MVP Target | Measurement |
|---|---|---|---|
| **North Star: Analyses Generated / Week** | 0 | 50 | Neon DB count |
| Avg. time from input to output | N/A | < 15 seconds | Client-side timer log |
| Export / Copy rate | N/A | > 40% of sessions | Button click event |
| Return visit rate (D7) | N/A | > 30% | Firebase Auth + session log |

---

## 8. Edge Cases & Risks

| Risk | Mitigation |
|---|---|
| Gemini API rate limit (free tier: 15 RPM) | Queue indicator + debounce on Submit |
| Vague or 1-word inputs | Validate min 20 chars, show example prompts |
| Hallucinated RICE scores seem authoritative | Disclaimer: *"AI-estimated — review before using"* |
| Users paste sensitive customer data | Privacy notice on input; don't log raw inputs for anonymous users |

---

## 9. Phase 2 Backlog

- Multi-language support (Hindi, Marathi)
- Slack / Intercom integration (auto-ingest complaints)
- Team workspaces and collaboration
- Custom PM framework templates (HEART, AARRR, JTBD)
- API access for power users
