import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const bgAnim = useRef(new Animated.Value(0)).current;

  const yellowHouseOpacity = useRef(new Animated.Value(1)).current;
  const blackHouseOpacity = useRef(new Animated.Value(0)).current;

  const houseMoveY = useRef(new Animated.Value(160)).current;
  const houseMoveX = useRef(new Animated.Value(0)).current;
  const houseScale = useRef(new Animated.Value(0.75)).current;
  const houseRotate = useRef(new Animated.Value(0)).current;

  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordMoveX = useRef(new Animated.Value(26)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(houseMoveY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(houseRotate, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(houseScale, {
          toValue: 1.65,
          duration: 700,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),

      Animated.sequence([
        Animated.timing(houseScale, {
          toValue: 1.82,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(houseScale, {
          toValue: 1.65,
          duration: 220,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(180),

      Animated.parallel([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(yellowHouseOpacity, {
          toValue: 0,
          duration: 360,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(blackHouseOpacity, {
          toValue: 1,
          duration: 360,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(houseScale, {
          toValue: 0.82,
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(120),

      Animated.parallel([
        Animated.timing(houseMoveX, {
          toValue: -78,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(wordOpacity, {
          toValue: 1,
          duration: 520,
          delay: 160,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wordMoveX, {
          toValue: 0,
          duration: 620,
          delay: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(900),
    ]).start(() => {
      navigation.replace('Welcome');
    });
  }, []);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2B2B2B', '#FFFFFF'],
  });

  const rotate = houseRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-18deg', '0deg'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <View style={styles.stage}>
        <Animated.View
          style={[
            styles.houseWrap,
            {
              transform: [
                { translateX: houseMoveX },
                { translateY: houseMoveY },
                { rotate },
                { scale: houseScale },
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
    width: 102,
    height: 102,
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