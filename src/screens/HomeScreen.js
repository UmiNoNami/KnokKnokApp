import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db, auth } from '../firebase/firebaseConfig';
import { useAppState } from '../providers/AppProvider';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 30;
const SWIPE_LIMIT = width * 0.28;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { profileDraft } = useAppState();

  const role = profileDraft?.role || 'seeker';
  const isAccommodationSeeker = role === 'seeker';
  const currentUserId = auth.currentUser?.uid || 'demoUser';

  const [firebaseListings, setFirebaseListings] = useState([]);
  const [firebaseUsers, setFirebaseUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    const unsubscribeListings = onSnapshot(
      collection(db, 'listings'),
      async (snapshot) => {
        const loadedListings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        await Promise.all(
          loadedListings.map((item) => {
            const imageUrl = item.houseImages?.[0] || item.imageUrl;

            if (imageUrl) {
              return Image.prefetch(imageUrl);
            }

            return Promise.resolve();
          })
        );

        setFirebaseListings(loadedListings);
      },
      (error) => {
        console.log('Listings load error:', error);
      }
    );

    const unsubscribeUsers = onSnapshot(
      collection(db, 'users'),
      async (snapshot) => {
        const loadedUsers = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.role === 'seeker' && user.id !== currentUserId);

        await Promise.all(
          loadedUsers.map((user) => {
            const imageUrl = user.profilePhoto || user.avatar;

            if (imageUrl) {
              return Image.prefetch(imageUrl);
            }

            return Promise.resolve();
          })
        );

        setFirebaseUsers(loadedUsers);
      },
      (error) => {
        console.log('Users load error:', error);
      }
    );

    return () => {
      unsubscribeListings();
      unsubscribeUsers();
    };
  }, []);

  const feedData = useMemo(() => {
    return isAccommodationSeeker ? firebaseListings : firebaseUsers;
  }, [isAccommodationSeeker, firebaseListings, firebaseUsers]);

  useEffect(() => {
    setCurrentIndex(0);
    position.setValue({ x: 0, y: 0 });
  }, [isAccommodationSeeker, position]);

  const currentItem = feedData[currentIndex];
  const nextItem =
    feedData.length > 1
      ? feedData[(currentIndex + 1) % feedData.length]
      : null;

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

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  const cardAnimatedStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  const getCardImage = (item) => {
    if (isAccommodationSeeker) {
      if (item?.houseImages?.[0]) return { uri: item.houseImages[0] };
      if (item?.imageUrl) return { uri: item.imageUrl };
    } else {
      if (item?.profilePhoto) return { uri: item.profilePhoto };
      if (item?.avatar) return { uri: item.avatar };
    }

    return require('../../assets/rooms/room1.jpg');
  };

  const saveSwipeToFirebase = async (direction) => {
    if (!currentItem) return;

    try {
      await addDoc(collection(db, 'swipes'), {
        userId: currentUserId,
        targetId: currentItem.id,
        targetType: isAccommodationSeeker ? 'listing' : 'user',
        direction: direction === 1 ? 'like' : 'dislike',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.log('Swipe save error:', error);
    }
  };

  const goNextCard = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      return nextIndex >= feedData.length ? 0 : nextIndex;
    });

    requestAnimationFrame(() => {
      position.setValue({ x: 0, y: 0 });
    });
  }, [feedData.length, position]);

  const swipeCard = useCallback(
    async (direction) => {
      if (!currentItem) return;

      await saveSwipeToFirebase(direction);

      Animated.timing(position, {
        toValue: { x: direction * width, y: 0 },
        duration: 320,
        useNativeDriver: true,
      }).start(() => {
        goNextCard();
      });
    },
    [currentItem, position, goNextCard]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 10,

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
      }),
    [position, swipeCard]
  );

  const renderCard = (item) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('ListingDetails', { item })}
    >
      <Image source={getCardImage(item)} style={styles.roomImage} />

      <Animated.View
        style={[
          styles.swipeOverlay,
          styles.likeOverlay,
          { opacity: likeOpacity },
        ]}
      />

      <Animated.View
        style={[
          styles.swipeOverlay,
          styles.dislikeOverlay,
          { opacity: dislikeOpacity },
        ]}
      />

      <View style={styles.imageTextOverlay}>
        <Text style={styles.cardTitle}>
          {isAccommodationSeeker
            ? item.title || 'Listing'
            : item.name || 'Profile'}
        </Text>

        <Text style={styles.cardLocation}>
          {isAccommodationSeeker
            ? item.area || item.location || 'Location not added'
            : `${item.age || ''}${item.age ? ', ' : ''}${
                item.occupation || 'Seeker'
              }`}
        </Text>

        {isAccommodationSeeker && item.price && (
          <Text style={styles.cardPrice}>€{item.price}/week</Text>
        )}

        {!isAccommodationSeeker && item.bio && (
          <Text style={styles.cardPrice} numberOfLines={1}>
            {item.bio}
          </Text>
        )}
      </View>
    </Pressable>
  );

  if (!currentItem) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {isAccommodationSeeker
              ? 'Loading listings...'
              : 'Loading people...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerSpace} />

          <Text style={styles.headerTitle}>
            {isAccommodationSeeker ? 'For you' : 'For you'}
          </Text>

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
              <View style={[styles.cardPosition, styles.nextCard]}>
                {renderCard(nextItem)}
              </View>
            )}

            <Animated.View
              style={[
                styles.cardPosition,
                styles.currentCard,
                cardAnimatedStyle,
              ]}
              {...panResponder.panHandlers}
            >
              {renderCard(currentItem)}
            </Animated.View>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={styles.actionButton}
              onPress={() => swipeCard(-1)}
            >
              <Image
                source={require('../../assets/icons/close.png')}
                style={styles.actionIcon}
              />
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={() => swipeCard(1)}
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
    backgroundColor: '#fdfdfdf9',
  },

  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 6,
    backgroundColor: '#Ffff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    position: 'absolute',
    right: 0,
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
    borderColor: 'rgba(43,43,43,0.12)',
    padding: 10,
  },

  cardStack: {
    height: 480,
  },

  cardPosition: {
    position: 'absolute',
    width: '100%',
  },

  currentCard: {
    zIndex: 2,
    elevation: 2,
  },

  nextCard: {
    zIndex: 1,
    elevation: 1,
    transform: [{ scale: 0.96 }],
    opacity: 1,
  },

 card: {
  borderRadius: 22,
  overflow: 'hidden',
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.75)',
},

  roomImage: {
    width: CARD_WIDTH - 20,
    height: 480,
    resizeMode: 'cover',
  },

  imageTextOverlay: {
    position: 'absolute',
    left: 18,
    bottom: 20,
    right: 18,
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

  cardPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginTop: 6,
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