import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

import CustomButton from '../components/CustomButton';
import { auth } from '../firebase/firebaseConfig';

export default function VerificationCodeScreen({ navigation, route }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const phoneNumber = route.params?.phoneNumber || '';
  const verificationId = route.params?.verificationId || '';

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

  const handleVerifyCode = async () => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      Alert.alert('Missing code', 'Please enter the verification code.');
      return;
    }

    if (!verificationId) {
      Alert.alert('Missing verification', 'Please go back and request a new code.');
      return;
    }

    try {
      setLoading(true);

      const credential = PhoneAuthProvider.credential(
        verificationId,
        trimmedCode
      );

      await signInWithCredential(auth, credential);

      console.log('PHONE AUTH USER:', auth.currentUser?.uid);

      navigation.navigate('UserDetails');
    } catch (error) {
      console.log('Verify code error:', error);
      Alert.alert('Verification failed', error.message);
    } finally {
      setLoading(false);
    }
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

        {Platform.OS === 'android' && <View style={styles.androidSoftOverlay} />}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.topContent}>
              <Text style={styles.title}>Enter verification code</Text>

              <Text style={styles.description}>
                We sent a 6-digit code to{' '}
                <Text style={styles.boldNumber}>
                  {phoneNumber || 'your phone number'}
                </Text>
              </Text>

              <Text style={styles.inputLabel}>Verification code</Text>

              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor="#A9A9A9"
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
                maxLength={6}
              />
            </View>

            {!keyboardVisible && (
              <View style={styles.bottomContent}>
                <View style={styles.carouselDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={[styles.dot, styles.activeDot]} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>

                <View style={styles.buttonWrapper}>
                  <CustomButton
                    title={loading ? 'Verifying...' : 'Verify'}
                    onPress={handleVerifyCode}
                    style={styles.buttonShadow}
                  />
                </View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
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
    marginBottom: 42,
    fontFamily: 'IBM Plex Sans JP',
  },
  boldNumber: { fontWeight: '800', color: '#111' },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 12,
    fontFamily: 'IBM Plex Sans JP',
  },
  input: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.28)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    fontSize: 20,
    color: '#111',
    letterSpacing: 10,
    textAlign: 'center',
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
  buttonWrapper: { width: '100%' },
  buttonShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});