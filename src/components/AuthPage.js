import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          createdAt: serverTimestamp(),
          onboardingComplete: false,
          partnerId: null,
          isPremium: false
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4A1D5E 0%, #1B7A8A 100%)', padding: '1rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#FFFFFF' }}>
            Veyl
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem' }}>Accountability without the performance</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1A1A1A' }}>
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#1A1A1A' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '1rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#1A1A1A' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '1rem' }}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#1B7A8A', color: '#FFFFFF', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, fontSize: '1rem' }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ color: '#1B7A8A', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
          <p style={{ marginBottom: '0.5rem' }}>Match with an accountability partner</p>
          <p style={{ fontWeight: '600' }}>$5/month or $20/6 months</p>
        </div>
      </div>
    </div>
  );
}

