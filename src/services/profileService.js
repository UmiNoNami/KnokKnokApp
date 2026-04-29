import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const PROFILE_ID = 'demoUserProfile';

export async function saveProfileToFirebase(profileData) {
  await setDoc(
    doc(db, 'profiles', PROFILE_ID),
    {
      ...profileData,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function getProfileFromFirebase() {
  const profileRef = doc(db, 'profiles', PROFILE_ID);
  const snapshot = await getDoc(profileRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  return null;
}