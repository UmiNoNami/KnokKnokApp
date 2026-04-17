import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppScreen from '../components/AppScreen';
import ScreenHeader from '../components/ScreenHeader';
import { useAppState } from '../providers/AppProvider';
import { colors } from '../theme/colors';

export default function ProfileScreen({ navigation }) {
  const { profileDraft, signOut } = useApp();

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Profile"
          title={profileDraft.name}
          subtitle="This is where users can update their housing preferences, budget, lifestyle, and move-in timing."
          onPressAction={() => navigation.navigate('Settings')}
        />

        <View style={styles.heroCard}>
          <Text style={styles.tagline}>{profileDraft.tagline}</Text>
          <View style={styles.statsRow}>
            <Stat label="Location" value={profileDraft.location} />
            <Stat label="Budget" value={profileDraft.budget} />
            <Stat label="Move-in" value={profileDraft.moveIn} />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <Pressable style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
              <Text style={styles.editLabel}>Edit profile</Text>
            </Pressable>
          </View>

          {profileDraft.preferences.map((item) => (
            <View key={item} style={styles.preferencePill}>
              <Text style={styles.preferenceText}>{item}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutLabel}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </AppScreen>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 28,
    gap: 16,
  },
  heroCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#FFF5EC',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagline: {
    fontSize: 19,
    lineHeight: 27,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 18,
  },
  statsRow: {
    gap: 12,
  },
  statTile: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedText,
    marginBottom: 4,
  },
  statValue: {
    fontWeight: '800',
    color: colors.text,
  },
  sectionCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  editLabel: {
    color: colors.primary,
    fontWeight: '800',
  },
  preferencePill: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: colors.border,
  },
  preferenceText: {
    color: colors.text,
    fontWeight: '600',
  },
  signOutButton: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: colors.dangerSoft,
  },
  signOutLabel: {
    color: colors.danger,
    fontWeight: '800',
  },
});
