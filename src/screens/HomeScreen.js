import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppScreen from '../components/AppScreen';
import ScreenHeader from '../components/ScreenHeader';
import SwipeCard from '../components/SwipeCard';
import { swipeProfiles } from '../data/mockData';
import { useAppState } from '../providers/AppProvider';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedMode } = useAppState();
  const profile = useMemo(() => swipeProfiles[currentIndex % swipeProfiles.length], [currentIndex]);

  const cycleCard = () => {
    setCurrentIndex((value) => value + 1);
  };

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Knock Knock"
          title={selectedMode === 'property' ? 'Find a home that fits' : 'Find your next flatmate'}
          subtitle="Swipe through people and places that match your lifestyle, budget, and area."
          onPressAction={() => navigation.navigate('Settings')}
        />

        <SwipeCard profile={profile} />

        <View style={styles.actionRow}>
          <ActionButton label="Pass" tone="danger" onPress={cycleCard} />
          <ActionButton label="Message" tone="secondary" onPress={cycleCard} />
          <ActionButton label="Like" tone="success" onPress={cycleCard} />
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>How this home feed works</Text>
          <Text style={styles.tipBody}>
            Swipe-style cards help users decide fast. Tap pass if it is not a fit, message if you want to talk first,
            and like if the match looks strong.
          </Text>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function ActionButton({ label, tone, onPress }) {
  const toneStyles = {
    danger: [styles.actionButton, styles.dangerButton],
    secondary: [styles.actionButton, styles.secondaryButton],
    success: [styles.actionButton, styles.successButton],
  };

  const labelStyles = {
    danger: styles.dangerLabel,
    secondary: styles.secondaryLabel,
    success: styles.successLabel,
  };

  return (
    <Pressable style={toneStyles[tone]} onPress={onPress}>
      <Text style={[styles.actionLabel, labelStyles[tone]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 28,
    gap: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 18,
  },
  actionLabel: {
    fontWeight: '800',
  },
  dangerButton: {
    backgroundColor: colors.dangerSoft,
  },
  dangerLabel: {
    color: colors.danger,
  },
  secondaryButton: {
    backgroundColor: colors.secondarySoft,
  },
  secondaryLabel: {
    color: colors.secondary,
  },
  successButton: {
    backgroundColor: colors.successSoft,
  },
  successLabel: {
    color: colors.success,
  },
  tipCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFF6EA',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  tipBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.mutedText,
  },
});
