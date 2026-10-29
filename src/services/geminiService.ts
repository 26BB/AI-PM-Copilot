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
 * Helper function to retrieve the Gemini API key strictly from environment variables.
 *
 * @returns API key string or undefined if not set
 */
export function getGeminiApiKey(): string | undefined {
  if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  return undefined;
}

/**
 * Formats customer feedback source channel context into a structured prompt line.
 *
 * @param sourceTag - Selected feedback channel source tag (e.g., "App Store", "Twitter / X")
 * @returns Formatted prompt string indicating feedback origin channel
 */
export function formatSourceContextPrompt(sourceTag?: string): string {
  if (sourceTag && sourceTag.trim()) {
    return `FEEDBACK SOURCE CHANNEL: ${sourceTag.trim()}`;
  }
  return 'FEEDBACK SOURCE CHANNEL: Unspecified Channel';
}

/**
 * Constructs a structured system prompt for Gemini API to process raw user feedback.
 *
 * @param complaint - Raw customer feedback or complaint text
 * @param sourceTag - Optional source channel tag indicating feedback origin
 * @returns Formatted prompt requiring JSON output matching expected product artifact schema
 */
export function buildGeminiPrompt(complaint: string, sourceTag?: string): string {
  const sourceContext = formatSourceContextPrompt(sourceTag);
  return `You are an expert Principal Product Manager. Analyze the following raw user complaint and generate structured product artifacts:

${sourceContext}

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
 * Safely converts an unknown value (number or numeric string) into a finite valid number.
 *
 * WHY: LLM JSON outputs frequently format numeric fields as stringified numbers (e.g. "reach": "5000")
 * or produce NaN/Infinity values. Parsing string numbers and rejecting NaN/Infinity ensures RICE
 * math calculations remain accurate without throwing errors or displaying NaN in the UI.
 *
 * @param value - Unknown input value from LLM JSON response
 * @param defaultValue - Fallback numeric value if input is invalid
 * @returns Finite number
 */
export function parseFiniteNumber(value: unknown, defaultValue: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value.trim());
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return defaultValue;
}

/**
 * Safely converts an unknown value into a trimmed non-empty string.
 *
 * WHY: Unvalidated LLM outputs occasionally return objects, arrays, numbers, booleans, or null for string fields.
 * Validating type string before trimming prevents React runtime errors ("Objects are not valid as a React child").
 *
 * @param value - Unknown input value from LLM JSON response
 * @param defaultValue - Fallback string if input is invalid or whitespace-only
 * @returns Cleaned non-empty string
 */
export function parseNonEmptyString(value: unknown, defaultValue: string): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return defaultValue;
}

/**
 * Safely extracts a non-empty string representation from an acceptance criterion item.
 * Handles strings, objects with descriptive properties (e.g., { criterion, text }), and primitives.
 *
 * @param item - Raw criterion item from LLM JSON response
 * @returns Trimmed non-empty string or empty string if invalid
 */
function sanitizeAcceptanceCriteriaItem(item: unknown): string {
  if (typeof item === 'string') {
    return item.trim();
  }
  if (item && typeof item === 'object') {
    const obj = item as Record<string, unknown>;
    const textVal = obj.criterion ?? obj.text ?? obj.description ?? obj.value ?? obj.title;
    if (typeof textVal === 'string') {
      return textVal.trim();
    }
  }
  if (typeof item === 'number' || typeof item === 'boolean') {
    return String(item).trim();
  }
  return '';
}

/**
 * Safely parses raw text or JSON response returned by the Gemini API into a strongly typed AnalysisResult.
 *
 * @param rawText - Raw string output returned from the AI model
 * @returns Parsed AnalysisResult object with valid fallback fields if necessary
 */
export function parseGeminiResponse(rawText: string): AnalysisResult {
  // LLMs occasionally include conversational preambles/postambles surrounding output.
  // First extract content inside markdown code fences if present; otherwise extract outer json object.
  let jsonString = rawText.trim();

  const codeBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    jsonString = codeBlockMatch[1].trim();
  } else {
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonString = rawText.substring(firstBrace, lastBrace + 1).trim();
    }
  }

  let rawParsed: unknown = {};
  try {
    rawParsed = JSON.parse(jsonString);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown JSON syntax error';
    throw new Error(`Failed to parse Gemini API JSON response: ${message}`);
  }

  // WHY: Non-object JSON inputs (e.g. JSON.parse("null")) return null or primitive values.
  // Normalizing to an empty object prevents TypeError exceptions when evaluating optional properties.
  const parsed = (rawParsed && typeof rawParsed === 'object' && !Array.isArray(rawParsed))
    ? (rawParsed as Partial<AnalysisResult>)
    : {};

  const parsedReach = parseFiniteNumber(parsed.riceScore?.reach, 1000);
  const reach = parsedReach >= 0 ? parsedReach : 1000;

  const parsedImpact = parseFiniteNumber(parsed.riceScore?.impact, 2);
  const impact = parsedImpact >= 0 ? parsedImpact : 2;

  const parsedConfidence = parseFiniteNumber(parsed.riceScore?.confidence, 80);
  const confidence = parsedConfidence >= 0 ? Math.min(100, parsedConfidence) : 80;

  const parsedEffort = parseFiniteNumber(parsed.riceScore?.effort, 2);
  const effort = parsedEffort >= 0 ? Math.max(0.5, parsedEffort) : 2;

  const calculatedScore = Math.round((((reach / 1000) * impact * (confidence / 100)) / effort) * 10) / 10;
  // WHY: LLM responses often format the score as a string (e.g. "score": "15.5") or produce negative numbers.
  // Using parseFiniteNumber handles stringified numbers and ensures invalid or negative scores fall back to calculatedScore.
  const parsedScore = parseFiniteNumber(parsed.riceScore?.score, calculatedScore);
  const score = parsedScore >= 0 ? parsedScore : calculatedScore;

  const rawCriteria = parsed.prdSkeleton?.acceptanceCriteria;
  const sanitizedCriteria = Array.isArray(rawCriteria)
    ? rawCriteria.map(sanitizeAcceptanceCriteriaItem).filter((item) => item.length > 0)
    : [];

  return {
    prdSkeleton: {
      problemStatement: parseNonEmptyString(parsed.prdSkeleton?.problemStatement, 'Problem statement derived from user complaint.'),
      userPersona: parseNonEmptyString(parsed.prdSkeleton?.userPersona, 'Affected End User'),
      userStory: parseNonEmptyString(parsed.prdSkeleton?.userStory, 'As a user, I want a reliable experience so that I can achieve my goals.'),
      acceptanceCriteria: sanitizedCriteria.length > 0
        ? sanitizedCriteria
        : ['The system resolves reported issues without errors.'],
    },
    riceScore: {
      reach,
      impact,
      confidence,
      effort,
      score,
      reasoning: parseNonEmptyString(parsed.riceScore?.reasoning, 'RICE score calculated based on estimated reach, impact, confidence, and effort.'),
    },
    abTestSuggestion: {
      hypothesis: parseNonEmptyString(parsed.abTestSuggestion?.hypothesis, 'Implementing the fix will improve completion rate.'),
      controlVariant: parseNonEmptyString(parsed.abTestSuggestion?.controlVariant, 'Current user flow'),
      testVariant: parseNonEmptyString(parsed.abTestSuggestion?.testVariant, 'Optimized flow addressing user feedback'),
      successMetric: parseNonEmptyString(parsed.abTestSuggestion?.successMetric, 'Conversion rate'),
    },
  };
}

/**
 * Sends a raw user complaint to the Google Gemini API and returns structured PM artifacts.
 * Key strictly read from environment variable via getGeminiApiKey().
 *
 * @param complaint - Raw user feedback string
 * @param sourceTag - Optional customer feedback channel tag context
 * @returns Promise resolving to AnalysisResult containing PRD, RICE, and A/B test specifications
 */
export async function generateProductArtifacts(complaint: string, sourceTag?: string): Promise<AnalysisResult> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error('Missing process.env.GEMINI_API_KEY. Please set the environment variable.');
  }

  const prompt = buildGeminiPrompt(complaint, sourceTag);
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
