# System Architecture: AI-PM Copilot

**Version:** 1.0  
**Author:** Bhushan Bhosale  
**Date:** September 2026

---

## 1. High-Level Architecture

```
+-------------------------------------------------------------------------+
|                        AI-PM COPILOT SYSTEM                             |
|                                                                         |
|  +------------------+  +------------------+  +--------------------+    |
|  | React 19 + Vite  |  | Gemini API       |  | Neon Postgres      |    |
|  | (Frontend)       |  | (AI Engine)      |  | (History DB)       |    |
|  |                  |  |                  |  |                    |    |
|  | - Input form     |  | - gemini-pro     |  | - analyses table   |    |
|  | - Output render  |  | - Structured     |  | - users table      |    |
|  | - History panel  |  |   JSON output    |  | - events table     |    |
|  | - Export/Copy    |  | - System prompt  |  |                    |    |
|  +------------------+  +------------------+  +--------------------+    |
|         |                      |                      |                 |
|   Firebase Auth           REST/JSON            Serverless SQL           |
|         |                      |                      |                 |
|  +------------------+          +----------------------+                 |
|  | Firebase Auth    |                                                   |
|  | (User sessions)  |                                                   |
|  +------------------+                                                   |
+-------------------------------------------------------------------------+
```

---

## 2. Data Flow

```
User Input (complaint text)
    |
    v
[React Frontend]
    | POST to Gemini API
    v
[Gemini API Call]
    | Structured JSON response
    v
[Parse & Validate Output]
    |                  |
    v                  v
[Render to UI]    [Save to Neon DB] (if logged in)
    |
    v
[Copy / Export / Save]
```

---

## 3. Gemini API Integration

### System Prompt
```
You are a senior Product Manager assistant. The user will provide raw user feedback
(complaint, review, or support ticket). Return a structured JSON object with exactly
these 3 sections:

1. prd_skeleton: { problem_statement, user_persona, user_story, acceptance_criteria[] }
2. rice_score: { reach, impact, confidence, effort, total_score, reasoning_per_dimension }
3. ab_test: { hypothesis, control_variant, test_variant, primary_metric, min_sample_size }

Rules:
- Always return valid JSON. No markdown fences.
- RICE reasoning must be 1 sentence per dimension.
- Acceptance criteria must follow Given/When/Then format.
- User persona must have: name, role, context, frustration, goal.
- Be specific. No generic placeholders.
```

### API Call Spec
- **Model:** `gemini-1.5-pro` (or `gemini-2.0-flash` for speed)
- **Temperature:** 0.4
- **Max output tokens:** 1500
- **Rate limit handling:** Exponential backoff (1s, 2s, 4s), max 3 retries

---

## 4. Database Schema (Neon Postgres)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analyses table (main data store)
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  source_tag TEXT, -- 'app_store' | 'g2' | 'twitter' | 'intercom' | 'other'
  product_context TEXT,
  raw_input TEXT NOT NULL,
  prd_skeleton JSONB,
  rice_score JSONB,
  ab_test JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table (copy/export tracking)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id),
  event_type TEXT, -- 'copy_prd' | 'copy_rice' | 'copy_ab' | 'copy_all' | 'export_pdf'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user history
CREATE INDEX idx_analyses_user_created ON analyses(user_id, created_at DESC);
```

---

## 5. Frontend Component Structure

```
src/
├── components/
│   ├── InputPanel/
│   │   ├── InputPanel.tsx       # Main complaint input form
│   │   ├── SourceTagSelect.tsx  # App Store / G2 / Twitter dropdown
│   │   └── SubmitButton.tsx     # With loading state
│   ├── OutputPanel/
│   │   ├── OutputPanel.tsx      # Container for all 3 sections
│   │   ├── PRDSection.tsx       # PRD skeleton display
│   │   ├── RICESection.tsx      # RICE score with reasoning
│   │   └── ABTestSection.tsx    # A/B test hypothesis card
│   ├── HistoryPanel/
│   │   ├── HistoryPanel.tsx     # Sidebar with past analyses
│   │   └── HistoryItem.tsx      # Individual saved analysis row
│   └── shared/
│       ├── CopyButton.tsx
│       ├── ExportButton.tsx
│       └── LoadingSpinner.tsx
├── services/
│   ├── gemini.ts               # Gemini API client + system prompt
│   ├── neon.ts                 # Neon DB queries
│   └── firebase.ts             # Auth helpers
├── types/
│   └── analysis.ts             # TypeScript interfaces for API response
├── App.tsx
└── main.tsx
```

---

## 6. Environment Variables

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_NEON_DATABASE_URL=postgresql://...
```

---

## 7. Deployment

- **Platform:** Vercel (same as AeroDock)
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Preview deploys:** Enabled on all PRs
