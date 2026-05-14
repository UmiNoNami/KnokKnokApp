import React, { useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Slider from '@react-native-community/slider';

import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';
import { useAppState } from '../providers/AppProvider';
import { saveProfileToFirebase } from '../services/profileService';

const popularAreas = [
  'City Centre',
  'Smithfield',
  'Bray',
  'Rathmines',
  'Ranelagh',
  'Dublin 1',
  'Dublin 2',
  'Dublin 7',
  'Dublin 8',
  'Dublin 16',
];

export default function AccommodationDetailsScreen({ navigation }) {
  const [tenantsCount, setTenantsCount] = useState(0);
  const [bathroomCount, setBathroomCount] = useState(0);
  const [bedroomCount, setBedroomCount] = useState(0);

  const [livingRoom, setLivingRoom] = useState(false);
  const [gardenBalcony, setGardenBalcony] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [billIncluded, setBillIncluded] = useState(false);

  const [priceRange, setPriceRange] = useState(200);
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { updateProfile } = useAppState();
  const scrollRef = useRef(null);

  const suggestions = useMemo(() => {
    const query = location.trim().toLowerCase();

    if (!query) return popularAreas.slice(0, 5);

    return popularAreas.filter((area) =>
      area.toLowerCase().includes(query)
    );
  }, [location]);

  const increase = (setValue) => setValue((prev) => prev + 1);

  const decrease = (setValue) =>
    setValue((prev) => (prev > 0 ? prev - 1 : 0));

  const formatTwoDigits = (value) => String(value).padStart(2, '0');

  const StepperControl = ({ value, setValue }) => (
    <View style={styles.stepperContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.stepperButton,
          pressed && styles.stepperPressed,
        ]}
        onPress={() => decrease(setValue)}
      >
        <Text style={styles.stepperButtonText}>−</Text>
      </Pressable>

      <View style={styles.numberBox}>
        <Text style={styles.numberBoxText}>
          {formatTwoDigits(value)}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.stepperButton,
          pressed && styles.stepperPressed,
        ]}
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

  const ToggleRow = ({
    label,
    value,
    onValueChange,
    showDivider = true,
  }) => (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.rowLabel}>{label}</Text>

        <View style={styles.switchWrap}>
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#D1D1D1', true: '#F4B400' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D1D1D1"
          />
        </View>
      </View>

      {showDivider && <View style={styles.divider} />}
    </View>
  );

  const handleNext = async () => {
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
  };

  return (
    <AppScreen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
  ref={scrollRef}
  style={styles.container}
  contentContainerStyle={styles.scrollContent}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
        
              <Text style={styles.title}>Accommodation Details</Text>

              <View style={styles.singleRowCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.rowLabel}>
                    Number of{'\n'}tenants
                  </Text>

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
    showDivider={false}
  />
</View>

<View style={styles.singleRowCard}>
  <View style={styles.rowBetween}>
    <Text style={styles.rowLabel}>Living Room</Text>

    <View style={styles.switchWrap}>
      <Switch
        value={livingRoom}
        onValueChange={setLivingRoom}
        trackColor={{ false: '#D1D1D1', true: '#F4B400' }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#D1D1D1"
      />
    </View>
  </View>
</View>

<View style={styles.singleRowCard}>
  <View style={styles.rowBetween}>
    <Text style={styles.rowLabel}>Garden/Balcony</Text>

    <View style={styles.switchWrap}>
      <Switch
        value={gardenBalcony}
        onValueChange={setGardenBalcony}
        trackColor={{ false: '#D1D1D1', true: '#F4B400' }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#D1D1D1"
      />
    </View>
  </View>
</View>

              <View style={styles.singleRowCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.rowLabel}>Wifi</Text>

                  <View style={styles.switchWrap}>
                    <Switch
                      value={wifi}
                      onValueChange={setWifi}
                      trackColor={{ false: '#D1D1D1', true: '#F4B400' }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor="#D1D1D1"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.singleRowCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.rowLabel}>Furnished</Text>

                  <View style={styles.switchWrap}>
                    <Switch
                      value={furnished}
                      onValueChange={setFurnished}
                      trackColor={{ false: '#D1D1D1', true: '#F4B400' }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor="#D1D1D1"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.singleRowCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.rowLabel}>Bill Included</Text>

                  <View style={styles.switchWrap}>
                    <Switch
                      value={billIncluded}
                      onValueChange={setBillIncluded}
                      trackColor={{ false: '#D1D1D1', true: '#F4B400' }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor="#D1D1D1"
                    />
                  </View>
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
                  minimumTrackTintColor="#F4B400"
                  maximumTrackTintColor="#E5E5E5"
                  thumbTintColor="#F4B400"
                />

                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>€{priceRange}</Text>
                  <Text style={styles.perWeekText}>per week</Text>
                </View>
              </View>

              <Text style={styles.locationTitle}>
                Preferred area or location
              </Text>

              <Text style={styles.locationSubtitle}>
                You can type a place or choose one of the popular areas.
              </Text>

              <TextInput
  style={styles.locationInput}
  placeholder="e.g. Bray, City Centre, Dublin 7"
  placeholderTextColor="#A8A29E"
  value={location}
  onChangeText={setLocation}
  onFocus={() => {
    setShowSuggestions(true);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 250);
  }}
              />

              {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsBox}>
                  {suggestions.map((area) => (
                    <Pressable
                      key={area}
                      style={({ pressed }) => [
                        styles.suggestionItem,
                        pressed && styles.suggestionPressed,
                      ]}
                      onPress={() => {
  setLocation(area);
  setShowSuggestions(false);
  Keyboard.dismiss();
}}
                    >
                      <Text style={styles.suggestionText}>{area}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            

            <View style={styles.bottomContent}>
              <View style={styles.carouselDots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={[styles.dot, styles.activeDot]} />
              </View>

              <CustomButton title="Next" onPress={handleNext} />
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
  maxHeight: '82%',
},

  scrollContent: {
  paddingBottom: 40,
},

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 36,
    fontFamily: 'IBM Plex Sans JP',
  },

  singleRowCard: {
    width: '100%',
    minHeight: 86,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.18)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 14,
    justifyContent: 'center',
    marginBottom: 18,
  },

  detailsCard: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.18)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginBottom: 18,
  },

  rowBetween: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#3A3A3A',
    fontFamily: 'IBM Plex Sans JP',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(43,43,43,0.10)',
  },

  stepperContainer: {
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },

  stepperButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  stepperPressed: {
    backgroundColor: '#F4B400',
    borderColor: '#F4B400',
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  numberBoxText: {
    fontSize: 14,
    color: '#111',
    fontFamily: 'IBM Plex Sans JP',
  },

  switchWrap: {
    width: 58,
    alignItems: 'flex-end',
  },

  priceCard: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.18)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 16,
    marginTop: 14,
    marginBottom: 34,
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
    fontWeight: '700',
    fontFamily: 'IBM Plex Sans JP',
  },

  perWeekText: {
    fontSize: 14,
    color: '#111',
    fontFamily: 'IBM Plex Sans JP',
  },

  locationTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
    fontFamily: 'IBM Plex Sans JP',
  },

  locationSubtitle: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: 'IBM Plex Sans JP',
  },

  locationInput: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.28)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
    fontFamily: 'IBM Plex Sans JP',
  },

  suggestionsBox: {
    marginTop: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.12)',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  suggestionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(43,43,43,0.08)',
  },

  suggestionPressed: {
    backgroundColor: '#F4B400',
  },

  suggestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    fontFamily: 'IBM Plex Sans JP',
  },

  bottomContent: {
  marginTop: 36,
  marginBottom: 0,
  paddingTop: 10,
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
});