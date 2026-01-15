import React, { useState } from 'react';
import { findMatch } from '../services/matching';

export default function WaitingPage({ userData, user }) {
  const [checking, setChecking] = useState(false);

  const manualCheck = async () => {
    setChecking(true);
    await findMatch(user.uid, userData);
    setChecking(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4A1D5E 0%, #1B7A8A 100%)', padding: '1rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
          <div style={{ width: '5rem', height: '5rem', backgroundColor: 'rgba(27, 122, 138, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem' }}>
            🔍
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#1A1A1A' }}>Finding your match...</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            We're looking for someone in the <strong>{userData?.goalCategory}</strong> category who shares your timezone and commitment style.
          </p>
          <div style={{ backgroundColor: 'rgba(27, 122, 138, 0.1)', border: '1px solid rgba(27, 122, 138, 0.3)', borderRadius: '0.5rem', padding: '1rem', fontSize: '0.875rem', color: '#1A3A52', marginBottom: '1rem' }}>
            We check for matches automatically every 5 seconds.
          </div>
          <button onClick={manualCheck} disabled={checking} style={{ width: '100%', backgroundColor: '#1B7A8A', color: '#FFFFFF', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: checking ? 'not-allowed' : 'pointer', opacity: checking ? 0.5 : 1 }}>
            {checking ? 'Checking...' : 'Check for Match Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

