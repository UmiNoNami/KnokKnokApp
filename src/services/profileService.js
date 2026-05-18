import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const getUserId = () => {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error('No logged-in user found');
  }

  return userId;
};


export async function saveProfileToFirebase(profileData) {
  const USER_ID = getUserId();

  const cleanData = Object.fromEntries(
    Object.entries(profileData).filter(([_, value]) => value !== undefined)
  );

  await setDoc(
    doc(db, 'users', USER_ID),
    {
      ...cleanData,
      id: USER_ID,
      ownerId: USER_ID,
      isActive: true,
      occupation: cleanData.job || cleanData.occupation || '',
      profilePhoto:
  Array.isArray(cleanData.photos) && cleanData.photos.length > 0
    ? cleanData.photos[0]
    : '',
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

  console.log('PROFILE DATA SAVING:', cleanData);

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