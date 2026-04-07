import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import AppScreen from '../components/AppScreen';
import PrimaryButton from '../components/PrimaryButton';
import { APP_NAME, APP_TAGLINE, userModes } from '../config/appConfig';
import { isFirebaseConfigured } from '../config/firebase';
import { useAppState } from '../providers/AppProvider';
import { colors } from '../theme/colors';

export default function AuthScreen() {
  const { selectedMode, setSelectedMode, signIn } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>{APP_NAME}</Text>
          <Text style={styles.title}>Roommate matching, house discovery, and chat in one app</Text>
          <Text style={styles.subtitle}>{APP_TAGLINE}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Choose what the user is looking for</Text>
          {userModes.map((mode) => {
            const active = selectedMode === mode.id;

            return (
              <Pressable
                key={mode.id}
                onPress={() => setSelectedMode(mode.id)}
                style={[styles.modeCard, active && styles.modeCardActive]}
              >
                <Text style={[styles.modeTitle, active && styles.modeTitleActive]}>{mode.title}</Text>
                <Text style={[styles.modeDescription, active && styles.modeDescriptionActive]}>
                  {mode.description}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Starter sign in</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.mutedText}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.mutedText}
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <PrimaryButton label="Enter app" onPress={signIn} />
          <Text style={styles.helperText}>
            Firebase is {isFirebaseConfigured ? 'connected for configuration' : 'not configured yet'}.
            This starter lets you continue building the UI before real auth is wired in.
          </Text>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 18,
    paddingBottom: 32,
  },
  heroCard: {
    padding: 24,
    borderRadius: 26,
    backgroundColor: '#F7E3D2',
    borderWidth: 1,
    borderColor: colors.border,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.mutedText,
  },
  sectionCard: {
    padding: 18,
    gap: 12,
    borderRadius: 22,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  modeCard: {
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFDFC',
  },
  modeCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  modeTitleActive: {
    color: '#FFF8F1',
  },
  modeDescription: {
    color: colors.mutedText,
    lineHeight: 20,
  },
  modeDescriptionActive: {
    color: '#FFEBDD',
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.mutedText,
  },
});
