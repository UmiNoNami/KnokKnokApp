import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';

import { useAppState } from '../providers/AppProvider';
import { db } from '../firebase/firebaseConfig';

export default function DiscoverScreen() {
  const navigation = useNavigation();
  const { profileDraft } = useAppState();

  const [listings, setListings] = useState([]);
  const [people, setPeople] = useState([]);

  const isAccommodationSeeker = profileDraft?.role === 'seeker';

  useEffect(() => {
    const unsubscribeListings = onSnapshot(
      collection(db, 'listings'),
      (snapshot) => {
        const loadedListings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setListings(loadedListings);
      },
      (error) => {
        console.log('Discover listings error:', error);
      }
    );

    const unsubscribePeople = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const loadedPeople = snapshot.docs
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .filter((user) => user.id !== 'demoUser');

        setPeople(loadedPeople);
      },
      (error) => {
        console.log('Discover users error:', error);
      }
    );

    return () => {
      unsubscribeListings();
      unsubscribePeople();
    };
  }, []);

  const getListingImage = (item) => {
    if (item.houseImages?.[0]) {
      return { uri: item.houseImages[0] };
    }

    if (item.listingImage) {
      return { uri: item.listingImage };
    }

    return require('../../assets/rooms/room1.jpg');
  };

  const getPersonImage = (person) => {
    if (person.profilePhoto) {
      return { uri: person.profilePhoto };
    }

    if (person.avatar) {
      return { uri: person.avatar };
    }

    if (person.image?.uri) {
      return { uri: person.image.uri };
    }

    return require('../../assets/rooms/room1.jpg');
  };

  const data = isAccommodationSeeker ? listings : people;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.interestedContainer}>
        <View style={styles.interestedHeader}>
          <Text style={styles.interestedTitle}>
            {isAccommodationSeeker ? 'Discover' : 'Interested'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {isAccommodationSeeker && (
          <Pressable
            style={styles.searchHousingButton}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={styles.searchHousingText}>
              🏠 Search housing by location
            </Text>
          </Pressable>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.peopleGrid}
        >
          {data.map((item) => {
            const isListingCard = isAccommodationSeeker;

            return (
              <Pressable
                key={item.id}
                style={styles.personCard}
                onPress={() =>
                  navigation.navigate('ListingDetails', {
                    item,
                  })
                }
              >
                <Image
                  source={
                    isListingCard
                      ? getListingImage(item)
                      : getPersonImage(item)
                  }
                  style={styles.personImage}
                />

                <View style={styles.personOverlay}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.personName} numberOfLines={1}>
                      {isListingCard
                        ? item.title || 'Listing'
                        : item.name || item.title || 'Profile'}
                    </Text>

                    <Text style={styles.personInfo} numberOfLines={1}>
                      {isListingCard
                        ? `${item.area || 'Area'} · €${item.price || '-'}/week`
                        : `${item.age || ''}${item.age ? ', ' : ''}${
                            item.occupation || item.location || 'Profile'
                          }`}
                    </Text>

                    {isListingCard && (
                      <Text style={styles.hostName} numberOfLines={1}>
                        Hosted by {item.hostName || 'Host'}
                      </Text>
                    )}
                  </View>

                  <Text style={styles.sendIcon}>⌁</Text>
                </View>
              </Pressable>
            );
          })}

          {data.length === 0 && (
            <Text style={styles.emptyText}>
              {isAccommodationSeeker
                ? 'No listings found yet.'
                : 'No interested people yet.'}
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F1',
  },

  interestedContainer: {
    flex: 1,
    backgroundColor: '#F4F4F1',
    paddingHorizontal: 8,
    paddingTop: 18,
  },

  interestedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 28,
  },

  interestedTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#050505',
  },

  peopleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 120,
  },

  personCard: {
    width: '48%',
    height: 206,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    marginBottom: 12,
  },

  personImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  personOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.62)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  personInfo: {
    fontSize: 13,
    color: '#222',
    marginTop: 2,
  },

  hostName: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },

  sendIcon: {
    fontSize: 28,
    color: '#222',
    marginLeft: 6,
  },

  searchHousingButton: {
    backgroundColor: '#F4C21A',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
  },

  searchHousingText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#050505',
  },

  emptyText: {
    width: '100%',
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
    fontSize: 16,
  },
});