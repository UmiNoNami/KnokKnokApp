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
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';
import { auth } from '../firebase/firebaseConfig';
import { useAppState } from '../providers/AppProvider';

export default function AuthScreen({ navigation }) {
  const { signIn } = useAppState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      Alert.alert('Missing details', 'Please enter email and password.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      signIn();
    } catch (signInError) {
      try {
        await createUserWithEmailAndPassword(auth, cleanEmail, password);
        signIn();
      } catch (createError) {
        console.log('Auth error:', createError);
        Alert.alert('Login failed', createError.message);
      }
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
            <Text style={styles.title}>Welcome back</Text>

            <Text style={styles.description}>
              Sign in or create your account with your email.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9E9E9E"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9E9E9E"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <CustomButton title="Continue" onPress={handleAuth} />
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
    marginBottom: 42,
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
    marginBottom: 16,
  },

  buttonWrapper: {
    width: '100%',
    marginBottom: 24,
  },
});