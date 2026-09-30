import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ComplaintForm } from './components/ComplaintForm';

function App() {
  const [submittedComplaint, setSubmittedComplaint] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>AI-PM Copilot</h1>
      <h2>Submit Raw User Complaint</h2>
      <ComplaintForm
        onSubmit={(complaint) => {
          setSubmittedComplaint(complaint);
        }}
      />
      {submittedComplaint && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#e6fffa', border: '1px solid #319795' }}>
          <strong>Submitted:</strong> {submittedComplaint}
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
