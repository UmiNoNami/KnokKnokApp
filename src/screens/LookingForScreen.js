import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppState } from '../providers/AppProvider';
import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';

export default function LookingForScreen({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const { updateProfile } = useAppState();

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
        <View
          style={[
            styles.iconCircle,
            selected && styles.iconCircleSelected,
          ]}
        >
          <Image source={icon} style={styles.optionIcon} />
        </View>

        <Text
          style={[
            styles.optionText,
            selected && styles.optionTextSelected,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    );
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const role =
      selectedOption === 'accommodation'
        ? 'seeker'
        : 'provider';

    updateProfile({ role });
    navigation.navigate('AccommodationType');
  };

  return (
    <AppScreen padded={false}>
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
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>

          <CustomButton
            title="Next"
            onPress={handleNext}
            disabled={!selectedOption}
            style={!selectedOption && styles.disabledButton}
            textStyle={!selectedOption && styles.disabledButtonText}
          />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#f4b400',
    borderColor: '#f4b400',
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
    color: '#2b2b2b',
  },

  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
});