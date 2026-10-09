import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ComplaintForm } from './components/ComplaintForm';
import { SourceTag, getSourceTagIcon } from './components/SourceTagSelector';
import { PrdSkeletonDisplay } from './components/PrdSkeletonDisplay';
import { RiceScoreDisplay } from './components/RiceScoreDisplay';
import { AbTestDisplay } from './components/AbTestDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { generateProductArtifacts, AnalysisResult } from './services/geminiService';

export function App(): React.JSX.Element {
  const [complaintText, setComplaintText] = useState<string>('');
  const [selectedSourceTag, setSelectedSourceTag] = useState<SourceTag | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateArtifacts = async (complaint: string, sourceTag?: SourceTag | null): Promise<void> => {
    setComplaintText(complaint);
    setSelectedSourceTag(sourceTag || null);
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateProductArtifacts(complaint, sourceTag);
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
      void handleGenerateArtifacts(complaintText, selectedSourceTag);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>AI-PM Copilot</h1>
      <h2>Submit Raw User Complaint</h2>
      <ComplaintForm onSubmit={handleGenerateArtifacts} isLoading={isLoading} />

      {isLoading && (
        <LoadingSpinner message="Analyzing complaint with Gemini AI to generate PRD skeleton, RICE score, & A/B test..." />
      )}

      {error && !isLoading && (
        <ErrorMessage error={error} onRetry={complaintText ? handleRetry : undefined} />
      )}

      {!isLoading && analysisResult && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ padding: '10px', background: '#e6fffa', border: '1px solid #319795', marginBottom: '20px', borderRadius: '4px' }}>
            {selectedSourceTag && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  background: '#319795',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginRight: '8px',
                }}
              >
                {getSourceTagIcon(selectedSourceTag)} {selectedSourceTag}
              </span>
            )}
            <strong>Submitted Complaint:</strong> {complaintText}
          </div>
          <PrdSkeletonDisplay prd={analysisResult.prdSkeleton} />
          <RiceScoreDisplay riceScore={analysisResult.riceScore} />
          <AbTestDisplay abTest={analysisResult.abTestSuggestion} />
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
