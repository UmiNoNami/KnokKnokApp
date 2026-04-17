import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';
import SelectableChip from '../components/SelectableChip';

export default function LifestyleScreen({ navigation }) {
  const [selectedItems, setSelectedItems] = useState([]);

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
          <SelectableChip
            key={option}
            label={option}
            selected={selectedItems.includes(option)}
            onPress={() => toggleItem(option)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <AppScreen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Choose you lifestyle</Text>

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
              'lightsleeper',
              'heavysleeper',
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
          </View>

          <View style={styles.buttonWrapper}>
            <CustomButton
              title="Next"
              onPress={() => navigation.navigate('CreateProfile')}
            />
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 32,
    paddingTop: 70,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 38,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 24,
    marginBottom: 24,
  },
});