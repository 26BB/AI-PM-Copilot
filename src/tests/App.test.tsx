/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../main';
import * as geminiService from '../services/geminiService';

vi.mock('../services/geminiService', () => ({
  generateProductArtifacts: vi.fn(),
}));

describe('App Integration Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Real-world scenario: User opens the AI-PM Copilot application.
   * Expectation: Header, raw complaint form, and default source tag selector options are rendered.
   */
  it('renders the application header, complaint form, and source channel tag selector', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'AI-PM Copilot' })).toBeDefined();
    expect(screen.getByRole('button', { name: /App Store/i })).toBeDefined();
    expect(screen.getByRole('textbox', { name: /raw user complaint/i })).toBeDefined();
  });

  /**
   * Real-world scenario: PM selects a source tag ('Twitter / X'), submits a complaint, and views generated artifacts.
   * Expectation: generateProductArtifacts is called with the complaint and selected tag, and result displays.
   */
  it('allows selecting a source tag and submitting a complaint to display PRD artifacts', async () => {
    const mockAnalysisResult: geminiService.AnalysisResult = {
      prdSkeleton: {
        problemStatement: 'Checkout verification is failing on high traffic.',
        userPersona: 'E-commerce Shopper',
        userStory: 'As a shopper, I want fast checkout so that I can buy items quickly.',
        acceptanceCriteria: ['Must verify in < 1s', 'Must log errors'],
      },
      riceScore: {
        reach: 8,
        impact: 3,
        confidence: 80,
        effort: 2,
        score: 9.6,
        reasoning: 'High reach across all checkout flows.',
      },
      abTestSuggestion: {
        hypothesis: 'Simplifying checkout OTP will increase completion.',
        controlVariant: '6-digit SMS OTP',
        testVariant: '1-click biometric auth',
        successMetric: 'Checkout Completion Rate',
      },
    };

    vi.mocked(geminiService.generateProductArtifacts).mockResolvedValueOnce(mockAnalysisResult);

    render(<App />);

    const twitterTagButton = screen.getByRole('button', { name: /Twitter \/ X/i });
    fireEvent.click(twitterTagButton);

    const textarea = screen.getByRole('textbox', { name: /raw user complaint/i });
    fireEvent.change(textarea, { target: { value: 'Checkout verification failed during flash sale for many users' } });

    const submitBtn = screen.getByRole('button', { name: /Generate PRD & RICE Score/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(geminiService.generateProductArtifacts).toHaveBeenCalledWith(
        'Checkout verification failed during flash sale for many users',
        'Twitter / X'
      );
    });

    expect(screen.getAllByText(/Twitter \/ X/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Checkout verification is failing on high traffic.')).toBeDefined();
    expect(screen.getAllByText(/9\.6/).length).toBeGreaterThan(0);
    expect(screen.getByText('Simplifying checkout OTP will increase completion.')).toBeDefined();
  });

  /**
   * Real-world scenario: Gemini API call fails due to invalid API key or timeout.
   * Expectation: Error message is displayed with option to retry.
   */
  it('displays error message and handles retry when API call fails', async () => {
    vi.mocked(geminiService.generateProductArtifacts)
      .mockRejectedValueOnce(new Error('GEMINI_API_KEY environment variable is missing.'))
      .mockResolvedValueOnce({
        prdSkeleton: {
          problemStatement: 'Recovered problem statement',
          userPersona: 'User',
          userStory: 'As a user...',
          acceptanceCriteria: ['Criteria 1'],
        },
        riceScore: { reach: 5, impact: 2, confidence: 80, effort: 1, score: 8, reasoning: 'Ok' },
        abTestSuggestion: { hypothesis: 'Hypothesis', controlVariant: 'A', testVariant: 'B', successMetric: 'Metric' },
      });

    render(<App />);

    const textarea = screen.getByRole('textbox', { name: /raw user complaint/i });
    fireEvent.change(textarea, { target: { value: 'Checkout error on app load repeatedly' } });

    const submitBtn = screen.getByRole('button', { name: /Generate PRD & RICE Score/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('GEMINI_API_KEY environment variable is missing.')).toBeDefined();
    });

    const retryBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText('Recovered problem statement')).toBeDefined();
    });
  });
});
