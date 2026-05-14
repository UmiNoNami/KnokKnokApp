import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function CustomButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.button,
        (pressed || hovered) && !disabled && styles.buttonActive,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {({ pressed, hovered }) => (
        <Text
          style={[
            styles.buttonText,
            (pressed || hovered) && !disabled && styles.buttonTextActive,
            disabled && styles.buttonTextDisabled,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.28)',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonActive: {
    backgroundColor: '#2B2B2B',
    borderColor: '#2B2B2B',
    transform: [{ scale: 0.985 }],
  },

  buttonDisabled: {
    opacity: 1,
  },

  buttonText: {
    fontSize: 15,
    color: '#111',
    fontWeight: '700',
    fontFamily: 'IBM Plex Sans JP',
  },

  buttonTextActive: {
    color: '#FFFFFF',
  },

  buttonTextDisabled: {
    color: '#111',
  },
});