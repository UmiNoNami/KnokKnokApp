import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const AppContext = createContext(null);

export default function AppProvider({ children }) {
  const [selectedMode, setSelectedMode] = useState('roommate');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [profileDraft, setProfileDraft] = useState({
    name: '',
    job: '',
    gender: '',
    dateOfBirth: '',
    role: '',
    accommodationType: [],
    roomType: [],
    location: '',
    price: '',
    billsIncluded: true,
    tenants: '',
    lifestyleTags: [],
    bio: '',
    photos: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(Boolean(user));
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      isSignedIn,
      authLoading,
      selectedMode,
      profileDraft,
      signIn: () => setIsSignedIn(true),
      signOut: async () => {
        await firebaseSignOut(auth);
        setIsSignedIn(false);
      },
      setSelectedMode,
      updateProfile: (updates) => {
        setProfileDraft((current) => ({ ...current, ...updates }));
      },
    }),
    [isSignedIn, authLoading, profileDraft, selectedMode]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppState must be used inside AppProvider');
  }

  return context;
}