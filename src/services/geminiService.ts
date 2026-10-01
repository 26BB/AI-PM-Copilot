/**
 * Structure of the generated Product Requirements Document (PRD) skeleton.
 */
export interface PrdSkeleton {
  /** Clear statement of the core user problem */
  problemStatement: string;
  /** Primary user persona impacted by this issue */
  targetUserPersona: string;
  /** Agile user story (As a... I want to... So that...) */
  userStory: string;
  /** Measurable acceptance criteria for the feature */
  acceptanceCriteria: string[];
}

/**
 * Structure of the RICE priority score breakdown and step-by-step reasoning.
 */
export interface RiceScore {
  /** Estimated reach (number of users or events per quarter) */
  reach: number;
  /** Impact rating (0.25 = minimal, 0.5 = low, 1 = medium, 2 = high, 3 = massive) */
  impact: number;
  /** Confidence score as a percentage (e.g. 80 for 80%) */
  confidence: number;
  /** Estimated effort in person-months (e.g. 1.0, 2.0) */
  effort: number;
  /** Calculated RICE score: (Reach * Impact * Confidence%) / Effort */
  calculatedScore: number;
  /** Step-by-step narrative reasoning behind each score parameter */
  reasoning: string;
}

/**
 * Structure of the proposed A/B testing experiment.
 */
export interface AbTestSuggestion {
  /** Core hypothesis for the proposed experiment */
  hypothesis: string;
  /** Baseline or existing user experience */
  controlVariant: string;
  /** Proposed new design or workflow variation */
  testVariant: string;
  /** Primary metric used to measure experiment success */
  successMetric: string;
}

/**
 * Complete structured analysis response containing all generated PM artifacts.
 */
export interface PmAnalysisResult {
  /** Generated PRD skeleton artifact */
  prdSkeleton: PrdSkeleton;
  /** Calculated RICE score artifact with reasoning */
  riceScore: RiceScore;
  /** Proposed A/B test suggestion artifact */
  abTestSuggestion: AbTestSuggestion;
}

/**
 * Sends a raw user complaint to the Google Gemini API with a structured prompt
 * to generate a PRD skeleton, RICE priority score with reasoning, and an A/B test suggestion.
 *
 * @param complaintText - Raw user complaint or feedback text to analyze
 * @param overrideApiKey - Optional API key override for runtime configuration
 * @returns Promise resolving to structured PmAnalysisResult containing generated artifacts
 * @throws Error if Gemini API key is missing or API call / JSON parsing fails
 */
export async function generatePmArtifacts(
  complaintText: string,
  overrideApiKey?: string
): Promise<PmAnalysisResult> {
  const apiKey = overrideApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Gemini API key is missing. Ensure process.env.GEMINI_API_KEY is configured.'
    );
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const prompt = `You are an expert AI Product Manager Copilot.
Analyze the following raw user complaint and generate structured product artifacts.

User Complaint:
"${complaintText}"

Respond strictly with valid JSON conforming to the following structure with no markdown formatting or wrap text:
{
  "prdSkeleton": {
    "problemStatement": "Detailed problem statement",
    "targetUserPersona": "Specific user persona description",
    "userStory": "As a [user], I want to [action] so that [benefit]",
    "acceptanceCriteria": ["Criterion 1", "Criterion 2", "Criterion 3"]
  },
  "riceScore": {
    "reach": 1000,
    "impact": 2.0,
    "confidence": 80,
    "effort": 1.0,
    "calculatedScore": 160,
    "reasoning": "Step-by-step rationale for Reach, Impact, Confidence, and Effort"
  },
  "abTestSuggestion": {
    "hypothesis": "Clear test hypothesis",
    "controlVariant": "Existing behavior / control",
    "testVariant": "Proposed test behavior",
    "successMetric": "Primary metric to measure"
  }
}`;

  const requestBody = {
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
      responseMimeType: 'application/json',
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
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

  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!responseText) {
    throw new Error('Gemini API returned an empty or unparseable response.');
  }

  try {
    const parsed = JSON.parse(responseText.trim()) as PmAnalysisResult;
    return parsed;
  } catch (err) {
    throw new Error(
      `Failed to parse JSON response from Gemini API: ${(err as Error).message}`
    );
  }
}
