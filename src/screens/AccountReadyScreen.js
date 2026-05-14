import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AccountReadyScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const keyholeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),

     Animated.delay(850),

Animated.parallel([
  Animated.sequence([
    Animated.delay(180),
    Animated.timing(textOpacity, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }),
  ]),

  Animated.timing(keyholeScale, {
    toValue: 26,
    duration: 900,
    useNativeDriver: true,
  }),
]),
    ]).start(() => {
      navigation.replace('Main');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Animated.Image
  source={require('../../assets/icons/house.png')}
  style={[
    styles.logo,
    {
      transform: [{ scale: keyholeScale }],
    },
  ]}
  resizeMode="contain"
/>

        <Animated.View style={{ opacity: textOpacity }}>
          <Text style={styles.title}>You’re all set</Text>
          <Text style={styles.subtitle}>
            Your KnokKnok space is ready
          </Text>
        </Animated.View>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  content: {
    alignItems: 'center',
  },

  logo: {
    width: 150,
    height: 170,
    marginBottom: 34,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'IBM Plex Sans JP',
  },

  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'IBM Plex Sans JP',
  },

  zoomLogo: {
  position: 'absolute',
  width: 180,
  height: 180,
  opacity: 1,
},
});