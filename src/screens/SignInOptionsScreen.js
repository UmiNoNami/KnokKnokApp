import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';

export default function SignInOptionsScreen({ navigation }) {
  return (
    <AppScreen>
      <View style={styles.container}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome</Text>

        <Text style={styles.description}>
          by Taping to create account or Sign In, you agree to our Terms,
          Learn how we process your data in out Privacy Policy
        </Text>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Sign in with Google"
            onPress={() => {}}
          />

            <CustomButton
               title="Sign in with Phone"
                onPress={() => navigation.navigate('PhoneNumber')}
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
    marginBottom: 56,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#000',
    marginBottom: 28,
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 15,
    color: '#222',
    textAlign: 'left',
    lineHeight: 31,
    letterSpacing: 0.8,
    width: '100%',
    marginBottom: 42,
  },
  buttonContainer: {
    width: '100%',
  },
});