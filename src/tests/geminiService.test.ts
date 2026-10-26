import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatSourceContextPrompt,
  buildGeminiPrompt,
  parseGeminiResponse,
  generateProductArtifacts,
  parseNonEmptyString,
} from '../services/geminiService';

describe('Gemini API Integration Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  /**
   * Real-world scenario: PM selects feedback origin channel or leaves it unassigned.
   * Expectation: Helper formats prompt header with selected channel name or default fallback.
   */
  it('formats feedback source channel context line appropriately', () => {
    expect(formatSourceContextPrompt('App Store')).toBe('FEEDBACK SOURCE CHANNEL: App Store');
    expect(formatSourceContextPrompt('  Google Play  ')).toBe('FEEDBACK SOURCE CHANNEL: Google Play');
    expect(formatSourceContextPrompt('')).toBe('FEEDBACK SOURCE CHANNEL: Unspecified Channel');
    expect(formatSourceContextPrompt(undefined)).toBe('FEEDBACK SOURCE CHANNEL: Unspecified Channel');
  });

  /**
   * Real-world scenario: PM inputs a raw user complaint into the Copilot along with source tag context.
   * Expectation: Prompt builder formats the user complaint with source channel context and explicit structured JSON guidelines.
   */
  it('builds a structured Gemini prompt including raw complaint text and source channel context', () => {
    const rawComplaint = 'Checkout verification failed during flash sale due to OTP timeout.';
    const prompt = buildGeminiPrompt(rawComplaint, 'App Store');

    expect(prompt).toContain(rawComplaint);
    expect(prompt).toContain('FEEDBACK SOURCE CHANNEL: App Store');
    expect(prompt).toContain('prdSkeleton');
    expect(prompt).toContain('riceScore');
    expect(prompt).toContain('abTestSuggestion');
  });

  /**
   * Real-world scenario: Gemini API returns output wrapped in markdown code blocks or clean JSON string.
   * Expectation: Response parser strips markdown formatting and populates structured PM artifact objects.
   */
  it('parses Gemini API JSON response and fallback defaults when fields are missing', () => {
    const jsonOutput = JSON.stringify({
      prdSkeleton: {
        problemStatement: 'Flash sale checkout OTP fails due to sms delay.',
        userPersona: 'Mobile Shopper',
        userStory: 'As a shopper, I want fast OTP delivery so I can finish purchase.',
        acceptanceCriteria: ['OTP delivered under 5s', 'Resend button enabled after 30s'],
      },
      riceScore: {
        reach: 5000,
        impact: 3,
        confidence: 90,
        effort: 1,
        reasoning: 'Reach: 5000 users/mo. Impact: High conversion drop. Confidence: 90%. Effort: 1 week.',
      },
      abTestSuggestion: {
        hypothesis: 'Adding WhatsApp OTP option will increase flash sale conversions.',
        controlVariant: 'SMS OTP only',
        testVariant: 'SMS or WhatsApp OTP selector',
        successMetric: 'Checkout completion rate',
      },
    });

    const markdownOutput = `\`\`\`json\n${jsonOutput}\n\`\`\``;
    const result = parseGeminiResponse(markdownOutput);

    expect(result.prdSkeleton.problemStatement).toBe('Flash sale checkout OTP fails due to sms delay.');
    expect(result.riceScore.score).toBe(13.5);
    expect(result.abTestSuggestion.successMetric).toBe('Checkout completion rate');
  });

  /**
   * Real-world scenario: GEMINI_API_KEY environment variable is not defined when invoking generateProductArtifacts.
   * Expectation: Throws descriptive error indicating process.env.GEMINI_API_KEY is missing.
   */
  it('throws an error if process.env.GEMINI_API_KEY is not configured', async () => {
    delete process.env.GEMINI_API_KEY;

    await expect(generateProductArtifacts('Sample complaint text over ten chars')).rejects.toThrow(
      'Missing process.env.GEMINI_API_KEY. Please set the environment variable.'
    );
  });

  /**
   * Real-world scenario: Valid GEMINI_API_KEY is provided and Gemini API returns 200 OK with candidates.
   * Expectation: Fetch is invoked with expected URL and payload, returning parsed PM artifacts.
   */
  it('calls Gemini REST API and returns parsed AnalysisResult on success', async () => {
    process.env.GEMINI_API_KEY = 'test-gemini-api-key';

    const mockApiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  prdSkeleton: {
                    problemStatement: 'SAML SSO failure on Safari.',
                    userPersona: 'Enterprise Admin',
                    userStory: 'As an admin, I want SSO to work on Safari.',
                    acceptanceCriteria: ['Safari Cookie SameSite fixed'],
                  },
                  riceScore: {
                    reach: 2000,
                    impact: 2,
                    confidence: 80,
                    effort: 1,
                    reasoning: 'Reach: 2000 admins. Impact: Medium. Confidence: 80%. Effort: 1 week.',
                  },
                  abTestSuggestion: {
                    hypothesis: 'Updating SameSite attributes will lower SSO bounce rate.',
                    controlVariant: 'Standard redirect',
                    testVariant: 'SameSite Cookie updated redirect',
                    successMetric: 'SSO Login Success Rate',
                  },
                }),
              },
            ],
          },
        },
      ],
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as Response);

    const result = await generateProductArtifacts('Users cannot complete SAML SSO login on Safari', 'Twitter / X');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent');
    expect(calledUrl).toContain('key=test-gemini-api-key');

    const calledBody = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string) as {
      contents: Array<{ parts: Array<{ text: string }> }>;
    };
    expect(calledBody.contents[0].parts[0].text).toContain('FEEDBACK SOURCE CHANNEL: Twitter / X');

    expect(result.prdSkeleton.userPersona).toBe('Enterprise Admin');
    expect(result.riceScore.score).toBe(3.2);
  });

  /**
   * Real-world scenario: Gemini API endpoint returns HTTP error response (e.g. 403 or 500).
   * Expectation: Function throws an error containing status code and error message.
   */
  it('throws error when Gemini API HTTP response is not ok', async () => {
    process.env.GEMINI_API_KEY = 'test-gemini-api-key';

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => 'API Key Invalid',
    } as Response);

    await expect(generateProductArtifacts('Users cannot complete SAML SSO login on Safari')).rejects.toThrow(
      'Gemini API request failed (403): API Key Invalid'
    );
  });

  /**
   * Real-world scenario: Gemini API returns output surrounded by conversational preamble or postamble text.
   * Expectation: Response parser extracts JSON block successfully and returns structured AnalysisResult.
   */
  it('parses Gemini API output containing conversational preamble/postamble surrounding JSON', () => {
    const rawJson = JSON.stringify({
      prdSkeleton: {
        problemStatement: 'Export to CSV fails on large datasets.',
        userPersona: 'Data Analyst',
        userStory: 'As an analyst, I want reliable CSV export so I can build reports.',
        acceptanceCriteria: ['Supports up to 100k rows'],
      },
      riceScore: {
        reach: 3000,
        impact: 2.5,
        confidence: 85,
        effort: 2,
        reasoning: 'High analyst impact.',
      },
      abTestSuggestion: {
        hypothesis: 'Background CSV export worker will eliminate timeouts.',
        controlVariant: 'Synchronous export',
        testVariant: 'Async background worker with progress bar',
        successMetric: 'CSV export success rate',
      },
    });

    const outputWithPreamble = `Here is the requested PRD analysis for your complaint:\n\`\`\`json\n${rawJson}\n\`\`\`\nHope this helps! Let me know if you need any adjustments.`;
    const result = parseGeminiResponse(outputWithPreamble);

    expect(result.prdSkeleton.problemStatement).toBe('Export to CSV fails on large datasets.');
    expect(result.riceScore.score).toBe(3.2);

    const outputUnfencedWithText = `Sure thing! Here is the JSON: ${rawJson} Hope that works!`;
    const unfencedResult = parseGeminiResponse(outputUnfencedWithText);
    expect(unfencedResult.prdSkeleton.userPersona).toBe('Data Analyst');
  });

  /**
   * Real-world scenario: Gemini API returns malformed non-JSON response string.
   * Expectation: Throws descriptive error indicating failure to parse JSON.
   */
  it('throws descriptive error when raw output contains invalid JSON syntax', () => {
    const malformedText = 'This is completely invalid response with no JSON braces or structure.';
    expect(() => parseGeminiResponse(malformedText)).toThrow('Failed to parse Gemini API JSON response');
  });

  /**
   * Real-world scenario: Gemini API returns stringified numbers, NaN, or out-of-bounds values in RICE score fields.
   * Expectation: Response parser converts stringified numbers, rejects NaN/Infinity, clamps bounds, and calculates finite score.
   */
  it('parses stringified numbers and sanitizes NaN or out-of-bound RICE metrics safely', () => {
    const jsonOutput = JSON.stringify({
      prdSkeleton: { problemStatement: 'Login error' },
      riceScore: {
        reach: '5000',
        impact: '3',
        confidence: '120',
        effort: '0',
        score: NaN,
      },
      abTestSuggestion: { hypothesis: 'Fix login' },
    });

    const result = parseGeminiResponse(jsonOutput);

    expect(result.riceScore.reach).toBe(5000);
    expect(result.riceScore.impact).toBe(3);
    expect(result.riceScore.confidence).toBe(100); // Clamped to 100%
    expect(result.riceScore.effort).toBe(0.5); // Clamped to min 0.5
    expect(Number.isFinite(result.riceScore.score)).toBe(true);
    expect(result.riceScore.score).toBe(30); // (5000/1000 * 3 * 1.0) / 0.5 = 30
  });

  /**
   * Real-world scenario: Gemini API returns corrupted or non-finite numbers (NaN, Infinity, negative effort) for RICE metrics.
   * Expectation: Response parser safely falls back to valid non-NaN default values and calculates a finite score.
   */
  it('sanitizes non-finite or NaN RICE metrics into valid numerical defaults', () => {
    const invalidNumbersJson = JSON.stringify({
      prdSkeleton: {
        problemStatement: 'Search latency spike.',
      },
      riceScore: {
        reach: null,
        impact: 'invalid',
        confidence: -50,
        effort: null,
        score: null,
      },
    });

    const result = parseGeminiResponse(invalidNumbersJson);

    expect(Number.isFinite(result.riceScore.reach)).toBe(true);
    expect(result.riceScore.reach).toBe(1000);
    expect(Number.isFinite(result.riceScore.impact)).toBe(true);
    expect(result.riceScore.impact).toBe(2);
    expect(Number.isFinite(result.riceScore.confidence)).toBe(true);
    expect(result.riceScore.confidence).toBe(80);
    expect(Number.isFinite(result.riceScore.effort)).toBe(true);
    expect(result.riceScore.effort).toBe(2);
    expect(Number.isFinite(result.riceScore.score)).toBe(true);
    expect(result.riceScore.score).toBe(0.8);
  });

  /**
   * Real-world scenario: Gemini API returns a stringified score field or a negative score.
   * Expectation: Response parser converts valid stringified scores (e.g. "15.5") to numeric 15.5 and falls back negative scores to calculatedScore.
   */
  it('parses stringified RICE score field and falls back negative scores safely', () => {
    const stringScoreJson = JSON.stringify({
      prdSkeleton: { problemStatement: 'Timeout issue' },
      riceScore: {
        reach: 1000,
        impact: 2,
        confidence: 80,
        effort: 2,
        score: '15.5',
      },
    });
    const stringResult = parseGeminiResponse(stringScoreJson);
    expect(stringResult.riceScore.score).toBe(15.5);

    const negativeScoreJson = JSON.stringify({
      prdSkeleton: { problemStatement: 'Timeout issue' },
      riceScore: {
        reach: 1000,
        impact: 2,
        confidence: 80,
        effort: 2,
        score: -10,
      },
    });
    const negativeResult = parseGeminiResponse(negativeScoreJson);
    expect(negativeResult.riceScore.score).toBe(0.8);
  });

  /**
   * Real-world scenario: Gemini API returns a non-object valid JSON payload (e.g. "null", numbers, or arrays).
   * Expectation: Response parser handles non-object JSON values without throwing TypeError and returns complete fallback objects.
   */
  it('handles non-object JSON payloads safely without throwing TypeError', () => {
    const nullResult = parseGeminiResponse('null');
    expect(nullResult.prdSkeleton.problemStatement).toBe('Problem statement derived from user complaint.');
    expect(nullResult.riceScore.score).toBe(0.8);
    expect(nullResult.abTestSuggestion.successMetric).toBe('Conversion rate');

    const numberResult = parseGeminiResponse('123');
    expect(numberResult.prdSkeleton.userPersona).toBe('Affected End User');

    const arrayResult = parseGeminiResponse('[1, 2, 3]');
    expect(arrayResult.abTestSuggestion.hypothesis).toBe('Implementing the fix will improve completion rate.');
  });

  /**
   * Real-world scenario: Gemini API returns objects, null, or whitespace for string fields.
   * Expectation: parseNonEmptyString and parseGeminiResponse convert invalid values into clean fallback strings.
   */
  it('sanitizes non-string or object inputs in text fields into valid fallback strings', () => {
    expect(parseNonEmptyString('  valid text  ', 'default')).toBe('valid text');
    expect(parseNonEmptyString({ details: 'object' }, 'default')).toBe('default');
    expect(parseNonEmptyString(null, 'default')).toBe('default');
    expect(parseNonEmptyString('   ', 'default')).toBe('default');

    const malformedStringsJson = JSON.stringify({
      prdSkeleton: {
        problemStatement: { err: 'nested object' },
        userPersona: null,
        userStory: '   ',
      },
      riceScore: {
        reasoning: 12345,
      },
      abTestSuggestion: {
        hypothesis: ['array item'],
        controlVariant: null,
        testVariant: {},
        successMetric: '',
      },
    });

    const result = parseGeminiResponse(malformedStringsJson);
    expect(result.prdSkeleton.problemStatement).toBe('Problem statement derived from user complaint.');
    expect(result.prdSkeleton.userPersona).toBe('Affected End User');
    expect(result.prdSkeleton.userStory).toBe('As a user, I want a reliable experience so that I can achieve my goals.');
    expect(result.riceScore.reasoning).toBe('RICE score calculated based on estimated reach, impact, confidence, and effort.');
    expect(result.abTestSuggestion.hypothesis).toBe('Implementing the fix will improve completion rate.');
    expect(result.abTestSuggestion.controlVariant).toBe('Current user flow');
    expect(result.abTestSuggestion.testVariant).toBe('Optimized flow addressing user feedback');
    expect(result.abTestSuggestion.successMetric).toBe('Conversion rate');
  });
});
