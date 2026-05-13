import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCf2CdqREQGnz-SoU5aBW9pivoYY6jCxns",
  authDomain: "knokknok-ea86d.firebaseapp.com",
  projectId: "knokknok-ea86d",
  storageBucket: "knokknok-ea86d.firebasestorage.app",
  messagingSenderId: "705944821945",
  appId: "1:705944821945:web:72e01f1b5cb60975e87b68",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);