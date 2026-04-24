import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppScreen from '../components/AppScreen';
import { useAppState } from '../providers/AppProvider';

export default function ProfileScreen() {
  const { profileDraft } = useAppState();

  const firstPhoto = profileDraft.photos?.[0];
  const isAccommodationSeeker = profileDraft.role === 'accommodation';

  const accommodationText = profileDraft.accommodationType?.length
    ? profileDraft.accommodationType.join(', ')
    : 'Accommodation not selected';

  const roomText = profileDraft.roomType?.length
    ? profileDraft.roomType.join(', ')
    : 'Room type not selected';

  return (
    <AppScreen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {isAccommodationSeeker ? 'My profile' : 'House profile'}
        </Text>

        {firstPhoto ? (
          <Image source={{ uri: firstPhoto }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No photo yet</Text>
          </View>
        )}

        {isAccommodationSeeker ? (
          <>
            <Text style={styles.name}>
              {profileDraft.name || 'No name added'}
            </Text>

            <Text style={styles.location}>
              {profileDraft.location || 'Preferred location not added'}
            </Text>

            <Text style={styles.info}>
              Looking for: {accommodationText}
            </Text>

            <Text style={styles.info}>
              Preferred room: {roomText}
            </Text>

            <Text style={styles.info}>
              Budget: {profileDraft.price ? `€${profileDraft.price}` : 'Not added'}
            </Text>

            <Text style={styles.sectionTitle}>About me</Text>
            <View style={styles.box}>
              <Text style={styles.body}>
                {profileDraft.bio || 'No bio added yet.'}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.name}>{accommodationText}</Text>

            <Text style={styles.location}>
              {profileDraft.location || 'Location not added'}
            </Text>

            <Text style={styles.info}>{roomText}</Text>

            <Text style={styles.info}>
              {profileDraft.price ? `€${profileDraft.price}` : 'Price not added'}
            </Text>

            <Text style={styles.sectionTitle}>Property description</Text>
            <View style={styles.box}>
              <Text style={styles.body}>
                {profileDraft.bio || 'No property description added yet.'}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Posted by</Text>
            <View style={styles.box}>
              <Text style={styles.body}>
                {profileDraft.name || 'No name added'}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 320,
    borderRadius: 24,
    marginBottom: 20,
  },
  placeholder: {
    width: '100%',
    height: 320,
    borderRadius: 24,
    backgroundColor: '#E8E4DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  name: {
    fontSize: 30,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  location: {
    fontSize: 18,
    color: '#444',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginTop: 22,
    marginBottom: 10,
  },
  box: {
    backgroundColor: '#F7F5F1',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8D3CB',
  },
  body: {
    fontSize: 16,
    color: '#222',
    lineHeight: 24,
  },
});