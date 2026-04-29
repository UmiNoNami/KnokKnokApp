import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useAppState } from '../providers/AppProvider';
import { mapListings, peopleProfiles } from '../data/mockData';

export default function DiscoverScreen() {
  const navigation = useNavigation();
  const { profileDraft } = useAppState();

  const [searchText, setSearchText] = useState('');
  const [selectedArea, setSelectedArea] = useState('Smithfield');
  const [maxBudget, setMaxBudget] = useState(300);

  const isAccommodationSeeker = profileDraft.role === 'seeker';

  const filteredListings = useMemo(() => {
    return mapListings.filter((listing) => {
      const areaMatches =
        !selectedArea ||
        listing.area.toLowerCase() === selectedArea.toLowerCase();

      const budgetMatches = listing.price <= maxBudget;

      return areaMatches && budgetMatches;
    });
  }, [selectedArea, maxBudget]);

  const handleSearch = () => {
    const query = searchText.trim();
    if (!query) return;
    setSelectedArea(query);
  };

  if (!isAccommodationSeeker) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.interestedContainer}>
          <View style={styles.interestedHeader}>
          
            <Text style={styles.interestedTitle}>Interested</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.peopleGrid}
          >
            {peopleProfiles.map((person) => (
              <Pressable
                key={person.id}
                style={styles.personCard}
                onPress={() =>
                  navigation.navigate('ListingDetails', {
                    item: person,
                  })
                }
              >
                <Image source={person.image} style={styles.personImage} />

                <View style={styles.personOverlay}>
                  <View>
                    <Text style={styles.personName}>{person.title}</Text>
                    <Text style={styles.personInfo}>{person.location}</Text>
                  </View>

                  <Text style={styles.sendIcon}>⌁</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fakeMap}>
          <View style={styles.roadOne} />
          <View style={styles.roadTwo} />
          <View style={styles.roadThree} />

          {filteredListings.map((listing, index) => (
            <View
              key={listing.id}
              style={[
                styles.priceMarker,
                markerPositions[index % markerPositions.length],
              ]}
            >
              <Text style={styles.priceText}>€{listing.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Search area"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />

          <Pressable style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </Pressable>
        </View>

        <View style={styles.bottomCard}>
          <Text style={styles.title}>
            Available in {selectedArea || 'all areas'}
          </Text>

          <Text style={styles.subtitle}>Under €{maxBudget}</Text>

          <View style={styles.budgetRow}>
            {[250, 300, 400].map((b) => (
              <Pressable
                key={b}
                style={[
                  styles.budgetBtn,
                  maxBudget === b && styles.activeBudget,
                ]}
                onPress={() => setMaxBudget(b)}
              >
                <Text style={styles.budgetText}>€{b}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.result}>{filteredListings.length} results</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const markerPositions = [
  { top: '30%', left: '20%' },
  { top: '45%', left: '60%' },
  { top: '60%', left: '35%' },
  { top: '50%', left: '75%' },
];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F1',
  },

  container: {
    flex: 1,
  },

  fakeMap: {
    flex: 1,
    backgroundColor: '#D8D5CC',
  },

  roadOne: {
    position: 'absolute',
    width: '150%',
    height: 50,
    backgroundColor: '#EEECE5',
    top: '30%',
    left: '-20%',
    transform: [{ rotate: '-20deg' }],
  },

  roadTwo: {
    position: 'absolute',
    width: '120%',
    height: 40,
    backgroundColor: '#F2F0EA',
    top: '60%',
    left: '-10%',
    transform: [{ rotate: '20deg' }],
  },

  roadThree: {
    position: 'absolute',
    width: 40,
    height: '120%',
    backgroundColor: '#EAE7DF',
    left: '50%',
  },

  priceMarker: {
    position: 'absolute',
    backgroundColor: '#F4C21A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  priceText: {
    fontWeight: '700',
  },

  searchBox: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 16,
  },

  input: {
    flex: 1,
  },

  button: {
    backgroundColor: '#F4C21A',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 10,
  },

  buttonText: {
    fontWeight: '700',
  },

  bottomCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  subtitle: {
    marginBottom: 10,
  },

  budgetRow: {
    flexDirection: 'row',
    gap: 10,
  },

  budgetBtn: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
  },

  activeBudget: {
    backgroundColor: '#F4C21A',
  },

  budgetText: {
    fontWeight: '600',
  },

  result: {
    marginTop: 10,
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

  homeIcon: {
    fontSize: 24,
    color: '#222',
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
    height: 66,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.55)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  personName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },

  personInfo: {
    fontSize: 14,
    color: '#222',
    marginTop: 2,
  },

  sendIcon: {
    fontSize: 28,
    color: '#222',
  },
});