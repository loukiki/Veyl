import React from 'react';

export default function OverviewView({ userData, partner }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1A1A1A' }}>Your Goal</h3>
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Category</div>
          <div style={{ fontWeight: '500', color: '#1A1A1A' }}>{userData?.goalCategory}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Description</div>
          <div style={{ color: '#1A1A1A' }}>{userData?.goalDescription}</div>
        </div>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1A1A1A' }}>Your Partner</h3>
        {partner ? (
          <>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Name</div>
              <div style={{ fontWeight: '500', color: '#1A1A1A' }}>{partner.name}</div>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Goal</div>
              <div style={{ color: '#1A1A1A' }}>{partner.goalDescription}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Timezone</div>
              <div style={{ color: '#1A1A1A' }}>{partner.timezone}</div>
            </div>
          </>
        ) : (
          <div style={{ color: '#6b7280' }}>Loading partner info...</div>
        )}
      </div>
    </div>
  );
}

