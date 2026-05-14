import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const bgAnim = useRef(new Animated.Value(0)).current;
  const yellowHouseOpacity = useRef(new Animated.Value(1)).current;
  const blackHouseOpacity = useRef(new Animated.Value(0)).current;

  const logoScale = useRef(new Animated.Value(1.65)).current;
  const logoMoveX = useRef(new Animated.Value(0)).current;

  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordMoveX = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(700),

      Animated.parallel([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 650,
          useNativeDriver: false,
        }),
        Animated.timing(yellowHouseOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(blackHouseOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.82,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(logoMoveX, {
          toValue: -78,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(120),

      Animated.parallel([
        Animated.timing(wordOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(wordMoveX, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(800),
    ]).start(() => {
      navigation.replace('Welcome');
    });
  }, []);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#FFFFFF'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.stage}>
        <Animated.View
          style={[
            styles.houseWrap,
            {
              transform: [
                { translateX: logoMoveX },
                { scale: logoScale },
              ],
            },
          ]}
        >
          <Animated.Image
            source={require('../../assets/splash/house_yellow.png')}
            style={[styles.houseLogo, { opacity: yellowHouseOpacity }]}
            resizeMode="contain"
          />

          <Animated.Image
            source={require('../../assets/splash/house_black.png')}
            style={[
              styles.houseLogo,
              styles.absoluteLogo,
              { opacity: blackHouseOpacity },
            ]}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Image
          source={require('../../assets/splash/knokknok_black.png')}
          style={[
            styles.wordmark,
            {
              opacity: wordOpacity,
              transform: [{ translateX: wordMoveX }],
            },
          ]}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stage: {
    width,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },

  houseWrap: {
    position: 'absolute',
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  houseLogo: {
    width: 86,
    height: 86,
  },

  absoluteLogo: {
    position: 'absolute',
  },

  wordmark: {
    position: 'absolute',
    width: 210,
    height: 82,
    left: width / 2 - 58,
    zIndex: 1,
  },
});