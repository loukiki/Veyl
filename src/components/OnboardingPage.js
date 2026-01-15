import React, { useState } from 'react';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { findMatch } from '../services/matching';

export default function OnboardingPage({ user, setCurrentPage, setUserData }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    goalCategory: '',
    goalDescription: '',
    timezone: '',
    communicationStyle: 'text'
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Fitness & Health', 'Learning & Skills', 'Business & Career', 'Creative Projects'];
  const timezones = ['GMT-12', 'GMT-11', 'GMT-10', 'GMT-9', 'GMT-8', 'GMT-7', 'GMT-6', 'GMT-5', 'GMT-4', 'GMT-3', 'GMT-2', 'GMT-1', 'GMT+0', 'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4', 'GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12'];

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        onboardingComplete: true,
        status: 'seeking_partner',
        updatedAt: serverTimestamp()
      });

      const matched = await findMatch(user.uid, formData);

      if (matched) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUserData(userDoc.data());
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('waiting');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4A1D5E 0%, #1B7A8A 100%)', padding: '1rem' }}>
      <div style={{ maxWidth: '42rem', width: '100%', backgroundColor: '#FFFFFF', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1A1A1A' }}>Let's set up your profile</h1>
          <p style={{ color: '#6b7280' }}>Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#1A1A1A' }}>What's your name?</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '1rem' }}
                placeholder="Enter your first name (or username)"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#1A1A1A' }}>What's your timezone?</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '1rem' }}
              >
                <option value="">Select timezone</option>
                {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.timezone}
              style={{ width: '100%', backgroundColor: '#1B7A8A', color: '#FFFFFF', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: (!formData.name || !formData.timezone) ? 'not-allowed' : 'pointer', opacity: (!formData.name || !formData.timezone) ? 0.5 : 1, fontSize: '1rem' }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.75rem', color: '#1A1A1A' }}>What's your goal category?</label>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, goalCategory: cat })}
                    style={{ padding: '1rem', border: formData.goalCategory === cat ? '2px solid #1B7A8A' : '2px solid #e5e7eb', backgroundColor: formData.goalCategory === cat ? 'rgba(27, 122, 138, 0.1)' : '#FFFFFF', borderRadius: '0.5rem', textAlign: 'left', cursor: 'pointer', fontWeight: '600', color: '#1A1A1A' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, border: '2px solid #e5e7eb', backgroundColor: '#FFFFFF', color: '#1A1A1A', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>
                Back
              </button>
              <button onClick={() => setStep(3)} disabled={!formData.goalCategory} style={{ flex: 1, backgroundColor: '#1B7A8A', color: '#FFFFFF', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: !formData.goalCategory ? 'not-allowed' : 'pointer', opacity: !formData.goalCategory ? 0.5 : 1 }}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#1A1A1A' }}>Describe your specific goal</label>
              <textarea
                value={formData.goalDescription}
                onChange={(e) => setFormData({ ...formData, goalDescription: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', height: '8rem', fontFamily: 'inherit', fontSize: '1rem' }}
                placeholder="E.g., 'I want to lose 30 pounds in 3 months' or 'Learn Python programming'"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.75rem', color: '#1A1A1A' }}>Preferred communication style</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  onClick={() => setFormData({ ...formData, communicationStyle: 'text' })}
                  style={{ padding: '1rem', border: formData.communicationStyle === 'text' ? '2px solid #1B7A8A' : '2px solid #e5e7eb', backgroundColor: formData.communicationStyle === 'text' ? 'rgba(27, 122, 138, 0.1)' : '#FFFFFF', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#1A1A1A' }}>Text Messages</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Chat when convenient</div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, communicationStyle: 'scheduled' })}
                  style={{ padding: '1rem', border: formData.communicationStyle === 'scheduled' ? '2px solid #1B7A8A' : '2px solid #e5e7eb', backgroundColor: formData.communicationStyle === 'scheduled' ? 'rgba(27, 122, 138, 0.1)' : '#FFFFFF', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#1A1A1A' }}>Scheduled Check-ins</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Weekly deep-dives</div>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, border: '2px solid #e5e7eb', backgroundColor: '#FFFFFF', color: '#1A1A1A', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>
                Back
              </button>
              <button onClick={handleComplete} disabled={!formData.goalDescription || loading} style={{ flex: 1, backgroundColor: '#1B7A8A', color: '#FFFFFF', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: (!formData.goalDescription || loading) ? 'not-allowed' : 'pointer', opacity: (!formData.goalDescription || loading) ? 0.5 : 1 }}>
                {loading ? 'Finding match...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

