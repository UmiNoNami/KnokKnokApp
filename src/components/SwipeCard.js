import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export default function SwipeCard({ profile }) {
  return (
    <View style={styles.card}>
      <View style={styles.hero}>
        <View style={styles.matchPill}>
          <Text style={styles.matchText}>{profile.match} match</Text>
        </View>
        <View style={styles.heroSpacer} />
        <Text style={styles.heroName}>
          {profile.name}, {profile.age}
        </Text>
        <Text style={styles.heroRole}>{profile.role}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <InfoTile label="Area" value={profile.area} />
          <InfoTile label="Budget" value={profile.budget} />
        </View>
        <Text style={styles.bio}>{profile.bio}</Text>
        <View style={styles.highlightRow}>
          {profile.highlights.map((item) => (
            <View key={item} style={styles.highlightPill}>
              <Text style={styles.highlightText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function InfoTile({ label, value }) {
  return (
    <View style={styles.infoTile}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hero: {
    minHeight: 280,
    padding: 22,
    justifyContent: 'space-between',
    backgroundColor: '#C88A5A',
  },
  matchPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 248, 241, 0.9)',
  },
  matchText: {
    fontWeight: '700',
    color: colors.primary,
  },
  heroSpacer: {
    flex: 1,
  },
  heroName: {
    color: '#FFF8F1',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroRole: {
    color: '#FFF0E5',
    fontSize: 15,
  },
  body: {
    padding: 20,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  infoTile: {
    flex: 1,
    backgroundColor: '#FFFDFC',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.mutedText,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  highlightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  highlightPill: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.secondarySoft,
  },
  highlightText: {
    color: colors.secondary,
    fontWeight: '700',
  },
});
