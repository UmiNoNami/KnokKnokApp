import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';

import CustomButton from '../components/CustomButton';

export default function WelcomeScreen({ navigation }) {
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

        <BlurView
  intensity={Platform.OS === 'android' ? 45 : 60}
  tint="light"
  experimentalBlurMethod="dimezisBlurView"
  style={StyleSheet.absoluteFill}
/>

{Platform.OS === 'android' && <View style={styles.androidSoftOverlay} />}
      </View>

      <View style={styles.content}>
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
            style={styles.buttonShadow}
          />

          <CustomButton
            title="Sign In"
            onPress={() => navigation.navigate('Auth')}
            style={[styles.buttonShadow, styles.signInButton]}
          />
        </View>
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

 androidSoftOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(253, 244, 212, 0.12)',
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
    opacity: Platform.OS === 'android' ? 1 : 0.65,
  },

  greyBlob: {
    backgroundColor: '#e8e7e3',
    right: -80,
    top: 80,
    opacity: Platform.OS === 'android' ? 1 : 0.95,
  },

  creamBlob: {
    backgroundColor: '#FDF4D4',
    left: -70,
    top: -70,
    opacity: Platform.OS === 'android' ? 0.9 : 0.95,
  },

  whiteBlob: {
    backgroundColor: '#FDF4D4',
    right: -90,
    bottom: 40,
    opacity: Platform.OS === 'android' ? 0.9 : 0.55,
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

  signInButton: {
    marginTop: 22,
  },
});