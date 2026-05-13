import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const USER_ID = 'demoUser';

export async function saveProfileToFirebase(profileData) {
  await setDoc(
    doc(db, 'users', USER_ID),
    {
      ...profileData,
      id: USER_ID,
      occupation: profileData.job || profileData.occupation || '',
      profilePhoto: profileData.photos?.[0] || '',
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function getProfileFromFirebase() {
  const profileRef = doc(db, 'users', USER_ID);
  const snapshot = await getDoc(profileRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  return null;
}

export async function pauseProfileInFirebase() {
  await setDoc(
    doc(db, 'users', USER_ID),
    {
      isActive: false,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function activateProfileInFirebase() {
  await setDoc(
    doc(db, 'users', USER_ID),
    {
      isActive: true,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function deleteProfileFromFirebase() {
  await deleteDoc(doc(db, 'users', USER_ID));
}