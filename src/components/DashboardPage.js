import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import OverviewView from './OverviewView';
import ChatView from './ChatView';
import CheckinView from './CheckinView';

export default function DashboardPage({ user, userData, setUserData }) {
  const [view, setView] = useState('overview');
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    if (userData?.partnerId) {
      getDoc(doc(db, 'users', userData.partnerId)).then(docSnap => {
        if (docSnap.exists()) setPartner(docSnap.data());
      });
    }
  }, [userData]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #e5e7eb', padding: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1A1A1A' }}>Veyl</h1>
          <button onClick={() => signOut(auth)} style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Sign Out</button>
        </div>
      </header>

      <nav style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem', display: 'flex', gap: '1.5rem' }}>
          {['overview', 'chat', 'checkin'].map(tab => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              style={{
                padding: '1rem 0',
                color: view === tab ? '#1B7A8A' : '#6b7280',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                borderBottom: view === tab ? '2px solid #1B7A8A' : 'none',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {tab === 'checkin' ? 'Check-In' : tab}
            </button>
          ))}
        </div>
      </nav>

      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1rem' }}>
        {view === 'overview' && <OverviewView userData={userData} partner={partner} />}
        {view === 'chat' && <ChatView user={user} userData={userData} partner={partner} setUserData={setUserData} />}
        {view === 'checkin' && <CheckinView user={user} userData={userData} partner={partner} />}
      </main>
    </div>
  );
}

