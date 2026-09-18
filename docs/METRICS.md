# Metrics & Analytics Plan: AI-PM Copilot

**Author:** Bhushan Bhosale  
**Date:** September 2026

---

## 1. North Star Metric

> **Analyses Generated Per Week**

**Why this metric:**
- Each analysis = a PM got value from the tool
- Directly tied to product purpose
- Easy to measure (Neon DB count)
- Mirrors PulseQR's "Scans per Active Cafe" — shows consistent product thinking

**MVP Target:** 50 analyses/week by end of Week 6 post-launch

---

## 2. AARRR Framework

| Stage | Metric | Target | Measurement |
|---|---|---|---|
| **Acquisition** | Unique visitors/week | 200 | Vercel Analytics |
| **Activation** | % visitors who submit 1+ complaint | > 50% | DB: analyses vs. sessions |
| **Retention** | D7 return visit rate | > 30% | Firebase Auth + session log |
| **Revenue** | N/A (Phase 1) | — | — |
| **Referral** | % traffic from shared links | > 20% | UTM tracking on posts |

---

## 3. Feature-Level Metrics

| Feature | Metric | Why It Matters |
|---|---|---|
| Submit button | Click-through rate | Validates input form UX |
| PRD output | Copy clicks / total submissions | Did the output earn a copy? |
| RICE score | Time on RICE section | Is the reasoning being read? |
| A/B test | Copy clicks on A/B section | Validate the value of this section |
| History panel | Return sessions with history clicks | Validates retention mechanism |

---

## 4. Instrumentation Plan

```sql
-- Every analysis submission
INSERT INTO analyses (user_id, source_tag, raw_input, prd_skeleton, rice_score, ab_test)

-- Every copy/export event
INSERT INTO events (analysis_id, event_type, created_at)
-- event_type: 'copy_prd' | 'copy_rice' | 'copy_ab' | 'copy_all' | 'export_pdf'
```

**Privacy rule:** Anonymous sessions → log counts only, no content.

---

## 5. Weekly Review Ritual (3 Questions)

Every Monday, answer:
1. **Volume:** Analyses this week vs. last week? (↑ or ↓)
2. **Quality:** What % of submissions got a copy/export event?
3. **Retention:** Did any users return? What brought them back?

Log answers in `docs/WEEKLY-LOG.md` (create after launch).

---

## 6. Portfolio Proof Milestones

| Milestone | Metric | Portfolio Use |
|---|---|---|
| First 10 analyses | Week 1 | "Launched alpha" |
| 50 analyses total | Week 3–4 | "50 analyses generated" |
| 30% D7 return rate | Week 4–6 | "Users come back" |
| 1 data-driven product change | Any time | "Data told me to change X" — most powerful story |

> The last milestone is the most important. Find one thing the data told you to change, change it, measure the effect. That is the story that gets you the APM offer.
