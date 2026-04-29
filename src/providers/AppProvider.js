import { createContext, useContext, useMemo, useState } from 'react';



const AppContext = createContext(null);

export default function AppProvider({ children }) {
  const [selectedMode, setSelectedMode] = useState('roommate');
  const [isSignedIn, setIsSignedIn] = useState(false);
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

  const value = useMemo(
    () => ({
      isSignedIn,
      selectedMode,
      profileDraft,
      signIn: () => setIsSignedIn(true),
      signOut: () => setIsSignedIn(false),
      setSelectedMode,
      updateProfile: (updates) => {
        setProfileDraft((current) => ({ ...current, ...updates }));
      },
    }),
    [isSignedIn, profileDraft, selectedMode]
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
