# User Research: AI-PM Copilot

**Author:** Bhushan Bhosale  
**Date:** September 2026  
**Method:** Jobs-To-Be-Done interviews + assumption mapping

---

## 1. Research Goals

1. Validate that PRD structuring time is a real, felt pain (not assumed)
2. Understand current workarounds PMs use today
3. Identify the output format that feels most useful
4. Surface objections and trust barriers to AI-generated artifacts

---

## 2. Target Interview Profiles

| Profile | Why interview them |
|---|---|
| APM at a funded Indian startup (0–2 yrs exp) | Primary persona — highest pain |
| Founder's Office operator at seed startup | Secondary persona — time-starved |
| Mid-level PM (3–5 yrs exp) | Validation check — do senior PMs still feel this? |
| PM bootcamp student | Proxy for aspirant users |

**Target:** 5–8 interviews before building. 3 follow-ups after alpha.

---

## 3. Interview Script

### Opening
- *"Walk me through the last PRD you wrote. Start from the moment you decided to write it."*
- *"How long did it take from blank page to first share with your team?"*

### Pain Exploration
- *"What's the most annoying part of writing a PRD?"*
- *"Have you used AI tools (ChatGPT, Claude, Gemini) for PRDs? Tell me about that."*
- *"Why do you keep re-prompting?"*

### Current Workarounds
- *"What does your process look like for turning a Slack message from CS into an eng ticket?"*
- *"Do you have a template? Where did it come from?"*

### Solution Validation
- *"What would make you trust the output enough to use it in a real meeting?"*
- *"What would the output need to look like for you to paste it into Notion without editing?"*

### Closing
- *"What's the one thing that would make this tool useless to you?"*

---

## 4. Assumption Map (Pre-Build)

> **Note:** Hypothesis-driven assumptions. Update with real interview quotes after conducting them.

| Assumption | Confidence | Evidence |
|---|---|---|
| PMs spend 1–3 hrs on PRD structuring | High | Personal experience + PM Reddit threads |
| Current ChatGPT use requires 5+ re-prompts | Medium | Observed in personal use |
| Output must be copy-pasteable to be trusted | High | PMs are judged on their docs |
| RICE score must show reasoning to be useful | High | Blind scores get challenged in meetings |
| Privacy concern about pasting customer data | Medium | GDPR awareness in SaaS PMs |
| Personas are the hardest section to write well | Medium | Common complaint in PM forums |

---

## 5. Key Insight (Hypothesis)

> **The job-to-be-done is not "write a PRD faster."**  
> **The job is "show up to the meeting with something defensible, fast."**

This changes design priority:
- Output must look polished, not just technically correct
- RICE *reasoning* matters as much as the score
- Export/Copy is a core feature, not a nice-to-have

---

## 6. Next Steps

- [ ] Conduct 5 JTBD interviews with APMs (Pune network)
- [ ] Update assumption table with real quotes
- [ ] Run 1 usability test on wireframe before coding
- [ ] Post research synthesis on LinkedIn (thought leadership play)
