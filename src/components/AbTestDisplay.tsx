import React from 'react';
import { AbTestSuggestion } from '../services/geminiService';

export interface AbTestDisplayProps {
  /** A/B test suggestion containing hypothesis, control variant, test variant, and success metric */
  abTest: AbTestSuggestion;
  /** Optional custom CSS class name for container styling */
  className?: string;
}

/**
 * Normalizes an A/B test suggestion object, ensuring fallback values exist for any missing or empty fields.
 *
 * @param abTest - Partial or full AbTestSuggestion object
 * @returns Fully populated AbTestSuggestion object with defaults
 */
export function normalizeAbTestSuggestion(abTest?: Partial<AbTestSuggestion>): AbTestSuggestion {
  return {
    hypothesis: abTest?.hypothesis?.trim() || 'Implementing proposed enhancement will improve user retention and conversion.',
    controlVariant: abTest?.controlVariant?.trim() || 'Current user flow without modification',
    testVariant: abTest?.testVariant?.trim() || 'Optimized user flow addressing reported complaint',
    successMetric: abTest?.successMetric?.trim() || 'Primary conversion / completion rate',
  };
}

/**
 * Renders the A/B Test Suggestion output component displaying test hypothesis,
 * control variant, treatment variant, and primary success metric.
 *
 * @param props - AbTestDisplayProps containing the abTest object and optional class name
 * @returns React JSX element displaying formatted A/B test proposal details
 */
export function AbTestDisplay({ abTest, className = '' }: AbTestDisplayProps): React.JSX.Element {
  const normalized = normalizeAbTestSuggestion(abTest);

  return (
    <section className={`ab-test-card ${className}`.trim()} aria-label="A/B Test Suggestion Output" style={{ marginTop: '20px' }}>
      <header className="ab-test-header" style={{ marginBottom: '12px' }}>
        <h3 className="ab-test-title" style={{ margin: '0 0 8px 0' }}>🧪 A/B Test Suggestion</h3>
      </header>

      <div className="ab-test-body">
        <div className="ab-test-section hypothesis-section" style={{ marginBottom: '16px' }}>
          <h4 className="ab-test-section-title" style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#2d3748' }}>Hypothesis</h4>
          <p className="ab-test-section-content" style={{ margin: 0, lineHeight: 1.5 }}>{normalized.hypothesis}</p>
        </div>

        <div className="ab-test-variants-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div className="ab-test-variant control-variant" style={{ padding: '12px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            <div className="variant-label" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568', marginBottom: '4px' }}>Control (Variant A)</div>
            <div className="variant-description" style={{ fontSize: '0.9rem', color: '#2d3748' }}>{normalized.controlVariant}</div>
          </div>

          <div className="ab-test-variant test-variant" style={{ padding: '12px', background: '#ebf8ff', border: '1px solid #bee3f8', borderRadius: '6px' }}>
            <div className="variant-label" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2b6cb0', marginBottom: '4px' }}>Treatment (Variant B)</div>
            <div className="variant-description" style={{ fontSize: '0.9rem', color: '#2c5282' }}>{normalized.testVariant}</div>
          </div>
        </div>

        <div className="ab-test-section success-metric-section">
          <h4 className="ab-test-section-title" style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#2d3748' }}>Success Metric</h4>
          <p className="ab-test-section-content" style={{ margin: 0, fontWeight: '600', color: '#2f855a' }}>{normalized.successMetric}</p>
        </div>
      </div>
    </section>
  );
}
