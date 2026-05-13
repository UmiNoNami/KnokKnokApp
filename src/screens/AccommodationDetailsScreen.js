import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Pressable,
} from 'react-native';
import Slider from '@react-native-community/slider';
import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';
import { useAppState } from '../providers/AppProvider';
import { saveProfileToFirebase } from '../services/profileService';

export default function AccommodationDetailsScreen({ navigation }) {
  const [tenantsCount, setTenantsCount] = useState(0);
  const [bathroomCount, setBathroomCount] = useState(0);
  const [bedroomCount, setBedroomCount] = useState(0);
  const { updateProfile } = useAppState();
  const scrollRef = useRef(null);

  const [livingRoom, setLivingRoom] = useState(false);
  const [gardenBalcony, setGardenBalcony] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [billIncluded, setBillIncluded] = useState(false);

  const [priceRange, setPriceRange] = useState(200);
  const [location, setLocation] = useState('');

  const increase = (setValue) => setValue((prev) => prev + 1);
  const decrease = (setValue) =>
    setValue((prev) => (prev > 0 ? prev - 1 : 0));

  const formatTwoDigits = (value) => String(value).padStart(2, '0');

  const StepperControl = ({ value, setValue }) => (
    <View style={styles.stepperContainer}>
      <Pressable
        style={styles.stepperButton}
        onPress={() => decrease(setValue)}
      >
        <Text style={styles.stepperButtonText}>−</Text>
      </Pressable>

      <View style={styles.numberBox}>
        <Text style={styles.numberBoxText}>{formatTwoDigits(value)}</Text>
      </View>

      <Pressable
        style={styles.stepperButton}
        onPress={() => increase(setValue)}
      >
        <Text style={styles.stepperButtonText}>+</Text>
      </Pressable>
    </View>
  );

  const StepperRow = ({ label, value, setValue, showDivider = true }) => (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.rowLabel}>{label}</Text>
        <StepperControl value={value} setValue={setValue} />
      </View>
      {showDivider && <View style={styles.divider} />}
    </View>
  );

  const ToggleRow = ({ label, value, onValueChange, showDivider = true }) => (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#D1D1D1', true: '#34C759' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#D1D1D1"
        />
      </View>
      {showDivider && <View style={styles.divider} />}
    </View>
  );

  return (
    <AppScreen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
           ref={scrollRef}
              contentContainerStyle={styles.scrollContent}
               keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                >
            <View style={styles.container}>
  <View style={styles.topContent}>
                <Text style={styles.title}>Accomodation Details</Text>

                <View style={styles.singleRowCard}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.rowLabel}>Number of{'\n'}tenants</Text>
                    <StepperControl
                      value={tenantsCount}
                      setValue={setTenantsCount}
                    />
                  </View>
                </View>

                <View style={styles.detailsCard}>
                  <StepperRow
                    label="Bathroom"
                    value={bathroomCount}
                    setValue={setBathroomCount}
                  />

                  <StepperRow
                    label="Bedroom"
                    value={bedroomCount}
                    setValue={setBedroomCount}
                  />

                  <ToggleRow
                    label="Living Room"
                    value={livingRoom}
                    onValueChange={setLivingRoom}
                  />

                  <ToggleRow
                    label="Garden/Balcony"
                    value={gardenBalcony}
                    onValueChange={setGardenBalcony}
                    showDivider={false}
                  />
                </View>

                <View style={styles.singleRowCard}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.rowLabel}>Wifi</Text>
                    <Switch
                      value={wifi}
                      onValueChange={setWifi}
                      trackColor={{ false: '#D1D1D1', true: '#34C759' }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor="#D1D1D1"
                    />
                  </View>
                </View>

                <View style={styles.singleRowCard}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.rowLabel}>Furnished</Text>
                    <Switch
                      value={furnished}
                      onValueChange={setFurnished}
                      trackColor={{ false: '#D1D1D1', true: '#34C759' }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor="#D1D1D1"
                    />
                  </View>
                </View>

                <View style={styles.singleRowCard}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.rowLabel}>Bill Included</Text>
                    <Switch
                      value={billIncluded}
                      onValueChange={setBillIncluded}
                      trackColor={{ false: '#D1D1D1', true: '#34C759' }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor="#D1D1D1"
                    />
                  </View>
                </View>

                <View style={styles.priceCard}>
                  <Text style={styles.rowLabel}>Price Range</Text>

                  <Slider
                    style={styles.slider}
                    minimumValue={50}
                    maximumValue={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    minimumTrackTintColor="#C8C8C8"
                    maximumTrackTintColor="#C8C8C8"
                    thumbTintColor="#3B3B3B"
                  />

                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>€{priceRange}</Text>
                    <Text style={styles.perWeekText}>per week</Text>
                  </View>
                </View>

                <Text style={styles.locationTitle}>Please enter the location</Text>

                  <TextInput
  style={styles.locationInput}
  placeholder="Location"
  placeholderTextColor="#A8A29E"
  value={location}
  onChangeText={setLocation}
  returnKeyType="done"
  onSubmitEditing={Keyboard.dismiss}
  onFocus={() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 250);
  }}
/>
              </View>

              <View style={styles.buttonWrapper}>
                     <CustomButton
                      title="Next"
           onPress={async () => {
  updateProfile({
    tenants: tenantsCount,
    bathroomCount,
    bedroomCount,
    livingRoom,
    gardenBalcony,
    wifi,
    furnished,
    billsIncluded: billIncluded,
    price: priceRange,
    location,
  });

  await saveProfileToFirebase({
    tenants: tenantsCount,
    bathroomCount,
    bedroomCount,
    livingRoom,
    gardenBalcony,
    wifi,
    furnished,
    billsIncluded: billIncluded,
    price: priceRange,
    location,
  });

  navigation.navigate('Lifestyle');
}}
/>

              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
    container: {
  backgroundColor: '#F4F4F4',
  paddingHorizontal: 32,
  paddingTop: 70,
  paddingBottom: 20,
},
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 42,
  },
  singleRowCard: {
    width: '100%',
    minHeight: 88,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#D8D3CB',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 22,
    paddingVertical: 16,
    justifyContent: 'center',
    marginBottom: 20,
  },
  detailsCard: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#D8D3CB',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginBottom: 20,
  },
   rowBetween: {
  minHeight: 56,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 16, 
},
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3A3A3A',
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F1F1',
  },
  stepperButtonText: {
    fontSize: 20,
    color: '#222',
    fontWeight: '600',
    lineHeight: 22,
  },
  numberBox: {
    width: 50,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D8D3CB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
  },
  numberBoxText: {
    fontSize: 14,
    color: '#111',
  },
   priceCard: {
  width: '100%',
  borderRadius: 22,
  borderWidth: 1,
  borderColor: '#D8D3CB',
  backgroundColor: '#F4F4F4',
  paddingHorizontal: 22,
  paddingTop: 18,
  paddingBottom: 12,
  marginTop: 18,
  marginBottom: 60, // 👈 INCREASE THIS
},
  slider: {
    width: '100%',
    height: 42,
    marginTop: 16,
  },
  priceRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    color: '#111',
    marginLeft: 58,
  },
  perWeekText: {
    fontSize: 14,
    color: '#111',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 24,
  },
  locationInput: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8D3CB',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
    marginBottom: 24,
  },
    buttonWrapper: {
  width: '100%',
  marginTop: 40, 
  marginBottom: 24,
},
});