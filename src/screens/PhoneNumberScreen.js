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

export default function PhoneNumberScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    const trimmed = phoneNumber.trim();

    if (!trimmed) {
      Alert.alert('Missing number', 'Please enter your phone number.');
      return;
    }

    if (!trimmed.startsWith('+')) {
      Alert.alert(
        'Invalid format',
        'Use international format like +353871234567.'
      );
      return;
    }

    try {
      setLoading(true);

      navigation.navigate('VerificationCode', {
        phoneNumber: trimmed,
      });
    } catch (error) {
      console.log('Send code error:', error);
      Alert.alert(
        'Could not send code',
        'Check the number format and try again.'
      );
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
            <Text style={styles.title}>What’s your mobile number?</Text>

            <Text style={styles.description}>
              Enter the mobile number on which you can be contacted. No one
              will see this on your profile.
            </Text>

            <Text style={styles.countryLabel}>Ireland (+353)</Text>

            <TextInput
              style={styles.input}
              placeholder="Mobile number"
              placeholderTextColor="#9E9E9E"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <CustomButton
              title={loading ? 'Sending...' : 'Next'}
              onPress={handleSendCode}
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
    maxWidth: 320,
    marginBottom: 36,
  },
  countryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 18,
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
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 24,
  },
});