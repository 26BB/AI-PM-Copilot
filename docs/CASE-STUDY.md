# Behind-the-Build: AI-PM Copilot
**A Portfolio Case Study by Bhushan Bhosale**

> *Fill in [bracketed sections] with real data after launch.*

---

## The Hook

> *"I built a tool that turns a raw user complaint into a full PRD skeleton, RICE score, and A/B test in under 15 seconds. Here's why I built it, how I built it, and what I learned."*

---

## 1. The Problem

I was practicing PM skills. I noticed I spent 80% of my time *formatting*, not *thinking*. Every time I analyzed a user complaint, I had to Google the PRD template, force-fit the complaint, calculate a RICE score with gut numbers, and start over when the format was off.

I realized this was not a me problem — every APM does this. ChatGPT helps, but requires 5–6 re-prompts to get the right format. I wanted a tool that already knew PM frameworks and gave structured output on the first try.

**The insight:** The job is not to write a PRD faster. The job is to *show up to the meeting with something defensible, fast.*

---

## 2. The Hypothesis

> *"If I build a one-click tool that takes raw feedback and outputs structured PM artifacts, PMs will use it — and it will reduce PRD structuring time from ~2.5 hours to under 15 minutes."*

**What I deliberately cut from MVP:**
- Full PRD editor (Notion exists)
- Team collaboration (too complex)
- Multi-LLM comparison (complexity without value)

---

## 3. The Build

**Stack:** React 19 + Gemini API + Neon Postgres + Firebase Auth + Vercel

**Why this stack:**
- Already knew React from AeroDock Systems
- Gemini API has best free-tier limits
- Neon and Firebase already in my toolkit
- Vercel deploys in 2 minutes

**The hardest part:** Writing the system prompt. Getting Gemini to return valid, structured JSON *consistently* took 8–9 prompt iterations. The key: be hyper-explicit. *"Always return valid JSON. No markdown fences. RICE reasoning must be 1 sentence per dimension."*

**Time to build:** [X weekends / Y hours total]

---

## 4. The Results

*[Update after launch with real data]*

- **[X] analyses generated** across [Y] users
- **[Z]% copy/export rate** (did the output earn use?)
- **Most common source tag:** [App Store / G2 / Twitter]
- **Biggest product change based on data:** [What the data told me to change and what happened after]

---

## 5. What Failed

*[Update after real usage]*

1. **[Failure 1]:** What didn't work and why
2. **[Failure 2]:** What users didn't do that I expected

---

## 6. Key Learnings

1. **Product lesson:** [Fill with real insight from data]
2. **Technical lesson:** Prompt engineering is a product skill. The words in a system prompt directly affect UX — just like acceptance criteria.
3. **GTM lesson:** The demo IS the marketing. One LinkedIn post with a live link drove more traffic than any description.

---

## 7. How to Present This in Interviews

**On AI product sense:**
> *"I didn't just use AI tools — I built one. The interesting challenge wasn't the code; it was the prompt engineering. I iterated 8+ times before the output was consistent enough to trust. That taught me AI PM work is really about defining the output contract clearly — just like writing acceptance criteria."*

**On metrics:**
> *"My North Star was analyses per week. I also tracked copy/export rate — that told me whether output was actually useful, not just generated. [Real numbers here]."*

---

*Last updated: September 2026 | Update with real data post-launch*
