import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';

export default function WelcomeScreen({ navigation }) {
  return (
    <AppScreen>
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

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Create an account"
            onPress={() => navigation.navigate('SignInOptions')}
          />

          <CustomButton
            title="Sign In"
            onPress={() => navigation.navigate('SignInOptions')}
            style={{ marginTop: 24 }}
          />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 160,
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#000',
    marginBottom: 22,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: '#111',
    lineHeight: 32,
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 58,
  },
});