# AI-PM Copilot

### Paste a user complaint. Get a PRD draft, RICE score, and A/B test — in seconds.

> **Built by Bhushan Bhosale** (APM Portfolio Project | Pune, India)  
> 🌐 **Live Demo:** *(Coming soon — Vercel deploy after build)*  
> 📚 **Full Docs:** [`/docs` Directory](./docs)

[![PRD](https://img.shields.io/badge/PRD-Read-blue?style=for-the-badge)](./docs/PRD.md)
[![Architecture](https://img.shields.io/badge/Architecture-Read-green?style=for-the-badge)](./docs/ARCHITECTURE.md)
[![GTM](https://img.shields.io/badge/GTM_Strategy-Read-orange?style=for-the-badge)](./docs/GTM-STRATEGY.md)
[![Status](https://img.shields.io/badge/Status-Building-yellow?style=for-the-badge)](./docs/ROADMAP.md)

---

## ⚡ What Is This?

**AI-PM Copilot** is a lightweight, AI-powered web tool that helps Product Managers turn raw user feedback into structured product artifacts in under 60 seconds.

### The Problem It Solves
- PMs spend **2–3 hours per PRD** on average, most of it on initial structuring
- User complaints from App Store, G2, and Twitter/X are raw, unstructured, and hard to prioritize
- Junior PMs especially struggle with translating complaints into RICE-scored, actionable features

### The Solution
Paste any user complaint → AI generates:
1. 📋 **PRD Skeleton** — Problem statement, user persona, user story, acceptance criteria
2. 📊 **RICE Priority Score** — Reach, Impact, Confidence, Effort auto-estimated with reasoning
3. 🧪 **A/B Test Suggestion** — Hypothesis, control variant, test variant, success metric

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 19 + Vite + TypeScript | Same stack as AeroDock |
| AI Engine | Google Gemini API (free tier) | Best free-tier rate limits |
| Database | Neon Serverless Postgres | Save history, already familiar |
| Auth | Firebase Auth | Quick setup, already used |
| Deploy | Vercel | Free, instant CI/CD |
| Styling | Tailwind CSS | Fast, clean UI |

---

## 📚 Full Documentation Index

| Document | Description |
|---|---|
| [PRD.md](./docs/PRD.md) | Full Product Requirements Document |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, data flow, API specs |
| [GTM-STRATEGY.md](./docs/GTM-STRATEGY.md) | Go-to-market + portfolio distribution plan |
| [USER-RESEARCH.md](./docs/USER-RESEARCH.md) | Target user interviews & insights |
| [ROADMAP.md](./docs/ROADMAP.md) | MVP scope + Phase 2 features |
| [METRICS.md](./docs/METRICS.md) | North Star metric + AARRR tracking plan |
| [CASE-STUDY.md](./docs/CASE-STUDY.md) | Portfolio narrative for interviews |

---

## 🚀 Quickstart (after build)

```bash
git clone https://github.com/26BB/AI-PM-Copilot.git
cd AI-PM-Copilot
npm install
cp .env.example .env
# Fill in your API keys in .env
npm run dev
```

---

## 👤 Author

**Bhushan Bhosale**  
*APM Portfolio Project | Pune, India*  
[LinkedIn](https://www.linkedin.com/in/bhushan-bhosale-36aa48373/) | [GitHub @26BB](https://github.com/26BB)
