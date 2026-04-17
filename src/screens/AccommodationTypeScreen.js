import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppState } from '../providers/AppProvider';
import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';

export default function AccommodationTypeScreen({ navigation }) {
  const [selectedAccommodation, setSelectedAccommodation] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const { updateProfile } = useAppState();

  const toggleSelection = (item, selectedItems, setSelectedItems) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((value) => value !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const SelectCard = ({ title, selected, onPress }) => (
    <View style={styles.cardWrapper}>
      <CustomButton
        title={title}
        onPress={onPress}
        style={[
          styles.optionCard,
          selected && styles.optionCardSelected,
        ]}
        textStyle={[
          styles.optionText,
          selected && styles.optionTextSelected,
        ]}
      />
    </View>
  );

  return (
    <AppScreen>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Type of Accomodation</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>

          <View style={styles.grid}>
            <SelectCard
              title="House"
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
        </View>

        <View style={styles.buttonWrapper}>
           <CustomButton
  title="Next"
  onPress={() => {
    if (
      selectedAccommodation.length === 0 ||
      selectedRoomTypes.length === 0
    ) {
      return;
    }

    updateProfile({
      accommodationType: selectedAccommodation,
      roomType: selectedRoomTypes,
    });

    navigation.navigate('AccommodationDetails');
  }}
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
    color: '#111',
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginTop: 24,
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '47%',
    marginBottom: 14,
  },
  optionCard: {
    height: 86,
    borderRadius: 18,
    borderWidth: 0,
    backgroundColor: '#ECEAE7',
    shadowOpacity: 0,
    elevation: 0,
  },
  optionCardSelected: {
    backgroundColor: '#8E8E8E',
    borderWidth: 1.2,
    borderColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 24,
  },
});