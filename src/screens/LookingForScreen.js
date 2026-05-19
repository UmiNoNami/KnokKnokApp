import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';

import { useAppState } from '../providers/AppProvider';
import CustomButton from '../components/CustomButton';
import { saveProfileToFirebase } from '../services/profileService';

export default function LookingForScreen({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(null);
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

  const OptionCard = ({ title, value, icon }) => {
    const selected = selectedOption === value;

    return (
      <Pressable
        onPress={() => setSelectedOption(value)}
        style={({ pressed }) => [
          styles.optionCard,
          selected && styles.optionCardSelected,
          pressed && styles.optionCardPressed,
        ]}
      >
        <View style={[styles.iconCircle, selected && styles.iconCircleSelected]}>
          <Image source={icon} style={styles.optionIcon} />
        </View>

        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
          {title}
        </Text>
      </Pressable>
    );
  };

  const handleNext = async () => {
    if (!selectedOption) return;

    const role = selectedOption === 'accommodation' ? 'seeker' : 'provider';

    updateProfile({ role });

    await saveProfileToFirebase({ role });

    navigation.navigate('AccommodationType');
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
        <View style={styles.topContent}>
          <Text style={styles.title}>What are you looking for?</Text>

          <Text style={styles.subtitle}>
            Are you searching for a place to stay or someone to share your
            space with?
          </Text>

          <View style={styles.optionsWrapper}>
            <OptionCard
              title="I need accommodation"
              value="accommodation"
              icon={require('../../assets/icons/accommodation.png')}
            />

            <OptionCard
              title="I need a tenant / roommate"
              value="tenant"
              icon={require('../../assets/icons/tenant.png')}
            />
          </View>
        </View>

        <View style={styles.bottomContent}>
          <View style={styles.carouselDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <CustomButton
            title="Next"
            onPress={handleNext}
            disabled={!selectedOption}
            style={[
              styles.buttonShadow,
              !selectedOption && styles.disabledButton,
            ]}
            textStyle={!selectedOption && styles.disabledButtonText}
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

  bottomContent: {
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2A2A2A',
    marginBottom: 16,
    fontFamily: 'IBM Plex Sans JP',
  },

  subtitle: {
    fontSize: 16,
    color: '#3A3A3A',
    lineHeight: 26,
    fontFamily: 'IBM Plex Sans JP',
  },

  optionsWrapper: {
    marginTop: 92,
    gap: 22,
  },

  optionCard: {
    width: '100%',
    minHeight: 76,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.28)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  optionCardSelected: {
    backgroundColor: '#F4B400',
    borderColor: '#F4B400',
  },

  optionCardPressed: {
    transform: [{ scale: 0.985 }],
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  iconCircleSelected: {
    backgroundColor: '#FFFFFF',
  },

  optionIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#111111',
    fontWeight: '700',
    fontFamily: 'IBM Plex Sans JP',
    marginLeft: 4,
  },

  optionTextSelected: {
    color: '#2B2B2B',
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

  disabledButton: {
    opacity: 0.45,
  },

  disabledButtonText: {
    color: '#111',
  },

  buttonShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});