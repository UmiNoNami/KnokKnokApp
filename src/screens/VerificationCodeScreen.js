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

export default function VerificationCodeScreen({ navigation, route }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const phoneNumber = route.params?.phoneNumber || '';

  const handleVerifyCode = async () => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      Alert.alert('Missing code', 'Please enter the verification code.');
      return;
    }

    try {
      setLoading(true);

      if (trimmedCode === '123456') {
        navigation.navigate('UserDetails');
      } else {
        Alert.alert('Invalid code', 'Please enter the correct verification code.');
      }
    } catch (error) {
      console.log('Verify code error:', error);
      Alert.alert('Verification failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Enter verification code</Text>

            <Text style={styles.description}>
              We sent a code to {phoneNumber || 'your phone number'}.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#9E9E9E"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              maxLength={6}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <CustomButton
              title={loading ? 'Verifying...' : 'Verify'}
              onPress={handleVerifyCode}
            />
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
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    color: '#2F2F2F',
    lineHeight: 24,
    marginBottom: 36,
  },
  input: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8D3CB',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
    letterSpacing: 4,
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 24,
  },
});