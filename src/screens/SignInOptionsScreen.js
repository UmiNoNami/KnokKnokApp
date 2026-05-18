import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';

import CustomButton from '../components/CustomButton';

export default function SignInOptionsScreen({ navigation }) {
  const circleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(circleAnim, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const circularMove = (x1, x2, y1, y2) => ({
    transform: [
      {
        translateX: circleAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [x1, x2, x1],
        }),
      },
      {
        translateY: circleAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [y1, y2, y1],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <View style={styles.backgroundLayer}>
        <Animated.View
          style={[
            styles.colorBlob,
            styles.yellowBlob,
            circularMove(-200, 200, 120, -120),
          ]}
        />

        <Animated.View
          style={[
            styles.colorBlob,
            styles.greyBlob,
            circularMove(200, -200, -120, 120),
          ]}
        />

        <Animated.View
          style={[
            styles.colorBlob,
            styles.creamBlob,
            circularMove(-300, 300, -120, 120),
          ]}
        />

        <Animated.View
          style={[
            styles.colorBlob,
            styles.whiteBlob,
            circularMove(60, -60, 60, -60),
          ]}
        />

        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      </View>

      <View style={styles.content}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>
          Choose how you want{'\n'}to continue
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
            style={styles.buttonShadow}
            icon={require('../../assets/icons/phone.png')}
          />

          <CustomButton
            title="Continue with email address"
            onPress={() => navigation.navigate('Auth')}
            style={[styles.buttonShadow, styles.secondButton]}
            icon={require('../../assets/icons/email.png')}
          />
        </View>

        <Text style={styles.description}>
          By continuing, you agree to our Terms. Learn how we process your data
          in our Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF4D4',
    overflow: 'hidden',
  },

  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FDF4D4',
  },

  colorBlob: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
  },

  yellowBlob: {
    backgroundColor: '#F4B400',
    left: -80,
    bottom: -40,
    opacity: 0.65,
  },

  greyBlob: {
    backgroundColor: '#E8E7E3',
    right: -80,
    top: 80,
    opacity: 0.95,
  },

  creamBlob: {
    backgroundColor: '#FDF4D4',
    left: -70,
    top: -70,
    opacity: 0.95,
  },

  whiteBlob: {
    backgroundColor: '#FFFFFF',
    right: -90,
    bottom: 40,
    opacity: 0.55,
  },

  content: {
    flex: 1,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 142,
    height: 162,
    marginBottom: 34,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#000',
    marginBottom: 28,
    fontFamily: 'IBM Plex Sans JP',
    textShadowColor: 'rgba(0,0,0,0.22)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },

  subtitle: {
    fontSize: 18,
    color: '#111',
    lineHeight: 25,
    letterSpacing: 0.6,
    textAlign: 'center',
    fontFamily: 'IBM Plex Sans JP',
  },

  carouselDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 26,
    marginBottom: 28,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 8,
    backgroundColor: 'rgba(43,43,43,0.18)',
  },

  activeDot: {
    width: 22,
    backgroundColor: '#2B2B2B',
  },

  buttonContainer: {
    width: '100%',
  },

  buttonShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  secondButton: {
    marginTop: 22,
  },

  description: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 26,
    fontFamily: 'IBM Plex Sans JP',
  },
});