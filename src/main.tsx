import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ComplaintForm } from './components/ComplaintForm';
import { PrdSkeletonDisplay } from './components/PrdSkeletonDisplay';
import { RiceScoreDisplay } from './components/RiceScoreDisplay';
import { AbTestDisplay } from './components/AbTestDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { generateProductArtifacts, AnalysisResult } from './services/geminiService';

export function App(): React.JSX.Element {
  const [complaintText, setComplaintText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedSourceTag, setSelectedSourceTag] = useState<string>('App Store');

  const handleGenerateArtifacts = async (complaint: string, sourceTag?: string): Promise<void> => {
    setComplaintText(complaint);
    const activeTag = sourceTag || selectedSourceTag;
    if (sourceTag) {
      setSelectedSourceTag(sourceTag);
    }
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateProductArtifacts(complaint, activeTag);
      setAnalysisResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate PRD artifacts from Gemini API.';
      setError(message);
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (): void => {
    if (complaintText) {
      void handleGenerateArtifacts(complaintText);
    }
  };

  return (
    <div
      className="app-container"
      style={{
        maxWidth: '720px',
        width: '100%',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <header className="app-header" style={{ marginBottom: '20px', textAlign: 'left' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.25rem)', margin: '0 0 8px 0', color: '#1a202c' }}>
          AI-PM Copilot
        </h1>
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#4a5568' }}>
          Paste a raw user complaint to generate a PRD skeleton, RICE priority score, and A/B test suggestion in seconds.
        </p>
      </header>

      <main className="app-main">
        <ComplaintForm onSubmit={handleGenerateArtifacts} isLoading={isLoading} />

        {isLoading && (
          <LoadingSpinner message="Analyzing complaint with Gemini AI to generate PRD skeleton, RICE score, & A/B test..." />
        )}

        {error && !isLoading && (
          <ErrorMessage error={error} onRetry={complaintText ? handleRetry : undefined} />
        )}

        {!isLoading && analysisResult && (
          <div className="analysis-results-container" style={{ marginTop: '24px' }}>
            <div
              className="submitted-context-banner"
              style={{
                padding: '12px 16px',
                background: '#e6fffa',
                border: '1px solid #319795',
                marginBottom: '20px',
                borderRadius: '8px',
                wordBreak: 'break-word',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ marginBottom: '4px' }}>
                <strong>Source Channel:</strong> {selectedSourceTag}
              </div>
              <div>
                <strong>Submitted Complaint:</strong> {complaintText}
              </div>
            </div>
            <PrdSkeletonDisplay prd={analysisResult.prdSkeleton} />
            <RiceScoreDisplay riceScore={analysisResult.riceScore} />
            <AbTestDisplay abTest={analysisResult.abTestSuggestion} />
          </div>
        )}
      </main>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
