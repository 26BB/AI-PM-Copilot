import React from 'react';
import { AbTestSuggestion } from '../services/geminiService';
import { CopyButton } from './CopyButton';

export interface AbTestDisplayProps {
  /** A/B experiment suggestion containing hypothesis, variants, and primary success metric */
  abTest: AbTestSuggestion;
  /** Optional custom CSS class name for container styling */
  className?: string;
}

/**
 * Formats success metric label with default fallback if unassigned or empty.
 *
 * @param metric - Raw success metric string
 * @returns Cleaned or default success metric string
 */
export function formatAbTestMetric(metric?: string): string {
  if (!metric || !metric.trim()) {
    return 'Conversion / Completion Rate';
  }
  return metric.trim();
}

/**
 * Formats A/B test setup into plain text format suitable for copying to clipboard.
 *
 * @param abTest - AbTestSuggestion object
 * @returns Formatted plain text string of A/B experiment details
 */
export function formatAbTestSummaryText(abTest: AbTestSuggestion): string {
  const metric = formatAbTestMetric(abTest.successMetric);
  return `Hypothesis: ${abTest.hypothesis || 'Implementing proposed changes will resolve customer friction.'}
Control Variant (A): ${abTest.controlVariant || 'Current baseline experience'}
Test Variant (B): ${abTest.testVariant || 'Proposed solution experience'}
Primary Success Metric: ${metric}`;
}

/**
 * Renders the A/B Test Suggestion component displaying the feature hypothesis,
 * control variant, proposed test variant, and target primary success metric.
 *
 * @param props - AbTestDisplayProps containing abTest data and optional class name
 * @returns React JSX element displaying formatted A/B experiment details
 */
export function AbTestDisplay({ abTest, className = '' }: AbTestDisplayProps): React.JSX.Element {
  const formattedMetric = formatAbTestMetric(abTest.successMetric);
  const copySummaryText = formatAbTestSummaryText(abTest);

  return (
    <section
      className={`ab-test-card ${className}`.trim()}
      aria-label="A/B Test Suggestion Output"
      style={{ marginTop: '20px' }}
    >
      <header className="ab-test-header" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="ab-test-title" style={{ margin: '0' }}>🧪 A/B Test Suggestion</h3>
        <CopyButton textToCopy={copySummaryText} label="Copy A/B Test" copiedLabel="A/B Test Copied!" />
      </header>

      <div className="ab-test-body">
        <div className="ab-test-section hypothesis-section" style={{ marginBottom: '16px' }}>
          <h4 className="ab-test-section-title" style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#2d3748' }}>
            Hypothesis
          </h4>
          <p className="ab-test-section-content" style={{ margin: 0, lineHeight: 1.5 }}>
            {abTest.hypothesis || 'Implementing proposed changes will resolve customer friction.'}
          </p>
        </div>

        <div
          className="ab-test-variants-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div
            className="ab-test-variant-item control-variant"
            style={{ padding: '12px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}
          >
            <div className="variant-label" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', marginBottom: '4px' }}>
              Control Variant (A):
            </div>
            <div className="variant-description" style={{ fontSize: '0.9rem', color: '#2d3748' }}>
              {abTest.controlVariant || 'Current baseline experience'}
            </div>
          </div>

          <div
            className="ab-test-variant-item test-variant"
            style={{ padding: '12px', background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: '6px' }}
          >
            <div className="variant-label" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#22543d', marginBottom: '4px' }}>
              Test Variant (B):
            </div>
            <div className="variant-description" style={{ fontSize: '0.9rem', color: '#1a202c' }}>
              {abTest.testVariant || 'Proposed solution experience'}
            </div>
          </div>
        </div>

        <div className="ab-test-section metric-section" style={{ background: '#edf2f7', padding: '10px 12px', borderRadius: '6px' }}>
          <span className="metric-label" style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#4a5568' }}>
            Primary Success Metric:
          </span>{' '}
          <span className="metric-value" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2b6cb0' }}>
            {formattedMetric}
          </span>
        </div>
      </div>
    </section>
  );
}
