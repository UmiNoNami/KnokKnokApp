import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';

export default function VerificationCodeScreen({
  navigation,
  route,
}) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const phoneNumber = route.params?.phoneNumber || '';

  const handleVerifyCode = async () => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      Alert.alert(
        'Missing code',
        'Please enter the verification code.'
      );
      return;
    }

    try {
      setLoading(true);

      if (trimmedCode === '123456') {
        navigation.navigate('UserDetails');
      } else {
        Alert.alert(
          'Invalid code',
          'Please enter the correct verification code.'
        );
      }
    } catch (error) {
      console.log('Verify code error:', error);

      Alert.alert(
        'Verification failed',
        'Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.topContent}>
            <Text style={styles.title}>
              Enter verification code
            </Text>

            <Text style={styles.description}>
              We sent a 6-digit code to{' '}
              <Text style={styles.boldNumber}>
                {phoneNumber || 'your phone number'}
              </Text>
            </Text>

            <Text style={styles.inputLabel}>
              Verification code
            </Text>

            <TextInput
              style={styles.input}
              placeholder="123456"
              placeholderTextColor="#A9A9A9"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              maxLength={6}
            />

            <Text style={styles.helperText}>
              For demo purposes use: 123456
            </Text>
          </View>

          <View style={styles.bottomContent}>
            <View style={styles.carouselDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
            </View>

            <View style={styles.buttonWrapper}>
              <CustomButton
                title={loading ? 'Verifying...' : 'Verify'}
                onPress={handleVerifyCode}
              />
            </View>
          </View>
        </View>
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
    justifyContent: 'flex-start',
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

  boldNumber: {
    fontWeight: '800',
    color: '#111',
  },

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

  helperText: {
    marginTop: 14,
    fontSize: 13,
    color: '#888',
    fontFamily: 'IBM Plex Sans JP',
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

  buttonWrapper: {
    width: '100%',
  },
});