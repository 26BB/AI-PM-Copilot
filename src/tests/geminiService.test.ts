import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generatePmArtifacts, PmAnalysisResult } from '../services/geminiService';

describe('Gemini API Service (generatePmArtifacts)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  /**
   * Real-World Scenario: PM submits a raw complaint when process.env.GEMINI_API_KEY is configured.
   * Expectation: API is called with structured prompt payload and returns parsed PmAnalysisResult.
   */
  it('successfully generates PM artifacts when GEMINI_API_KEY is set and API returns valid JSON', async () => {
    process.env.GEMINI_API_KEY = 'test-gemini-key-123';

    const mockAnalysisResult: PmAnalysisResult = {
      prdSkeleton: {
        problemStatement: 'Checkout verification failed during flash sale',
        targetUserPersona: 'Online Shopper',
        userStory: 'As a shopper, I want fast checkout verification so that I do not miss limited-time flash sales.',
        acceptanceCriteria: ['Verification completes under 2 seconds', 'Retry option shown on timeout'],
      },
      riceScore: {
        reach: 5000,
        impact: 2.0,
        confidence: 85,
        effort: 1.0,
        calculatedScore: 850,
        reasoning: 'High reach during sales, major impact on conversion rate.',
      },
      abTestSuggestion: {
        hypothesis: 'Optimizing OTP delivery will increase checkout conversion by 15%.',
        controlVariant: 'Standard SMS OTP',
        testVariant: 'Instant Push Notification / WhatsApp fallback',
        successMetric: 'Checkout Completion Rate',
      },
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify(mockAnalysisResult),
                },
              ],
            },
          },
        ],
      }),
    } as Response);

    const complaint = 'Checkout verification failed during flash sale when heavy load occurred.';
    const result = await generatePmArtifacts(complaint);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const callUrl = fetchSpy.mock.calls[0][0] as string;
    expect(callUrl).toContain('key=test-gemini-key-123');

    expect(result).toEqual(mockAnalysisResult);
    expect(result.prdSkeleton.problemStatement).toBe('Checkout verification failed during flash sale');
    expect(result.riceScore.calculatedScore).toBe(850);
  });

  /**
   * Real-World Scenario: Environment lacks process.env.GEMINI_API_KEY and no override key is passed.
   * Expectation: Function throws an explicit error indicating missing API key configuration.
   */
  it('throws an error when process.env.GEMINI_API_KEY is missing and no override key is supplied', async () => {
    delete process.env.GEMINI_API_KEY;

    await expect(generatePmArtifacts('Users cannot reset password')).rejects.toThrow(
      'Gemini API key is missing. Ensure process.env.GEMINI_API_KEY is configured.'
    );
  });

  /**
   * Real-World Scenario: Gemini API key is supplied via override parameter.
   * Expectation: Override key is used in API request URL even if process.env.GEMINI_API_KEY is missing.
   */
  it('uses overrideApiKey parameter when supplied', async () => {
    delete process.env.GEMINI_API_KEY;

    const mockResult: PmAnalysisResult = {
      prdSkeleton: {
        problemStatement: 'SAML SSO login error',
        targetUserPersona: 'Enterprise Admin',
        userStory: 'As an admin, I want SAML SSO to succeed.',
        acceptanceCriteria: ['SSO login succeeds'],
      },
      riceScore: {
        reach: 1000,
        impact: 3,
        confidence: 90,
        effort: 2,
        calculatedScore: 135,
        reasoning: 'Critical enterprise blocker.',
      },
      abTestSuggestion: {
        hypothesis: 'Improved error message reduces support tickets.',
        controlVariant: 'Generic error text',
        testVariant: 'Detailed SAML diagnostics',
        successMetric: 'Support Ticket Volume',
      },
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify(mockResult) }],
            },
          },
        ],
      }),
    } as Response);

    const result = await generatePmArtifacts('SAML SSO login failure', 'override-key-456');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const callUrl = fetchSpy.mock.calls[0][0] as string;
    expect(callUrl).toContain('key=override-key-456');
    expect(result).toEqual(mockResult);
  });

  /**
   * Real-World Scenario: Gemini API endpoint returns an HTTP 401 Unauthorized or HTTP 500 server error.
   * Expectation: Function throws an error detailing the HTTP status code and response body.
   */
  it('throws an error when Gemini API returns a non-200 HTTP response', async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'API key not valid. Please pass a valid API key.',
    } as Response);

    await expect(generatePmArtifacts('Invoice calculation issue')).rejects.toThrow(
      'Gemini API error (401): API key not valid. Please pass a valid API key.'
    );
  });

  /**
   * Real-World Scenario: Gemini API responds with non-JSON text or malformed output.
   * Expectation: Function throws a JSON parsing error explaining the failure.
   */
  it('throws an error when Gemini API returns invalid JSON formatting', async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'NOT_VALID_JSON' }],
            },
          },
        ],
      }),
    } as Response);

    await expect(generatePmArtifacts('Page load slow on dashboard')).rejects.toThrow(
      /Failed to parse JSON response from Gemini API/
    );
  });
});
