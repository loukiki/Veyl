import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import AuthPage from './components/AuthPage';
import OnboardingPage from './components/OnboardingPage';
import WaitingPage from './components/WaitingPage';
import DashboardPage from './components/DashboardPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);

          if (!data.onboardingComplete) {
            setCurrentPage('onboarding');
          } else if (!data.partnerId) {
            setCurrentPage('waiting');
          } else {
            setCurrentPage('dashboard');
          }
        }
      } else {
        setUser(null);
        setUserData(null);
        setCurrentPage('login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentPage === 'waiting' && user) {
      const interval = setInterval(async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.partnerId) {
            setUserData(data);
            setCurrentPage('dashboard');
          }
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentPage, user]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1A1A1A' }}>Veyl</h1>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage />;
  if (currentPage === 'onboarding') {
    return <OnboardingPage user={user} setCurrentPage={setCurrentPage} setUserData={setUserData} />;
  }
  if (currentPage === 'waiting') return <WaitingPage userData={userData} user={user} />;
  return <DashboardPage user={user} userData={userData} setUserData={setUserData} />;
}
