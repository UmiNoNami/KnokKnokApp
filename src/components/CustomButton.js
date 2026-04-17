import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress, style, textStyle }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.button,
        hovered && styles.buttonHover,
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      {({ pressed, hovered }) => (
        <Text
          style={[
            styles.buttonText,
            (pressed || hovered) && styles.buttonTextActive,
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
    height: 64,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#1A1A1A',
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonHover: {
    backgroundColor: '#B8B8B8',
  },
  buttonPressed: {
    backgroundColor: '#8E8E8E',
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
});