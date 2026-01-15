import { act } from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: (_auth, callback) => {
    callback(null);
    return () => {};
  },
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  serverTimestamp: jest.fn()
}));

import App from './App';

test('renders the app title', async () => {
  await act(async () => {
    render(<App />);
  });
  // App shows "Veyl" both in the initial loading screen and auth screen.
  expect(screen.getAllByText(/veyl/i).length).toBeGreaterThan(0);
});
