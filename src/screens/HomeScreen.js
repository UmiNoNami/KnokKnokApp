import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { seedDatabase } from '../services/dataService';

import { useAppState } from '../providers/AppProvider';
import {
  getPeopleFromFirebase,
  getHousesFromFirebase,
  seedPeopleToFirebase,
  seedHousesToFirebase,
  saveSwipeToFirebase,
} from '../services/dataService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 30;
const SWIPE_LIMIT = width * 0.28;

const fallbackPeople = [
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
];

const fallbackHouses = [
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
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { profileDraft } = useAppState();

  const [firebasePeople, setFirebasePeople] = useState(fallbackPeople);
  const [firebaseHouses, setFirebaseHouses] = useState(fallbackHouses);
  const [currentIndex, setCurrentIndex] = useState(0);

  const position = useRef(new Animated.ValueXY()).current;

  const role = profileDraft?.role || 'seeker';
  const isAccommodationSeeker = role === 'seeker';

  useEffect(() => {
    const loadData = async () => {
      try {
        await seedPeopleToFirebase();
        await seedHousesToFirebase();
        await seedIncomingLikes();

        const people = await getPeopleFromFirebase();
        const houses = await getHousesFromFirebase();

        if (people.length > 0) setFirebasePeople(people);
        if (houses.length > 0) setFirebaseHouses(houses);
      } catch (error) {
        console.log('Firebase load error:', error);
      }
    };

    loadData();
  }, []);

  const feedData = useMemo(() => {
    return isAccommodationSeeker ? firebaseHouses : firebasePeople;
  }, [isAccommodationSeeker, firebaseHouses, firebasePeople]);

  const currentItem = feedData[currentIndex];
  const nextItem = feedData[currentIndex + 1];

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_LIMIT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_LIMIT, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const goNextCard = () => {
    setCurrentIndex((prev) => {
      if (prev + 1 >= feedData.length) return 0;
      return prev + 1;
    });

    position.setValue({ x: 0, y: 0 });
  };

  const swipeCard = async (direction) => {
    if (!currentItem) return;

    try {
      await saveSwipeToFirebase({
        targetId: currentItem.id,
        targetType: isAccommodationSeeker ? 'house' : 'person',
        direction: direction === 1 ? 'like' : 'dislike',
      });
    } catch (error) {
      console.log('Swipe save error:', error);
    }

    Animated.timing(position, {
      toValue: { x: direction * width, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(goNextCard);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_LIMIT) {
          swipeCard(1);
        } else if (gesture.dx < -SWIPE_LIMIT) {
          swipeCard(-1);
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const cardAnimatedStyle = {
    transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
  };

  const nextCardScale = position.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [1, 0.95, 1],
    extrapolate: 'clamp',
  });

  const headerIcon = isAccommodationSeeker
    ? require('../../assets/icons/house.png')
    : require('../../assets/icons/house.png');

  const renderCard = (item) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('ListingDetails', { item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.roomImage} />

      <Animated.View style={[styles.swipeOverlay, styles.likeOverlay, { opacity: likeOpacity }]} />
      <Animated.View style={[styles.swipeOverlay, styles.dislikeOverlay, { opacity: dislikeOpacity }]} />

      <View style={styles.imageTextOverlay}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardLocation}>{item.location}</Text>
      </View>
    </Pressable>
  );

  if (!currentItem) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading cards...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
        
          <Pressable style={styles.smallIconButton}>
            <Image source={headerIcon} style={styles.smallIcon} />
          </Pressable>

          <Text style={styles.headerTitle}>For you</Text>

          <Pressable
            style={styles.refreshButton}
            onPress={() => {
              setCurrentIndex(0);
              position.setValue({ x: 0, y: 0 });
            }}
          >
            <Image
              source={require('../../assets/icons/refresh.png')}
              style={styles.refreshIcon}
            />
          </Pressable>
        </View>

        <View style={styles.outerCard}>
          <View style={styles.cardStack}>
            {nextItem && (
              <Animated.View style={[styles.cardPosition, { transform: [{ scale: nextCardScale }] }]}>
                {renderCard(nextItem)}
              </Animated.View>
            )}

            <Animated.View
              style={[styles.cardPosition, cardAnimatedStyle]}
              {...panResponder.panHandlers}
            >
              {renderCard(currentItem)}
            </Animated.View>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.actionButton} onPress={() => swipeCard(-1)}>
              <Image source={require('../../assets/icons/close.png')} style={styles.actionIcon} />
            </Pressable>

            <Pressable style={styles.actionButton} onPress={() => swipeCard(1)}>
              <Image source={require('../../assets/icons/like.png')} style={styles.actionIcon} />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F1' },
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
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#111' },
  smallIconButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallIcon: { width: 20, height: 20, resizeMode: 'contain' },
  refreshButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F8F8F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: { width: 24, height: 24, resizeMode: 'contain' },
  outerCard: {
    backgroundColor: '#F4F4F1',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#DDD8D1',
    padding: 10,
  },
  cardStack: { height: 410 },
  cardPosition: { position: 'absolute', width: '100%' },
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
  },
  actionIcon: { width: 28, height: 28, resizeMode: 'contain' },
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
    marginBottom: 20,
  },
  swipeOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
  },
  likeOverlay: {
    backgroundColor: 'rgba(242, 183, 5, 0.25)',
  },
  dislikeOverlay: {
    backgroundColor: 'rgba(220, 40, 40, 0.25)',
  },
});