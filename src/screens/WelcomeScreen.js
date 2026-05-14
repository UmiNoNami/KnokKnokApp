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

export default function WelcomeScreen({ navigation }) {
  return (
    <AppScreen padded={false}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome</Text>

        <Text style={styles.subtitle}>
          Better shared living{'\n'}starts here
        </Text>

           <View style={styles.carouselDots}>
  <View style={[styles.dot, styles.activeDot]} />
  <View style={styles.dot} />
  <View style={styles.dot} />
  <View style={styles.dot} />
</View>

       <View style={styles.buttonContainer}>
  <CustomButton
    title="Create an account"
    onPress={() => navigation.navigate('SignInOptions')}
  />

  <CustomButton
    title="Sign In"
    onPress={() => {}}
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
    marginBottom: 56,
  },

  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#000',
    marginBottom: 20,
    fontFamily: 'IBM Plex Sans JP',
  },

  subtitle: {
    fontSize: 18,
    color: '#111',
    lineHeight: 31,
    letterSpacing: 0.6,
    textAlign: 'center',
    fontFamily: 'IBM Plex Sans JP',
  },

  carouselDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 28,
    marginBottom: 46,
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

  signInButton: {
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