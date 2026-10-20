# 🔧 Daily Maintenance Logbook — AI-PM-Copilot

> This file is read and updated by the Daily Maintenance Squad agent on every run.
> It serves as persistent memory across sessions — what was done, what's pending, what to watch.

---

## 📋 Backlog (unfixed items from previous sweeps)
<!-- Items the agent found but couldn't fix in that run's budget. Next run picks these up first. -->

| Date Found | Category | File | Issue | Priority |
|------------|----------|------|-------|----------|
| 2026-10-15 | ✨ Feat | src/main.tsx | Source tag selector integration for complaint forms (PR #39 had conflicts) | MEDIUM |
| 2026-10-15 | ✨ Feat | src/components/ResponsiveContainer.tsx, src/main.tsx | Mobile responsive layout improvements (PR #36 had conflicts) | MEDIUM |

---

## ✅ Completed Log (most recent first)

### 2026-10-20 — Prevent Dangling Timers and Unmounted State Updates in CopyButton
**Status:** ✅ Fixed
**Fixed:**
- 🛡️ Refactored `src/components/CopyButton.tsx` to store the active feedback reset timeout handle using `useRef` and clean up pending timers via `useEffect` upon component unmounting or repeated clicks, preventing state updates on unmounted React components and memory leaks.
- 🧪 Added unit test in `src/tests/CopyButton.test.tsx` verifying that unmounting `CopyButton` while the copy confirmation timeout is pending safely cleans up the timer.
**PR:** `chore(atlas): prevent dangling timers and unmounted state updates in CopyButton [2026-10-20]`

### 2026-10-15 — Harden Gemini Response Parser Against Conversational Preambles/Postambles
**Status:** ✅ Fixed
**Fixed:**
- 🛡️ Enhanced `parseGeminiResponse` in `src/services/geminiService.ts` with robust regex extraction for fenced markdown code blocks and boundary braces to safely handle conversational preambles/postambles from Gemini API outputs. Added descriptive error handling for JSON syntax errors.
- 🧪 Added unit tests in `src/tests/geminiService.test.ts` verifying parsing of conversational preambles/postambles surrounding JSON and invalid JSON syntax handling.
**PR:** `chore(atlas): harden Gemini response parser against conversational preambles [2026-10-15]`

### 2026-10-15 — Expand Coverage for RICE + Complaint Routing
**Status:** ✅ Fixed
**Fixed:**
- 🧪 Expand test coverage in `src/tests/riceAndSynthesis.test.ts` for RICE calculation edge cases (fractional impact/confidence single-decimal rounding) and complaint heuristic routing (embedded invoice attachments).
**PR:** `test: expand coverage for RICE + complaint routing [2026-10-15]`

### 2026-10-15 — Fix TS6133 Unused React Import in mobileResponsive.test.tsx
**Status:** ✅ Fixed
**Fixed:**
- 🐛 Fix `src/tests/mobileResponsive.test.tsx` TS6133 error where `React` was imported but unused, enabling `tsc --noEmit` and `npm run build` to pass cleanly.
**PR:** `chore(atlas): fix TS6133 unused React import in mobileResponsive test [2026-10-15]`

### 2026-10-15 — Initial Logbook + Jules Master Bulk Merge
**Status:** ✅ Bulk merge by Jules Master
**Fixed:**
- 🧪 Expand test coverage for RICE + complaint routing (#33)
- ✨ Implement mobile responsive layout — Phase 1 MVP (#34)
**Closed:**
- PR #38 (daily code health sweep) — 0 additions, 0 deletions, closed as empty
**Deferred to backlog:**
- PR #35, #37 (test coverage expansion) — merge conflicts in riceAndSynthesis.test.ts
- PR #36 (mobile responsive layout v2) — merge conflicts after #34 merged
- PR #39 (source tag selector integration) — merge conflicts after #34 merged
**PR:** #33–34 (squash merged by Jules Master)

---

## ⚠️ Known Constraints & Gotchas

- `src/main.tsx` is the main app entry point and is touched by both feature PRs and maintenance sweeps. High conflict risk.
- `src/tests/riceAndSynthesis.test.ts` has been the target of 3 overlapping test expansion PRs (#33, #35, #37) — all append tests to the end of the same describe block, causing conflicts when merged out of order.
- The Gemini API key MUST be read from `process.env.GEMINI_API_KEY` — never hardcode it.
- Tech stack: TypeScript + Vitest + Vite. Test command: `npx vitest run`. Build: `npm run build`.
- Phase 1 P0 checklist is complete. Feature work is now on P1 (source tag selector, mobile responsive).
- The Feature Builder agent handles feature work separately — the maintenance agent should NOT implement features, only security/perf/a11y.
