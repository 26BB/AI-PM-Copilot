# Product Roadmap: AI-PM Copilot

**Author:** Bhushan Bhosale  
**Date:** September 2026

---

## Overview

```
Oct 2026        Nov 2026        Dec 2026        Q1 2027
|               |               |               |
[MVP Build]     [Soft Launch]   [Growth Push]   [Phase 2]
2-3 weekends    LinkedIn post   50 analyses     Team features
                + Alpha users   + APM season    + integrations
```

---

## Phase 1: MVP — Core Loop (Oct 2026)

**Theme:** "Paste complaint → get structured output → copy to Notion"

| Feature | Priority | Effort Est. | Rationale |
|---|---|---|---|
| Complaint input form | P0 | 0.5 days | Core product |
| Gemini API integration | P0 | 1 day | Core value |
| PRD skeleton output | P0 | 1 day | Core value |
| RICE score + reasoning | P0 | 1 day | Core value |
| A/B test suggestion | P0 | 0.5 days | Core value |
| Copy to clipboard | P0 | 0.5 days | Without this, no one uses it |
| Source tag selector | P1 | 0.5 days | Context improves output quality |
| Loading state + error handling | P0 | 0.5 days | Basic UX hygiene |
| Mobile responsive | P1 | 0.5 days | LinkedIn traffic is mostly mobile |

**Total MVP estimate:** 2–3 weekends (~6–8 hours focused coding)

---

## Phase 2: Retention — History & Auth (Nov 2026)

**Theme:** "Come back, your past analyses are saved"

| Feature | Priority | Effort |
|---|---|---|
| Firebase Google Auth | P0 | 1 day |
| Save analysis to Neon DB | P0 | 1 day |
| History sidebar (last 20) | P1 | 1 day |
| Export as PDF | P2 | 1.5 days |
| Product context field | P1 | 0.5 days |

---

## Phase 3: Growth — Sharing & Virality (Dec 2026–Jan 2027)

**Theme:** "Share your analysis"

| Feature | Priority | Notes |
|---|---|---|
| Public shareable link per analysis | P1 | Drives organic traffic |
| Embed widget (for Notion) | P2 | Power user feature |
| Slack /slash command | P2 | Enterprise signal |
| Custom PM framework templates | P2 | HEART, AARRR, JTBD |

---

## Phase 4: Monetization (Q2 2027, if validated)

**Gate:** Only build if Phase 3 shows 200+ WAUs organically.

| Tier | Price | Limit |
|---|---|---|
| Free | ₹0 | 10 analyses/month |
| Pro | ₹499/month | Unlimited + history |
| Team | ₹1,999/month | Shared workspace |

---

## Explicit Non-Builds

- Full PRD editor → Notion does this
- Sprint/roadmap management → Linear does this
- Multi-LLM toggle → complexity without value for MVP
- Chrome extension → mobile-first audience first
