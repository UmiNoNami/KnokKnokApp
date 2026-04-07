import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import AppScreen from '../components/AppScreen';

export default function SignInOptionsScreen({ navigation }) {
  return (
    <AppScreen>
      <View style={styles.container}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => {
              // later: add Google sign in
            }}
          >
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => {
              // later: navigate to phone sign in screen
            }}
          >
            <Text style={styles.buttonText}>Sign In with Phone number</Text>
          </Pressable>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 140,
  },
  buttonContainer: {
    width: '100%',
    gap: 26,
  },
  button: {
    backgroundColor: '#EEE4C5',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#111111',
    letterSpacing: 0.3,
  },
});