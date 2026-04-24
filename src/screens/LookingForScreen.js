import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useAppState } from '../providers/AppProvider';
import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';

export default function LookingForScreen({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const { updateProfile } = useAppState();
  

  const OptionCard = ({ title, value }) => {
    const selected = selectedOption === value;

    return (
      <Pressable
        onPress={() => setSelectedOption(value)}
        style={[
          styles.optionCard,
          selected && styles.optionCardSelected,
        ]}
      >
        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
          {selected && <View style={styles.radioInner} />}
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

  return (
    <AppScreen>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>What are you looking for?</Text>

          <Text style={styles.subtitle}>
            Are you searching for a place to stay or someone to share your
            space with?
          </Text>

          <View style={styles.optionsWrapper}>
            <OptionCard
              title="I need an accommodation"
              value="accommodation"
            />

            <OptionCard
              title="I need a tenant/roommate"
              value="tenant"
            />
          </View>
        </View>

        <View style={styles.buttonWrapper}>
 
 <CustomButton
  title="Next"
  onPress={() => {
    if (!selectedOption) return;

    const role =
      selectedOption === 'accommodation'
        ? 'accommodation'
        : 'roommate';

    updateProfile({ role });

    navigation.navigate('Lifestyle');
  }}
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
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 32,
    paddingTop: 70,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2A2A2A',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#3A3A3A',
    lineHeight: 24,
    maxWidth: 320,
  },
  optionsWrapper: {
    marginTop: 120,
    gap: 48,
  },
  optionCard: {
    width: '100%',
    minHeight: 60,
    borderRadius: 22,
    backgroundColor: '#EDEAE6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  optionCardSelected: {
    backgroundColor: '#F4A261',
  },
  radioOuter: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#2F2F2F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  radioOuterSelected: {
    borderColor: '#FFFFFF',
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    fontSize: 18,
    color: '#111',
    fontWeight: '400',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: '#D9D4CE',
    borderColor: '#BFB7AE',
  },
  disabledButtonText: {
    color: '#7C746B',
  },
});