import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase';

export async function findMatch(userId, userData) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('status', '==', 'seeking_partner'),
      where('goalCategory', '==', userData.goalCategory)
    );

    const querySnapshot = await getDocs(q);
    let bestMatch = null;

    querySnapshot.forEach((snapshotDoc) => {
      if (snapshotDoc.id !== userId) {
        const potentialPartner = snapshotDoc.data();
        const userTz = parseInt(userData.timezone.replace('GMT', ''));
        const partnerTz = parseInt(potentialPartner.timezone.replace('GMT', ''));
        const tzDiff = Math.abs(userTz - partnerTz);

        if (tzDiff <= 4) {
          bestMatch = { id: snapshotDoc.id, ...potentialPartner };
        }
      }
    });

    if (bestMatch) {
      await updateDoc(doc(db, 'users', userId), {
        partnerId: bestMatch.id,
        status: 'matched',
        matchedAt: serverTimestamp(),
        isPremium: false,
        messagesUsedToday: 0,
        lastMessageReset: serverTimestamp()
      });

      await updateDoc(doc(db, 'users', bestMatch.id), {
        partnerId: userId,
        status: 'matched',
        matchedAt: serverTimestamp(),
        isPremium: false,
        messagesUsedToday: 0,
        lastMessageReset: serverTimestamp()
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error finding match:', error);
    return false;
  }
}

