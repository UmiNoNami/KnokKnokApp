import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppScreen from '../components/AppScreen';
import ScreenHeader from '../components/ScreenHeader';
import { peopleMatches, properties } from '../data/mockData';
import { useAppState } from '../providers/AppProvider';
import { colors } from '../theme/colors';

export default function DiscoverScreen({ navigation }) {
  const { selectedMode } = useApp();
  const [mode, setMode] = useState(selectedMode === 'property' ? 'houses' : 'people');

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Discover"
          title="Search by house or by person"
          subtitle="Use area, price, and compatibility to switch between available homes and potential roommates."
          onPressAction={() => navigation.navigate('Settings')}
        />

        <View style={styles.toggleRow}>
          <ToggleButton label="Houses" active={mode === 'houses'} onPress={() => setMode('houses')} />
          <ToggleButton label="People" active={mode === 'people'} onPress={() => setMode('people')} />
        </View>

        {mode === 'houses' ? (
          <>
            <View style={styles.mapCard}>
              <Text style={styles.mapTitle}>Desired area map</Text>
              <Text style={styles.mapBody}>
                Later, this can connect to a real map. For now it highlights that users can browse homes by location
                and compare prices visually.
              </Text>
              <View style={styles.mapPins}>
                <MapPin area="Phibsborough" price="EUR2,700" left="16%" top="54%" />
                <MapPin area="Smithfield" price="EUR2,400" left="48%" top="40%" />
                <MapPin area="Docklands" price="EUR2,950" left="68%" top="62%" />
              </View>
            </View>

            {properties.map((property) => (
              <View key={property.id} style={styles.resultCard}>
                <Text style={styles.resultTitle}>{property.title}</Text>
                <Text style={styles.resultMeta}>
                  {property.area} • {property.price}
                </Text>
                <Text style={styles.resultBody}>{property.note}</Text>
              </View>
            ))}
          </>
        ) : (
          peopleMatches.map((person) => (
            <View key={person.id} style={styles.resultCard}>
              <View style={styles.personRow}>
                <Text style={styles.resultTitle}>{person.name}</Text>
                <View style={styles.compatibilityPill}>
                  <Text style={styles.compatibilityText}>{person.compatibility}</Text>
                </View>
              </View>
              <Text style={styles.resultBody}>{person.summary}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </AppScreen>
  );
}

function ToggleButton({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.toggleButton, active && styles.toggleButtonActive]}>
      <Text style={[styles.toggleLabel, active && styles.toggleLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function MapPin({ area, price, left, top }) {
  return (
    <View style={[styles.mapPin, { left, top }]}>
      <Text style={styles.mapPinPrice}>{price}</Text>
      <Text style={styles.mapPinArea}>{area}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 28,
    gap: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: '#FFF5E9',
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleLabel: {
    fontWeight: '800',
    color: colors.primary,
  },
  toggleLabelActive: {
    color: '#FFF8F1',
  },
  mapCard: {
    minHeight: 260,
    backgroundColor: colors.map,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#C9DED8',
    overflow: 'hidden',
  },
  mapTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  mapBody: {
    maxWidth: '72%',
    fontSize: 14,
    lineHeight: 20,
    color: colors.mutedText,
  },
  mapPins: {
    flex: 1,
  },
  mapPin: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapPinPrice: {
    fontWeight: '800',
    color: colors.primary,
  },
  mapPinArea: {
    fontSize: 12,
    color: colors.mutedText,
  },
  resultCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  resultMeta: {
    marginTop: 5,
    marginBottom: 8,
    color: colors.primary,
    fontWeight: '700',
  },
  resultBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.mutedText,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  compatibilityPill: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.successSoft,
  },
  compatibilityText: {
    color: colors.success,
    fontWeight: '800',
  },
});
