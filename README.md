# AI-PM Copilot

### Paste a user complaint. Get a PRD draft, RICE score, and A/B test — in seconds.

> **Built by Bhushan Bhosale** (APM Portfolio Project | Pune, India)  
> 🌐 **Live Demo:** [**https://ai-pm-copilot-two.vercel.app**](https://ai-pm-copilot-two.vercel.app)  
> 📚 **Full Docs:** [`/docs` Directory](./docs)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://ai-pm-copilot-two.vercel.app)
[![Status](https://img.shields.io/badge/Status-Live_in_Production-brightgreen?style=for-the-badge)](https://ai-pm-copilot-two.vercel.app)
[![Tests](https://img.shields.io/badge/Tests-62_Passed-success?style=for-the-badge&logo=vitest)](https://github.com/26BB/AI-PM-Copilot)
[![PRD](https://img.shields.io/badge/PRD-Read-blue?style=for-the-badge)](./docs/PRD.md)
[![Architecture](https://img.shields.io/badge/Architecture-Read-green?style=for-the-badge)](./docs/ARCHITECTURE.md)
[![GTM](https://img.shields.io/badge/GTM_Strategy-Read-orange?style=for-the-badge)](./docs/GTM-STRATEGY.md)

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
2. 📊 **RICE Priority Score** — Reach, Impact, Confidence, Effort auto-estimated with step-by-step reasoning
3. 🧪 **A/B Test Suggestion** — Hypothesis, control variant, test variant, success metric

---

## ✨ Key Features & Capabilities

- **🚀 Instant Artifact Generation:** Generates actionable PM deliverables in seconds using Google Gemini AI.
- **🏷️ Source Channel Selector:** Tag feedback from App Store, Google Play, Twitter / X, Zendesk, or G2 to provide the AI with channel-specific user context.
- **📐 Mathematical RICE Scoring:** Transparent priority formula (`(Reach × Impact × Confidence) / Effort`) with clear justification for every variable.
- **📋 1-Click Copy Actions:** Dedicated copy buttons on every section to swiftly transfer artifacts to Notion, Linear, or Jira.
- **🛡️ Resilient Error Handling & Retry:** Graceful loading states, network timeout recovery, and one-click retry mechanisms.
- **✅ High Reliability Test Suite:** Backed by 62 unit and integration tests with 100% passing rate and 70%+ line coverage.

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Languages & Frameworks | TypeScript, React 19, Vite | Modern, type-safe frontend architecture |
| Testing | Vitest | Fast unit and integration test runner with 70%+ line coverage enforcement |
| AI Engine | Gemini API (Google AI) | High-performance model for PRD, RICE, & A/B testing artifact generation |
| Database | Neon Serverless Postgres | Persists generation history and user logs |
| Auth | Firebase Auth | User authentication and session management |
| Deploy | Vercel | Instant, production CI/CD deployment target |
| Styling | Tailwind CSS | Fast, clean utility-first UI styling |

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
