/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiceScoreDisplay, getPriorityTier, formatRiceMetric } from '../components/RiceScoreDisplay';
import { RiceScoreReasoning } from '../services/geminiService';

describe('getPriorityTier logic', () => {
  /**
   * Real-world scenario: Feature evaluation produces a high RICE score (>= 10).
   * Expectation: Helper function categorizes the score as 'High Priority'.
   */
  it('categorizes scores 10 or greater as High Priority', () => {
    expect(getPriorityTier(10)).toBe('High Priority');
    expect(getPriorityTier(80.5)).toBe('High Priority');
  });

  /**
   * Real-world scenario: Feature evaluation produces a moderate RICE score (between 3 and 10).
   * Expectation: Helper function categorizes the score as 'Medium Priority'.
   */
  it('categorizes scores between 3 and 10 as Medium Priority', () => {
    expect(getPriorityTier(3)).toBe('Medium Priority');
    expect(getPriorityTier(7.5)).toBe('Medium Priority');
  });

  /**
   * Real-world scenario: Low impact or high effort feature yields a low RICE score (< 3).
   * Expectation: Helper function categorizes the score as 'Low Priority'.
   */
  it('categorizes scores lower than 3 as Low Priority', () => {
    expect(getPriorityTier(2.9)).toBe('Low Priority');
    expect(getPriorityTier(0.5)).toBe('Low Priority');
  });
});

describe('formatRiceMetric helper logic', () => {
  /**
   * Real-world scenario: Displaying user reach metrics with thousands formatting and units.
   * Expectation: Reach metric is formatted with comma separators and 'users/mo' unit.
   */
  it('formats reach metric with commas and unit label', () => {
    const formatted = formatRiceMetric(12500, 'reach');
    expect(formatted).toBe('12,500 users/mo');
  });

  /**
   * Real-world scenario: Displaying impact score, confidence percentage, effort in person-weeks, and RICE score.
   * Expectation: Metrics are formatted with appropriate decimal precision and unit strings.
   */
  it('formats impact, confidence, effort, and score metrics correctly', () => {
    expect(formatRiceMetric(2, 'impact')).toBe('2.0 (scale 0.5–3.0)');
    expect(formatRiceMetric(85, 'confidence')).toBe('85%');
    expect(formatRiceMetric(1, 'effort')).toBe('1 person-week');
    expect(formatRiceMetric(2.5, 'effort')).toBe('2.5 person-weeks');
    expect(formatRiceMetric(14.28, 'score')).toBe('14.3');
  });
});

describe('RiceScoreDisplay Component', () => {
  const sampleRice: RiceScoreReasoning = {
    reach: 10000,
    impact: 3.0,
    confidence: 90,
    effort: 2.0,
    score: 13.5,
    reasoning:
      'Reach: 10,000 users/mo affected by payment gateway errors. Impact: 3.0 (Massive conversion loss). Confidence: 90% via checkout drop-off logs. Effort: 2 person-weeks to resolve API retries.',
  };

  /**
   * Real-world scenario: PM renders the RICE priority score breakdown after AI synthesis.
   * Expectation: Calculated score, High Priority badge, metrics grid, and reasoning text render accurately.
   */
  it('renders score badge, priority tier badge, metrics grid, and reasoning content', () => {
    render(<RiceScoreDisplay riceScore={sampleRice} />);

    expect(screen.getByRole('heading', { name: /rice priority score & reasoning/i })).toBeDefined();
    expect(screen.getByText('RICE Score: 13.5')).toBeDefined();
    expect(screen.getByText('High Priority')).toBeDefined();
    expect(screen.getByText('10,000 users/mo')).toBeDefined();
    expect(screen.getByText('3.0 (scale 0.5–3.0)')).toBeDefined();
    expect(screen.getByText('90%')).toBeDefined();
    expect(screen.getByText('2 person-weeks')).toBeDefined();
    expect(
      screen.getByText(
        'Reach: 10,000 users/mo affected by payment gateway errors. Impact: 3.0 (Massive conversion loss). Confidence: 90% via checkout drop-off logs. Effort: 2 person-weeks to resolve API retries.'
      )
    ).toBeDefined();
  });

  /**
   * Real-world scenario: RICE score response arrives with empty reasoning string.
   * Expectation: Component displays a fallback message for step-by-step reasoning.
   */
  it('displays fallback message when reasoning string is empty', () => {
    const emptyReasoningRice: RiceScoreReasoning = {
      ...sampleRice,
      reasoning: '',
    };

    render(<RiceScoreDisplay riceScore={emptyReasoningRice} />);

    expect(
      screen.getByText('No specific reasoning provided for this RICE score calculation.')
    ).toBeDefined();
  });
});
