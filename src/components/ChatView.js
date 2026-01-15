import React, { useEffect, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export default function ChatView({ user, userData, partner, setUserData }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const chatId = [user.uid, userData?.partnerId].sort().join('_');
  const dailyLimit = 10;
  const messagesLeft = userData?.isPremium ? 999 : (dailyLimit - (userData?.messagesUsedToday || 0));

  useEffect(() => {
    if (!userData?.partnerId) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach(docSnapshot => msgs.push({ id: docSnapshot.id, ...docSnapshot.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId, userData?.partnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    if (messagesLeft <= 0) {
      alert('You have reached your daily message limit (10/day). Upgrade to Premium for unlimited messaging!');
      return;
    }

    setLoading(true);
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: user.uid,
        senderName: userData.name,
        timestamp: serverTimestamp()
      });

      if (!userData.isPremium) {
        await updateDoc(doc(db, 'users', user.uid), {
          messagesUsedToday: (userData.messagesUsedToday || 0) + 1
        });
        setUserData({ ...userData, messagesUsedToday: (userData.messagesUsedToday || 0) + 1 });
      }

      setNewMessage('');
    } catch (err) {
      alert('Error sending message: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', height: '600px' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: '600', color: '#1A1A1A' }}>{partner?.name || 'Your Partner'}</div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {userData?.isPremium ? (
            <span style={{ color: '#4A1D5E', fontWeight: '500' }}>✨ Premium - Unlimited messages</span>
          ) : (
            `${messagesLeft} messages left today`
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', paddingTop: '3rem' }}>
            No messages yet. Say hello to your partner!
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.senderId === user.uid ? 'flex-end' : 'flex-start',
                marginBottom: '1rem'
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: msg.senderId === user.uid ? '#1B7A8A' : '#F5F5F5',
                  color: msg.senderId === user.uid ? '#FFFFFF' : '#1A1A1A'
                }}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={messagesLeft <= 0 ? "Daily limit reached - Upgrade to Premium" : "Type your message..."}
            disabled={messagesLeft <= 0}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              opacity: messagesLeft <= 0 ? 0.5 : 1,
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim() || messagesLeft <= 0}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#1B7A8A',
              color: '#FFFFFF',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: (loading || !newMessage.trim() || messagesLeft <= 0) ? 'not-allowed' : 'pointer',
              opacity: (loading || !newMessage.trim() || messagesLeft <= 0) ? 0.5 : 1
            }}
          >
            Send
          </button>
        </div>
        {messagesLeft <= 3 && messagesLeft > 0 && !userData?.isPremium && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#4A1D5E', textAlign: 'center' }}>
            {messagesLeft} messages left today. <span style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}>Upgrade to Premium</span> for unlimited messaging.
          </div>
        )}
      </form>
    </div>
  );
}

