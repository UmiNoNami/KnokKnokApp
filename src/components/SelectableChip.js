import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function SelectableChip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.chip,
        selected && styles.chipSelected,
        hovered && !selected && styles.chipHover,
        pressed && styles.chipPressed,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          selected && styles.chipTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 34,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D8D3CB',
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 10,
  },
  chipSelected: {
    backgroundColor: '#F4A261',
    borderColor: '#F4A261',
  },
  chipHover: {
    backgroundColor: '#ECE7E0',
  },
  chipPressed: {
    transform: [{ scale: 0.97 }],
  },
  chipText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});