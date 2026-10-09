import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildGeminiPrompt,
  parseGeminiResponse,
  generateProductArtifacts,
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
   * Real-world scenario: PM inputs a raw user complaint into the Copilot.
   * Expectation: Prompt builder formats the user complaint with explicit structured JSON guidelines.
   */
  it('builds a structured Gemini prompt including raw complaint text', () => {
    const rawComplaint = 'Checkout verification failed during flash sale due to OTP timeout.';
    const prompt = buildGeminiPrompt(rawComplaint);

    expect(prompt).toContain(rawComplaint);
    expect(prompt).toContain('prdSkeleton');
    expect(prompt).toContain('riceScore');
    expect(prompt).toContain('abTestSuggestion');
  });

  /**
   * Real-world scenario: PM specifies a feedback source channel tag (e.g. 'App Store') along with complaint.
   * Expectation: Prompt includes feedback source channel header to provide Gemini with source context.
   */
  it('includes feedback source channel tag in Gemini prompt when provided', () => {
    const rawComplaint = 'App crashes when opening cart page on iOS 18.';
    const prompt = buildGeminiPrompt(rawComplaint, 'App Store');

    expect(prompt).toContain(rawComplaint);
    expect(prompt).toContain('FEEDBACK SOURCE CHANNEL: App Store');
    expect(prompt).toContain('App Store');
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

    const result = await generateProductArtifacts('Users cannot complete SAML SSO login on Safari');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent');
    expect(calledUrl).toContain('key=test-gemini-api-key');

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
});
