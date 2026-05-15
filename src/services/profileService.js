import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { Platform } from 'react-native';

const getUserId = () => {
  return auth.currentUser?.uid || `demoUser_${Platform.OS}`;
};


export async function saveProfileToFirebase(profileData) {
  const USER_ID = getUserId();

  await setDoc(
    doc(db, 'users', USER_ID),
    {
      ...profileData,
      id: USER_ID,
      ownerId: USER_ID,
      isActive: true,
      occupation: profileData.job || profileData.occupation || '',
      profilePhoto: profileData.photos?.[0] || '',
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
export async function getProfileFromFirebase() {
  const USER_ID = getUserId();

  const profileRef = doc(db, 'users', USER_ID);
  const snapshot = await getDoc(profileRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  return null;
}

export async function pauseProfileInFirebase() {
  const USER_ID = getUserId();

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
  const USER_ID = getUserId();

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
  const USER_ID = getUserId();

  await deleteDoc(doc(db, 'users', USER_ID));
}