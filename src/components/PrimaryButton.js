import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';

export default function PrimaryButton({ label, onPress, tone = 'primary' }) {
  const containerStyles = {
    primary: [styles.button, styles.primaryButton],
    secondary: [styles.button, styles.secondaryButton],
    soft: [styles.button, styles.softButton],
  };

  const labelStyles = {
    primary: [styles.label, styles.primaryLabel],
    secondary: [styles.label, styles.secondaryLabel],
    soft: [styles.label, styles.softLabel],
  };

  return (
    <Pressable onPress={onPress} style={containerStyles[tone]}>
      <Text style={labelStyles[tone]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 18,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondarySoft,
  },
  softButton: {
    backgroundColor: colors.primarySoft,
  },
  label: {
    fontWeight: '800',
    fontSize: 15,
  },
  primaryLabel: {
    color: '#FFF8F1',
  },
  secondaryLabel: {
    color: colors.secondary,
  },
  softLabel: {
    color: colors.primary,
  },
});
