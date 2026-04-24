import React, { useMemo, useState, useEffect } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../providers/AppProvider';
import { houseProfiles, peopleProfiles } from '../data/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 30;

export default function HomeScreen() {
  const { profileDraft } = useAppState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const isAccommodationSeeker = profileDraft.role === 'accommodation';

  const feedData = useMemo(() => {
    return isAccommodationSeeker ? houseProfiles : peopleProfiles;
  }, [isAccommodationSeeker]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [isAccommodationSeeker]);

  const currentItem = feedData[currentIndex];

  if (!currentItem) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No more cards, you have reached the end of the current feed.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const goNextCard = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const headerIcon = isAccommodationSeeker
    ? require('../../assets/icons/house.png')
    : require('../../assets/icons/profile.png');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.smallIconButton}>
            <Image source={headerIcon} style={styles.smallIcon} />
          </Pressable>

          <Text style={styles.headerTitle}>For you</Text>

          <Pressable style={styles.refreshButton} onPress={() => setCurrentIndex(0)}>
            <Image
              source={require('../../assets/icons/refresh.png')}
              style={styles.refreshIcon}
            />
          </Pressable>
        </View>

        <View style={styles.outerCard}>
          <View style={styles.card}>
            <Image source={currentItem.image} style={styles.roomImage} />

            <View style={styles.imageTextOverlay}>
              <Text style={styles.cardTitle}>{currentItem.title}</Text>
              <Text style={styles.cardLocation}>{currentItem.location}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.actionButton} onPress={goNextCard}>
              <Image
                source={require('../../assets/icons/close.png')}
                style={styles.actionIcon}
              />
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.likeButton]}
              onPress={goNextCard}
            >
              <Image
                source={require('../../assets/icons/like.png')}
                style={styles.actionIcon}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F1',
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 6,
    backgroundColor: '#F4F4F1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  smallIconButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  refreshButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F8F8F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  refreshIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  outerCard: {
    backgroundColor: '#F4F4F1',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#DDD8D1',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  roomImage: {
    width: CARD_WIDTH - 20,
    height: 410,
    resizeMode: 'cover',
  },
  imageTextOverlay: {
    position: 'absolute',
    left: 18,
    bottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#fff',
    marginBottom: 6,
  },
  cardLocation: {
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
  },
  actionRow: {
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#F8F8F6',
    borderWidth: 1.5,
    borderColor: '#DDD8D1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  likeButton: {},
  actionIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F4F4F1',
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
  },
});