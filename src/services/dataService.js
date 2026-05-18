import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../firebase/firebaseConfig';

// ---------- SEED ALL DEMO DATA ----------

export async function seedDatabase() {
  await seedPeopleToFirebase();
  await seedHousesToFirebase();

  console.log('Database seeded successfully');
}

// ---------- PEOPLE ----------

export async function getPeopleFromFirebase() {
  const snapshot = await getDocs(collection(db, 'peopleProfiles'));

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function seedPeopleToFirebase() {
  const people = [
    {
      id: 'p1',
      title: 'Jenny Martínez',
      location: '27, Waitress',
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 'p2',
      title: 'Edoardo Marino',
      location: '33, Chef',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 'p3',
      title: 'Sophie Laurent',
      location: '25, Designer',
      imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      id: 'p4',
      title: 'Liam O’Connor',
      location: '29, Engineer',
      imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    {
      id: 'p5',
      title: 'Maya Chen',
      location: '26, Student',
      imageUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
    {
      id: 'p6',
      title: 'Noah Schmidt',
      location: '31, Developer',
      imageUrl: 'https://randomuser.me/api/portraits/men/76.jpg',
    },
  ];

  for (const person of people) {
    await setDoc(doc(db, 'peopleProfiles', person.id), person, {
      merge: true,
    });
  }
}

// ---------- HOUSES ----------

export async function getHousesFromFirebase() {
  const snapshot = await getDocs(collection(db, 'houseProfiles'));

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function seedHousesToFirebase() {
  const houses = [
    {
      id: 'h1',
      title: 'Bright Double Room',
      location: 'Smithfield, Dublin',
      price: 280,
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    },
    {
      id: 'h2',
      title: 'Cosy Room Near City Centre',
      location: 'Dublin 7',
      price: 250,
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    },
    {
      id: 'h3',
      title: 'Modern Apartment Share',
      location: 'Rathmines, Dublin',
      price: 320,
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    },
    {
      id: 'h4',
      title: 'Studio Style Room',
      location: 'Dublin 8',
      price: 350,
      imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858',
    },
    {
      id: 'h5',
      title: 'Quiet House Share',
      location: 'Drumcondra, Dublin',
      price: 240,
      imageUrl: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0',
    },
  ];

  for (const house of houses) {
    await setDoc(doc(db, 'houseProfiles', house.id), house, {
      merge: true,
    });
  }
}

// ---------- SWIPES + MATCHES ----------

import { auth } from '../firebase/firebaseConfig';

const getCurrentUserId = () => {
  const userId = auth.currentUser?.uid;

  if (!userId) {
    throw new Error('No logged-in user');
  }

  return userId;
};

export async function saveSwipeToFirebase({
  targetId,
  targetType,
  direction,
}) {
  const currentUserId = getCurrentUserId();

const swipeId = `${currentUserId}_${targetId}`;

  await setDoc(doc(db, 'swipes', swipeId), {
    fromUserId: currentUserId,
    targetId,
    targetType,
    direction,
    createdAt: serverTimestamp(),
  });

  if (direction === 'like') {
    await checkForMatch(targetId, targetType);
  }
}

async function checkForMatch(targetId, targetType) {
  const reverseSwipeQuery = query(
    collection(db, 'swipes'),
    where('fromUserId', '==', targetId),
    where('targetId', '==', DEMO_USER_ID),
    where('direction', '==', 'like')
  );

  const reverseSwipeSnapshot = await getDocs(reverseSwipeQuery);

  if (!reverseSwipeSnapshot.empty) {
    const matchId = [DEMO_USER_ID, targetId].sort().join('_');

    await setDoc(doc(db, 'matches', matchId), {
      users: [DEMO_USER_ID, targetId],
      targetType,
      createdAt: serverTimestamp(),
    });
  }
}

export async function getLikesForDemoUser() {
  const snapshot = await getDocs(collection(db, 'swipes'));

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }))
    .filter((swipe) => swipe.direction === 'like');
}

export async function getMatchesFromFirebase() {
  const snapshot = await getDocs(collection(db, 'matches'));

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}






export async function seedIncomingLikes() {
  const demoUser = 'demoUser';

  const fakeLikes = [
    { fromUserId: 'p1', targetId: demoUser },
    { fromUserId: 'p2', targetId: demoUser },
  ];

  for (const like of fakeLikes) {
    const id = `${like.fromUserId}_${demoUser}`;

    await setDoc(doc(db, 'swipes', id), {
      fromUserId: like.fromUserId,
      targetId: demoUser,
      targetType: 'person',
      direction: 'like',
      createdAt: serverTimestamp(),
    });
  }
}