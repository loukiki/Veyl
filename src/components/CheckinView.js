import React, { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../firebase';

export default function CheckinView({ user, userData, partner }) {
  const [checkInType, setCheckInType] = useState(null);
  const [dailyStatus, setDailyStatus] = useState('');
  const [dailyNote, setDailyNote] = useState('');
  const [weeklyStatus, setWeeklyStatus] = useState('');
  const [weeklyLearning, setWeeklyLearning] = useState('');
  const [weeklyPattern, setWeeklyPattern] = useState('');
  const [weeklyChange, setWeeklyChange] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checkIns, setCheckIns] = useState([]);

  useEffect(() => {
    if (!user) return;

    const checkInsRef = collection(db, 'checkins');
    const q = query(checkInsRef, where('userId', '==', user.uid), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach(docSnapshot => items.push({ id: docSnapshot.id, ...docSnapshot.data() }));
      setCheckIns(items);
    });

    return () => unsubscribe();
  }, [user]);

  const submitDailyCheckIn = async () => {
    if (!dailyStatus) {
      alert('Please select how your day went');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'checkins'), {
        userId: user.uid,
        partnerId: userData.partnerId,
        type: 'daily',
        status: dailyStatus,
        note: dailyNote,
        timestamp: serverTimestamp()
      });

      if (dailyStatus === 'no' && userData.partnerId) {
        await addDoc(collection(db, 'notifications'), {
          recipientId: userData.partnerId,
          senderId: user.uid,
          message: `${userData.name} is struggling today. Send them some support!`,
          timestamp: serverTimestamp()
        });
      }

      setSubmitted(true);
      setDailyStatus('');
      setDailyNote('');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitWeeklyCheckIn = async () => {
    if (!weeklyStatus || !weeklyLearning || !weeklyPattern || !weeklyChange) {
      alert('Please answer all reflection questions');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'checkins'), {
        userId: user.uid,
        partnerId: userData.partnerId,
        type: 'weekly',
        status: weeklyStatus,
        learning: weeklyLearning,
        pattern: weeklyPattern,
        change: weeklyChange,
        timestamp: serverTimestamp()
      });

      if ((weeklyStatus === 'didnt' || weeklyStatus === 'rethinking') && userData.partnerId) {
        await addDoc(collection(db, 'notifications'), {
          recipientId: userData.partnerId,
          senderId: user.uid,
          message: `${userData.name} is struggling this week. Send them some support!`,
          timestamp: serverTimestamp()
        });
      }

      setSubmitted(true);
      setWeeklyStatus('');
      setWeeklyLearning('');
      setWeeklyPattern('');
      setWeeklyChange('');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', padding: '2rem', textAlign: 'center', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1A1A1A' }}>Check-in Submitted!</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Great job staying accountable. {partner?.name} will see your update.
          </p>
          <button
            onClick={() => { setSubmitted(false); setCheckInType(null); }}
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#1B7A8A', color: '#FFFFFF', borderRadius: '0.5rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}
          >
            Submit Another Check-in
          </button>
        </div>
      </div>
    );
  }

  if (!checkInType) {
    return (
      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1A1A1A' }}>Choose Check-in Type</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Daily check-ins track your day-to-day progress. Weekly check-ins are deeper reflections on your overall journey.
          </p>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <button
              onClick={() => setCheckInType('daily')}
              style={{ padding: '1.5rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem', textAlign: 'left', cursor: 'pointer', backgroundColor: '#FFFFFF', transition: 'all 0.2s' }}
            >
              <div style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#1A1A1A' }}>Daily Check-in</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Quick update: Did you work on your goal today?</div>
            </button>

            <button
              onClick={() => setCheckInType('weekly')}
              style={{ padding: '1.5rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem', textAlign: 'left', cursor: 'pointer', backgroundColor: '#FFFFFF', transition: 'all 0.2s' }}
            >
              <div style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#1A1A1A' }}>Weekly Check-in</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Deep reflection: How did this week go overall?</div>
            </button>
          </div>

          {checkIns.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1A1A1A' }}>Recent Check-ins</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {checkIns.slice(0, 5).map(item => (
                  <div key={item.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#F5F5F5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600', textTransform: 'capitalize', color: '#1A1A1A' }}>{item.type} Check-in</span>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {item.timestamp?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Status: {item.status === 'yes' ? '✅ Did it' : item.status === 'some' ? '😐 Did some' : item.status === 'no' ? '❌ Didn\'t do it' : item.status === 'did' ? '✅ Met commitment' : item.status === 'partial' ? '😐 Partial progress' : item.status === 'didnt' ? '❌ No progress' : '🤔 Rethinking goal'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (checkInType === 'daily') {
    return (
      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setCheckInType(null)}
            style={{ marginBottom: '1rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            ← Back to check-in types
          </button>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1A1A1A' }}>Daily Check-in</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            A quick check-in to track your daily progress with {partner?.name}.
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.75rem', color: '#1A1A1A' }}>
              Did you work on your goal today?
            </label>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {[
                { value: 'yes', label: '✅ Yes', desc: 'Made progress today' },
                { value: 'some', label: '😐 A little', desc: 'Did something, not everything' },
                { value: 'no', label: '❌ No', desc: 'Didn\'t work on it today' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setDailyStatus(option.value)}
                  style={{
                    padding: '1rem',
                    border: dailyStatus === option.value ? '2px solid #1B7A8A' : '2px solid #e5e7eb',
                    backgroundColor: dailyStatus === option.value ? 'rgba(27, 122, 138, 0.1)' : '#FFFFFF',
                    borderRadius: '0.5rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#1A1A1A' }}>{option.label}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {dailyStatus === 'no' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#1A1A1A' }}>
                What got in the way? (Optional)
              </label>
              <textarea
                value={dailyNote}
                onChange={(e) => setDailyNote(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', height: '6rem', fontFamily: 'inherit', fontSize: '1rem' }}
                placeholder="Be honest. Your partner is here to support you, not judge you."
              />
            </div>
          )}

          <button
            onClick={submitDailyCheckIn}
            disabled={!dailyStatus || loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1B7A8A',
              color: '#FFFFFF',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: (!dailyStatus || loading) ? 'not-allowed' : 'pointer',
              opacity: (!dailyStatus || loading) ? 0.5 : 1
            }}
          >
            {loading ? 'Submitting...' : 'Submit Daily Check-in'}
          </button>
        </div>
      </div>
    );
  }

  if (checkInType === 'weekly') {
    return (
      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', padding: '2rem', border: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setCheckInType(null)}
            style={{ marginBottom: '1rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            ← Back to check-in types
          </button>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1A1A1A' }}>Weekly Check-in</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Take time to reflect on your week with {partner?.name}.
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.75rem', color: '#1A1A1A' }}>
              How did this week go with your goal?
            </label>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {[
                { value: 'did', label: '✅ I did it', desc: 'Met my weekly commitment' },
                { value: 'partial', label: '😐 I did some of it', desc: 'Made partial progress' },
                { value: 'didnt', label: '❌ I didn\'t do it', desc: 'Didn\'t make progress' },
                { value: 'rethinking', label: '🤔 I\'m rethinking this goal', desc: 'Need to adjust my approach' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setWeeklyStatus(option.value)}
                  style={{
                    padding: '1rem',
                    border: weeklyStatus === option.value ? '2px solid #1B7A8A' : '2px solid #e5e7eb',
                    backgroundColor: weeklyStatus === option.value ? 'rgba(27, 122, 138, 0.1)' : '#FFFFFF',
                    borderRadius: '0.5rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#1A1A1A' }}>{option.label}</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#1A1A1A' }}>
              What did you learn about yourself this week?
            </label>
            <textarea
              value={weeklyLearning}
              onChange={(e) => setWeeklyLearning(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', height: '6rem', fontFamily: 'inherit', fontSize: '1rem' }}
              placeholder="What insights did you gain?"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#1A1A1A' }}>
              What pattern are you noticing?
            </label>
            <textarea
              value={weeklyPattern}
              onChange={(e) => setWeeklyPattern(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', height: '6rem', fontFamily: 'inherit', fontSize: '1rem' }}
              placeholder="Any recurring themes or obstacles?"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#1A1A1A' }}>
              What needs to change for next week?
            </label>
            <textarea
              value={weeklyChange}
              onChange={(e) => setWeeklyChange(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', height: '6rem', fontFamily: 'inherit', fontSize: '1rem' }}
              placeholder="What will you do differently?"
            />
          </div>

          <button
            onClick={submitWeeklyCheckIn}
            disabled={!weeklyStatus || !weeklyLearning || !weeklyPattern || !weeklyChange || loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1B7A8A',
              color: '#FFFFFF',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: (!weeklyStatus || !weeklyLearning || !weeklyPattern || !weeklyChange || loading) ? 'not-allowed' : 'pointer',
              opacity: (!weeklyStatus || !weeklyLearning || !weeklyPattern || !weeklyChange || loading) ? 0.5 : 1
            }}
          >
            {loading ? 'Submitting...' : 'Submit Weekly Check-in'}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

