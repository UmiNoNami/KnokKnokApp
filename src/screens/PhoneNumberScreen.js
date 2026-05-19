import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider } from 'firebase/auth';

import CustomButton from '../components/CustomButton';
import { auth, firebaseConfig } from '../firebase/firebaseConfig';

const countryCodes = [
  { country: 'Ireland', code: '+353', flag: '🇮🇪' },
  { country: 'Mongolia', code: '+976', flag: '🇲🇳' },
  { country: 'Brazil', code: '+55', flag: '🇧🇷' },
  { country: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { country: 'United States', code: '+1', flag: '🇺🇸' },
  { country: 'South Korea', code: '+82', flag: '🇰🇷' },
];

export default function PhoneNumberScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const recaptchaVerifier = useRef(null);
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

  const handleSendCode = async () => {
    const localNumber = phoneNumber.replace(/\s/g, '').trim();

    if (!localNumber) {
      Alert.alert('Missing number', 'Please enter your phone number.');
      return;
    }

    const fullPhoneNumber = `${selectedCountry.code}${localNumber}`;

    try {
      setLoading(true);

      const phoneProvider = new PhoneAuthProvider(auth);

      const verificationId = await phoneProvider.verifyPhoneNumber(
        fullPhoneNumber,
        recaptchaVerifier.current
      );

      navigation.navigate('VerificationCode', {
        phoneNumber: fullPhoneNumber,
        verificationId,
      });
    } catch (error) {
      console.log('Send code error:', error);
      Alert.alert('Could not send code', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />

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

        {Platform.OS === 'android' && <View style={styles.androidSoftOverlay} />}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.topContent}>
            <Text style={styles.title}>What’s your mobile number?</Text>

            <Text style={styles.description}>
              Enter the mobile number you can be contacted on. It will stay
              private and won’t appear on your profile.
            </Text>

            <Text style={styles.inputLabel}>Mobile number</Text>

            <View style={styles.phoneRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.countryButton,
                  pressed && styles.fieldPressed,
                ]}
                onPress={() => setShowCountryPicker(true)}
              >
                <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
                <Text style={styles.chevron}>⌄</Text>
              </Pressable>

              <TextInput
                style={styles.input}
                placeholder="87 123 4567"
                placeholderTextColor="#A9A9A9"
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          <View style={styles.bottomContent}>
            <View style={styles.carouselDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
            </View>

            <CustomButton
              title={loading ? 'Sending...' : 'Next'}
              onPress={handleSendCode}
              style={styles.buttonShadow}
            />
          </View>
        </View>

        <Modal
          transparent
          visible={showCountryPicker}
          animationType="fade"
          onRequestClose={() => setShowCountryPicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowCountryPicker(false)}
          >
            <View style={styles.countrySheet}>
              <Text style={styles.sheetTitle}>Choose country code</Text>

              {countryCodes.map((item) => (
                <Pressable
                  key={item.code}
                  style={styles.countryOption}
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryPicker(false);
                  }}
                >
                  <Text style={styles.optionFlag}>{item.flag}</Text>

                  <View style={styles.optionTextWrap}>
                    <Text style={styles.optionCountry}>{item.country}</Text>
                    <Text style={styles.optionCode}>{item.code}</Text>
                  </View>

                  {selectedCountry.code === item.code && (
                    <Text style={styles.selectedCheck}>✓</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDF4D4', overflow: 'hidden' },
  androidSoftOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(253, 244, 212, 0.35)',
  },
  flex: { flex: 1 },
  backgroundLayer: { ...StyleSheet.absoluteFillObject, backgroundColor: '#FDF4D4' },
  colorBlob: { position: 'absolute', width: 560, height: 560, borderRadius: 280 },
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
    justifyContent: 'flex-start',
  },
  topContent: { flex: 1, marginTop: 20 },
  bottomContent: { marginBottom: 24 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2A2A2A',
    marginBottom: 14,
    fontFamily: 'IBM Plex Sans JP',
  },
  description: {
    fontSize: 16,
    color: '#2F2F2F',
    lineHeight: 26,
    textAlign: 'left',
    marginBottom: 42,
    fontFamily: 'IBM Plex Sans JP',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 12,
    fontFamily: 'IBM Plex Sans JP',
  },
  phoneRow: { flexDirection: 'row', gap: 10 },
  countryButton: {
    height: 58,
    minWidth: 112,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.28)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldPressed: { backgroundColor: '#F6F6F6' },
  countryFlag: { fontSize: 18, marginRight: 6 },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    fontFamily: 'IBM Plex Sans JP',
  },
  chevron: { fontSize: 18, color: '#555', marginLeft: 6, marginTop: -10 },
  input: {
    flex: 1,
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
  activeDot: { width: 22, backgroundColor: '#2B2B2B' },
  buttonShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  countrySheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 36,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 16,
    fontFamily: 'IBM Plex Sans JP',
  },
  countryOption: {
    minHeight: 58,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  optionFlag: { fontSize: 22, marginRight: 12 },
  optionTextWrap: { flex: 1 },
  optionCountry: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    fontFamily: 'IBM Plex Sans JP',
  },
  optionCode: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
    fontFamily: 'IBM Plex Sans JP',
  },
  selectedCheck: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2B2B2B',
  },
});