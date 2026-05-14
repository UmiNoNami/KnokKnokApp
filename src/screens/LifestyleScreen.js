import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppState } from '../providers/AppProvider';
import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';
import { saveProfileToFirebase } from '../services/profileService';

function LifestyleChip({ label, selected, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const burst = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    burst.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.94,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(burst, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const sparkStyle = (x, y, rotate) => ({
    opacity: burst.interpolate({
      inputRange: [0, 0.25, 1],
      outputRange: [0, 1, 0],
    }),
    transform: [
      {
        translateX: burst.interpolate({
          inputRange: [0, 1],
          outputRange: [0, x],
        }),
      },
      {
        translateY: burst.interpolate({
          inputRange: [0, 1],
          outputRange: [0, y],
        }),
      },
      {
        scale: burst.interpolate({
          inputRange: [0, 0.4, 1],
          outputRange: [0.3, 1, 0.2],
        }),
      },
      { rotate },
    ],
  });

  return (
    <View style={styles.chipOuter}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={handlePress}
          style={[
            styles.chip,
            selected && styles.chipSelected,
          ]}
        >
          <Text
            style={[
              styles.chipText,
              selected && styles.chipTextSelected,
            ]}
          >
            {label}
          </Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={[styles.spark, styles.sparkOne, sparkStyle(18, -18, '18deg')]} />
      <Animated.View style={[styles.spark, styles.sparkTwo, sparkStyle(30, -8, '65deg')]} />
      <Animated.View style={[styles.spark, styles.sparkThree, sparkStyle(10, -30, '-25deg')]} />
      <Animated.View style={[styles.sparkDot, sparkStyle(24, -24, '0deg')]} />
    </View>
  );
}

export default function LifestyleScreen({ navigation }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const { updateProfile } = useAppState();

  const toggleItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((value) => value !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const renderSection = (title, options) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.chipContainer}>
        {options.map((option) => (
          <LifestyleChip
            key={option}
            label={option}
            selected={selectedItems.includes(option)}
            onPress={() => toggleItem(option)}
          />
        ))}
      </View>
    </View>
  );

  const handleNext = async () => {
    try {
      if (selectedItems.length === 0) return;

      updateProfile({ lifestyle: selectedItems });

      await saveProfileToFirebase({
        lifestyle: selectedItems,
      });

      navigation.navigate('CreateProfile');
    } catch (error) {
      console.log('ERROR:', error);
    }
  };

  return (
    <AppScreen padded={false}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Choose your lifestyle</Text>

        {renderSection('Daily Rhythm', [
          'early bird',
          'night owl',
          'flexible',
        ])}

        {renderSection('Noise Level', [
          'quiet',
          'social',
          'lively',
        ])}

        {renderSection('Sleep Habits', [
          'light sleeper',
          'heavy sleeper',
        ])}

        {renderSection('Cleanliness', [
          'tidy',
          'average',
          'relaxed',
        ])}

        {renderSection('Pets', [
          'no pets',
          'pets friendly',
        ])}

        {renderSection('Smoking', [
          'smoker',
          'non-smoker',
        ])}

        {renderSection('Other Preferences', [
          'LGBTQ',
          'Vegan',
        ])}

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
            disabled={selectedItems.length === 0}
            style={selectedItems.length === 0 && styles.disabledButton}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingTop: 70,
  },

  scrollContent: {
    paddingBottom: 70,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginTop: 20,
    marginBottom: 38,
    fontFamily: 'IBM Plex Sans JP',
  },

  section: {
    marginBottom: 26,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
    fontFamily: 'IBM Plex Sans JP',
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  chip: {
    minHeight: 42,
    minWidth: 96,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.22)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    
  },

  chipSelected: {
    backgroundColor: '#F4B400',
    borderColor: '#F4B400',
  },

  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    fontFamily: 'IBM Plex Sans JP',
    textTransform: 'capitalize',
  },

  chipTextSelected: {
    color: '#2B2B2B',
    fontWeight: '800',
  },

  splash: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  bottomContent: {
    marginTop: 18,
    marginBottom: 24,
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

  chipOuter: {
  position: 'relative',
  overflow: 'visible',
},

spark: {
  position: 'absolute',
  right: 8,
  top: -2,
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#eafa08',
  zIndex: 10,
},

sparkOne: {
  backgroundColor: '#f8e409',
},

sparkTwo: {
  backgroundColor: '#f7d306',
  borderWidth: 1,
  borderColor: '#faf608',
},

sparkThree: {
  backgroundColor: '#fae205',
},

sparkDot: {
  position: 'absolute',
  right: 10,
  top: 0,
  width: 5,
  height: 5,
  borderRadius: 3,
  backgroundColor: '#e7f706',
  zIndex: 10,
},
});