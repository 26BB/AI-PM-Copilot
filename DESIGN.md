# Design System: AI-PM Copilot

The locked design system for AI-PM Copilot. Formulated for focused product management artifact synthesis, user feedback triage, and algorithmic RICE prioritization. Bound by Hallmark's strict anti-slop craft floor and rendered in a pristine, high-contrast light theme.

## 1. System Identity & Philosophy
- **Genre**: modern-minimal
- **World**: Porcelain & Cobalt Analyst Workbench
- **Theme**: Light Porcelain (`#F8FAFC`) with Carbon Ink (`#0F172A`) and Precision Cobalt (`#2563EB`)
- **Vibe**: "architectural clarity, tabular figures, tactile pills, zero dark AI slop"
- **Posture**: Focused workbench with centered measure capped at 720px

## 2. Token Architecture (`src/tokens.css`)
```css
:root {
  /* Surfaces & Bedrock Canvas */
  --canvas: #F8FAFC;
  --surface-card: #FFFFFF;
  --surface-subtle: #F1F5F9;
  --surface-hover: #E2E8F0;
  --surface-active: #CBD5E1;

  /* Architectural Hairlines */
  --border-hairline: #E2E8F0;
  --border-hairline-strong: #CBD5E1;
  --border-focus: #2563EB;

  /* Typography Colors */
  --text-high: #0F172A;
  --text-med: #334155;
  --text-muted: #64748B;
  --text-inverse: #FFFFFF;

  /* Primary Accent: Cobalt Workstation */
  --accent-primary: #2563EB;
  --accent-primary-hover: #1D4ED8;
  --accent-surface: #EFF6FF;
  --accent-border: #BFDBFE;
  --accent-text: #1E40AF;

  /* Semantic Feedback Tints */
  --emerald-surface: #F0FDF4;
  --emerald-border: #BBF7D0;
  --emerald-text: #15803D;

  --amber-surface: #FFFBEB;
  --amber-border: #FDE68A;
  --amber-text: #92400E;

  --rose-surface: #FEF2F2;
  --rose-border: #FECACA;
  --rose-text: #991B1B;

  /* Typographic Roles */
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

## 3. Typographic Discipline & Rules
- **Display & Headings**: `Plus Jakarta Sans`, 700 weight, sentence case, untracked, zero italic emphasis inside headings (Hallmark Floor 3 & 9).
- **Body & Labels**: `Plus Jakarta Sans`, 400/500/600 weight, 1.5 to 1.6 line-height.
- **Telemetry & Scores**: `JetBrains Mono` strictly formatted with `font-variant-numeric: tabular-nums` for RICE Reach, Impact, Confidence, Effort, and Priority scores.
- **Prohibitions**: No `transition: all` (Floor 2), no cards-inside-cards (Floor 11), `overflow-x: clip` on `html` and `body` (Floor 4).

## 4. Layout & Interaction Standards
- **Container**: Capped at `720px`, centered, responsive padding (`24px 16px`).
- **Focus States**: High-visibility `:focus-visible` ring (`2px solid #2563EB`, offset `2px`) on all inputs, buttons, and chips.
- **Accessibility**: `@media (prefers-reduced-motion: reduce)` fallbacks across all animations and transitions.
