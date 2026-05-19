import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';

import { useAppState } from '../providers/AppProvider';
import CustomButton from '../components/CustomButton';
import { saveProfileToFirebase } from '../services/profileService';

export default function AccommodationTypeScreen({ navigation }) {
  const [selectedAccommodation, setSelectedAccommodation] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [openToAnything, setOpenToAnything] = useState(false);

  const { updateProfile } = useAppState();

  const circleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(circleAnim, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const circularMove = (x1, x2, y1, y2) => ({
    transform: [
      {
        translateX: circleAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [x1, x2, x1],
        }),
      },
      {
        translateY: circleAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [y1, y2, y1],
        }),
      },
    ],
  });

  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    setOpenToAnything(false);

    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((value) => value !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const SelectCard = ({ title, icon, selected, onPress }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionCard,
        selected && styles.optionCardSelected,
        pressed && styles.optionCardPressed,
      ]}
    >
      <Image source={icon} style={styles.optionIcon} resizeMode="contain" />

      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {title}
      </Text>
    </Pressable>
  );

  const handleNext = async () => {
    if (
      !openToAnything &&
      (selectedAccommodation.length === 0 || selectedRoomTypes.length === 0)
    ) {
      return;
    }

    const accommodationType = openToAnything
      ? ['Open to anything']
      : selectedAccommodation;

    const roomType = openToAnything
      ? ['Open to anything']
      : selectedRoomTypes;

    updateProfile({
      accommodationType,
      roomType,
      openToAnything,
    });

    await saveProfileToFirebase({
      accommodationType,
      roomType,
      openToAnything,
    });

    navigation.navigate('AccommodationDetails');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.backgroundLayer}>
        <Animated.View
          style={[
            styles.colorBlob,
            styles.yellowBlob,
            circularMove(-120, 120, 80, -80),
          ]}
        />

        <Animated.View
          style={[
            styles.colorBlob,
            styles.greyBlob,
            circularMove(80, -80, -60, 60),
          ]}
        />

        <Animated.View
          style={[
            styles.colorBlob,
            styles.creamBlob,
            circularMove(-90, 90, -70, 70),
          ]}
        />

        <BlurView
          intensity={Platform.OS === 'android' ? 45 : 60}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />

        {Platform.OS === 'android' && (
          <View style={styles.androidSoftOverlay} />
        )}
      </View>

      <View style={styles.container}>
        <ScrollView
          style={styles.topContent}
          contentContainerStyle={styles.topContentInner}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Type of Accommodation</Text>

          <Text style={styles.subtitle}>
            Select all that apply
          </Text>

          <View style={styles.grid}>
            <SelectCard
              title="House"
              icon={require('../../assets/icons/accommodation.png')}
              selected={selectedAccommodation.includes('House')}
              onPress={() =>
                toggleSelection(
                  'House',
                  selectedAccommodation,
                  setSelectedAccommodation
                )
              }
            />

            <SelectCard
              title="Apartment"
              icon={require('../../assets/icons/apartment.png')}
              selected={selectedAccommodation.includes('Apartment')}
              onPress={() =>
                toggleSelection(
                  'Apartment',
                  selectedAccommodation,
                  setSelectedAccommodation
                )
              }
            />

            <SelectCard
              title="Studio"
              icon={require('../../assets/icons/studio.png')}
              selected={selectedAccommodation.includes('Studio')}
              onPress={() =>
                toggleSelection(
                  'Studio',
                  selectedAccommodation,
                  setSelectedAccommodation
                )
              }
            />
          </View>

          <Text style={styles.sectionTitle}>Room Type</Text>

          <View style={styles.grid}>
            <SelectCard
              title="Double"
              icon={require('../../assets/icons/double.png')}
              selected={selectedRoomTypes.includes('Double')}
              onPress={() =>
                toggleSelection(
                  'Double',
                  selectedRoomTypes,
                  setSelectedRoomTypes
                )
              }
            />

            <SelectCard
              title="Single"
              icon={require('../../assets/icons/single.png')}
              selected={selectedRoomTypes.includes('Single')}
              onPress={() =>
                toggleSelection(
                  'Single',
                  selectedRoomTypes,
                  setSelectedRoomTypes
                )
              }
            />

            <SelectCard
              title="Twin"
              icon={require('../../assets/icons/twin.png')}
              selected={selectedRoomTypes.includes('Twin')}
              onPress={() =>
                toggleSelection(
                  'Twin',
                  selectedRoomTypes,
                  setSelectedRoomTypes
                )
              }
            />

            <SelectCard
              title="Shared"
              icon={require('../../assets/icons/shared.png')}
              selected={selectedRoomTypes.includes('Shared')}
              onPress={() =>
                toggleSelection(
                  'Shared',
                  selectedRoomTypes,
                  setSelectedRoomTypes
                )
              }
            />
          </View>

          <Pressable
            onPress={() => {
              setOpenToAnything((current) => !current);
              setSelectedAccommodation([]);
              setSelectedRoomTypes([]);
            }}
            style={({ pressed }) => [
              styles.openCard,
              openToAnything && styles.openCardSelected,
              pressed && styles.optionCardPressed,
            ]}
          >
            <View
              style={[
                styles.openCircle,
                openToAnything && styles.openCircleSelected,
              ]}
            />

            <Text style={styles.openText}>
              I’m open to anything
            </Text>
          </Pressable>
        </ScrollView>

        <View style={styles.bottomContent}>
          <View style={styles.carouselDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>

          <CustomButton
            title="Next"
            onPress={handleNext}
            style={styles.buttonShadow}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FDF4D4',
    overflow: 'hidden',
  },

  androidSoftOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(253, 244, 212, 0.35)',
  },

  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FDF4D4',
  },

  colorBlob: {
    position: 'absolute',
    width: 560,
    height: 560,
    borderRadius: 280,
  },

  yellowBlob: {
    backgroundColor: '#F4B400',
    left: -170,
    bottom: -180,
    opacity: Platform.OS === 'android' ? 0.9 : 0.62,
  },

  greyBlob: {
    backgroundColor: '#E8E7E3',
    right: -180,
    top: -80,
    opacity: 0.9,
  },

  creamBlob: {
    backgroundColor: '#FDF4D4',
    left: -120,
    top: -120,
    opacity: Platform.OS === 'android' ? 0.9 : 0.95,
  },

  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 70,
    paddingBottom: 40,
  },

  topContent: {
    flex: 1,
    marginTop: 20,
  },

  topContentInner: {
    paddingBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 14,
    fontFamily: 'IBM Plex Sans JP',
  },

  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 36,
    fontFamily: 'IBM Plex Sans JP',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginTop: 26,
    marginBottom: 28,
    fontFamily: 'IBM Plex Sans JP',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  optionCard: {
    width: '47%',
    height: 92,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.10)',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    paddingHorizontal: 10,
  },

  optionCardSelected: {
    backgroundColor: '#F4B400',
    borderColor: '#F4B400',
  },

  optionCardPressed: {
    transform: [{ scale: 0.985 }],
  },

  optionIcon: {
    width: 36,
    height: 36,
    marginBottom: 10,
  },

  optionText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
    fontFamily: 'IBM Plex Sans JP',
    textAlign: 'center',
    width: '100%',
  },

  optionTextSelected: {
    color: '#2B2B2B',
    fontWeight: '700',
  },

  openCard: {
    height: 60,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 26,
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  openCardSelected: {
    backgroundColor: '#F4B400',
    borderColor: '#F4B400',
  },

  openCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#2B2B2B',
    marginRight: 30,
  },

  openCircleSelected: {
    backgroundColor: '#ffff',
    borderColor: '#ffff',
  },

  openText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
    fontFamily: 'IBM Plex Sans JP',
    marginLeft: 14,
  },

  bottomContent: {
    marginBottom: 24,
  },

  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 8,
    backgroundColor: 'rgba(43,43,43,0.18)',
  },

  activeDot: {
    width: 22,
    backgroundColor: '#2B2B2B',
  },

  buttonShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});