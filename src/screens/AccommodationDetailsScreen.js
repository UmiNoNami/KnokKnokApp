import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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
import { BlurView } from 'expo-blur';

import Slider from '@react-native-community/slider';

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
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const { updateProfile, profileDraft } = useAppState();

  const scrollRef = useRef(null);

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

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
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

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollRef}
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>
              Accommodation Details
            </Text>

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
              <Text style={styles.rowLabel}>
                {profileDraft?.role === 'seeker'
                  ? 'Your Budget'
                  : 'Rent Price'}
              </Text>

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

            {!keyboardVisible && (
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
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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

  flex: {
    flex: 1,
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
    paddingBottom: 0,
  },

  scrollContent: {
    paddingBottom: Platform.OS === 'android' ? 160 : 90,
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
    marginBottom: 24,
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