import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppScreen from '../components/AppScreen';
import ScreenHeader from '../components/ScreenHeader';
import { colors } from '../theme/colors';

const settings = [
  { id: 'notifications', label: 'Notification preferences', value: 'Instant match alerts' },
  { id: 'distance', label: 'Search distance', value: 'Within 8 km' },
  { id: 'budget', label: 'Budget filter', value: 'Up to EUR1,100 each' },
  { id: 'safety', label: 'Verification and safety', value: 'ID check suggested' },
];

export default function SettingsScreen({ navigation }) {
  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Settings"
          title="Tune your matching rules"
          subtitle="Users can adjust search, safety, and communication settings from here."
          actionLabel="Back"
          onPressAction={() => navigation.goBack()}
        />

        {settings.map((item) => (
          <View key={item.id} style={styles.settingCard}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingValue}>{item.value}</Text>
          </View>
        ))}

        <Pressable style={styles.saveButton} onPress={() => navigation.goBack()}>
          <Text style={styles.saveLabel}>Save changes</Text>
        </Pressable>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 28,
    gap: 14,
  },
  settingCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFF8F2',
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  settingValue: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.mutedText,
  },
  saveButton: {
    marginTop: 8,
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  saveLabel: {
    color: '#FFF8F1',
    fontWeight: '800',
  },
});
