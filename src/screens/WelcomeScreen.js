import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import AppScreen from '../components/AppScreen';

export default function WelcomeScreen({ navigation }) {
  return (
    <AppScreen>
      <View style={styles.container}>
        
        {/* LOGO */}
        <Image
          source={require('../../assets/logo.png')} // 
          style={styles.logo}
          resizeMode="contain"
        />

        {/* TITLE */}
        <Text style={styles.title}>Welcome</Text>

        {/* SUBTITLE */}
        <Text style={styles.subtitle}>
          Better shared living{'\n'}starts here
        </Text>
         
              {/* BUTTONS */}
<View style={styles.buttonContainer}>
  
  <Pressable
    style={styles.primaryButton}
    onPress={() => navigation.navigate('Auth')}
  >
    <Text style={styles.primaryButtonText}>
      Create an account
    </Text>
  </Pressable>

  <Pressable
    style={styles.secondaryButton}
    onPress={() => navigation.navigate('SignInOptions')} // ✅ CHANGE THIS
  >
    <Text style={styles.secondaryButtonText}>
      Sign In
    </Text>
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
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
  },

  subtitle: {
    fontSize: 18,
    lineHeight: 34,
    textAlign: 'center',
    color: '#222',
    marginBottom: 60,
  },

  buttonContainer: {
    width: '100%',
  },

  primaryButton: {
    backgroundColor: '#2D2D2D',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
  },

  secondaryButton: {
    backgroundColor: '#DEDCD8',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#111',
    fontSize: 17,
    fontWeight: '500',
  },
});