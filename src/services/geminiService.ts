/**
 * Skeleton outline of a Product Requirements Document (PRD) derived from feedback.
 */
export interface PrdSkeleton {
  /** Clear statement of the customer or business problem */
  problemStatement: string;
  /** Primary target user persona impacted by the issue */
  userPersona: string;
  /** Agile user story in standard "As a... I want... So that..." format */
  userStory: string;
  /** List of concrete acceptance criteria that validate feature completion */
  acceptanceCriteria: string[];
}

/**
 * RICE score metrics and detailed step-by-step priority calculation reasoning.
 */
export interface RiceScoreReasoning {
  /** Estimated reach (e.g. users impacted per month) */
  reach: number;
  /** Estimated business impact score (e.g. 0.5 = Low, 1 = Medium, 2 = High, 3 = Massive) */
  impact: number;
  /** Confidence percentage (e.g. 50% to 100%) */
  confidence: number;
  /** Estimated effort in person-weeks or story points */
  effort: number;
  /** Final calculated RICE priority score */
  score: number;
  /** Step-by-step breakdown justifying reach, impact, confidence, and effort estimates */
  reasoning: string;
}

/**
 * Proposed A/B test setup for validating the feature solution.
 */
export interface AbTestSuggestion {
  /** Test hypothesis explaining predicted behavior change */
  hypothesis: string;
  /** Control experience representing current state */
  controlVariant: string;
  /** Treatment experience presenting proposed enhancement */
  testVariant: string;
  /** Primary quantitative metric used to determine test winner */
  successMetric: string;
}

/**
 * Full AI synthesis result containing PRD skeleton, RICE scoring, and A/B test proposal.
 */
export interface AnalysisResult {
  /** Draft PRD skeleton */
  prdSkeleton: PrdSkeleton;
  /** RICE scoring with reasoning */
  riceScore: RiceScoreReasoning;
  /** A/B experiment suggestion */
  abTestSuggestion: AbTestSuggestion;
}

/**
 * Constructs a structured system prompt for Gemini API to process raw user feedback.
 *
 * @param complaint - Raw customer feedback or complaint text
 * @returns Formatted prompt requiring JSON output matching expected product artifact schema
 */
export function buildGeminiPrompt(complaint: string): string {
  return `You are an expert Principal Product Manager. Analyze the following raw user complaint and generate structured product artifacts:

RAW USER COMPLAINT:
"${complaint}"

Respond strictly with a valid, raw JSON object (no markdown code fences or pre-text) matching this EXACT structure:
{
  "prdSkeleton": {
    "problemStatement": "<Concise description of problem>",
    "userPersona": "<Target persona>",
    "userStory": "As a <persona>, I want <goal> so that <benefit>",
    "acceptanceCriteria": ["<Criterion 1>", "<Criterion 2>"]
  },
  "riceScore": {
    "reach": <number>,
    "impact": <number 0.5 to 3.0>,
    "confidence": <number 0 to 100>,
    "effort": <number >= 0.5>,
    "reasoning": "<Detailed step-by-step breakdown explaining reach, impact, confidence, effort, and RICE score computation>"
  },
  "abTestSuggestion": {
    "hypothesis": "<Measurable hypothesis statement>",
    "controlVariant": "<Description of control>",
    "testVariant": "<Description of treatment>",
    "successMetric": "<Primary metric to measure>"
  }
}`;
}

/**
 * Safely parses raw text or JSON response returned by the Gemini API into a strongly typed AnalysisResult.
 *
 * @param rawText - Raw string output returned from the AI model
 * @returns Parsed AnalysisResult object with valid fallback fields if necessary
 */
export function parseGeminiResponse(rawText: string): AnalysisResult {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned) as Partial<AnalysisResult>;

  const reach = typeof parsed.riceScore?.reach === 'number' ? parsed.riceScore.reach : 1000;
  const impact = typeof parsed.riceScore?.impact === 'number' ? parsed.riceScore.impact : 2;
  const confidence = typeof parsed.riceScore?.confidence === 'number' ? parsed.riceScore.confidence : 80;
  const effort = typeof parsed.riceScore?.effort === 'number' ? Math.max(0.5, parsed.riceScore.effort) : 2;
  const score =
    typeof parsed.riceScore?.score === 'number'
      ? parsed.riceScore.score
      : Math.round((((reach / 1000) * impact * (confidence / 100)) / effort) * 10) / 10;

  return {
    prdSkeleton: {
      problemStatement: parsed.prdSkeleton?.problemStatement || 'Problem statement derived from user complaint.',
      userPersona: parsed.prdSkeleton?.userPersona || 'Affected End User',
      userStory: parsed.prdSkeleton?.userStory || 'As a user, I want a reliable experience so that I can achieve my goals.',
      acceptanceCriteria: Array.isArray(parsed.prdSkeleton?.acceptanceCriteria) && parsed.prdSkeleton.acceptanceCriteria.length > 0
        ? parsed.prdSkeleton.acceptanceCriteria
        : ['The system resolves reported issues without errors.'],
    },
    riceScore: {
      reach,
      impact,
      confidence,
      effort,
      score,
      reasoning: parsed.riceScore?.reasoning || 'RICE score calculated based on estimated reach, impact, confidence, and effort.',
    },
    abTestSuggestion: {
      hypothesis: parsed.abTestSuggestion?.hypothesis || 'Implementing the fix will improve completion rate.',
      controlVariant: parsed.abTestSuggestion?.controlVariant || 'Current user flow',
      testVariant: parsed.abTestSuggestion?.testVariant || 'Optimized flow addressing user feedback',
      successMetric: parsed.abTestSuggestion?.successMetric || 'Conversion rate',
    },
  };
}

/**
 * Sends a raw user complaint to the Google Gemini API and returns structured PM artifacts.
 * Key strictly read from process.env.GEMINI_API_KEY as per coding standards.
 *
 * @param complaint - Raw user feedback string
 * @returns Promise resolving to AnalysisResult containing PRD, RICE, and A/B test specifications
 */
export async function generateProductArtifacts(complaint: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing process.env.GEMINI_API_KEY. Please set the environment variable.');
  }

  const prompt = buildGeminiPrompt(complaint);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API request failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };

  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    throw new Error('Gemini API returned empty response text.');
  }

  return parseGeminiResponse(textOutput);
}
