import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';

export default function SignInOptionsScreen({ navigation }) {
  return (
    <AppScreen padded={false}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome</Text>

        <Text style={styles.description}>
          By continuing, you agree to our Terms. Learn how we process your data
          in our Privacy Policy.
        </Text>

        <View style={styles.carouselDots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.buttonContainer}>
  <CustomButton
    title="Continue with phone number"
    onPress={() => navigation.navigate('PhoneNumber')}
  />

  <CustomButton
    title="Continue with email address"
    onPress={() => navigation.navigate('Auth')}
    style={{ marginTop: 18 }}
  />
</View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 142,
    height: 162,
    marginBottom: 54,
  },

  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#000',
    marginBottom: 24,
    fontFamily: 'IBM Plex Sans JP',
  },

  description: {
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 0.5,
    width: '100%',
    fontFamily: 'IBM Plex Sans JP',
  },

  carouselDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 30,
    marginBottom: 44,
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

  buttonContainer: {
    width: '100%',
  },

  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondButton: {
    marginTop: 18,
  },

  buttonPressed: {
    backgroundColor: '#2B2B2B',
    borderColor: '#2B2B2B',
  },

  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    fontFamily: 'IBM Plex Sans JP',
  },

  buttonTextPressed: {
    color: '#FFFFFF',
  },
});