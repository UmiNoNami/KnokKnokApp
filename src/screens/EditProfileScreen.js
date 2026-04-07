import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import AppScreen from '../components/AppScreen';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { useAppState } from '../providers/AppProvider';
import { colors } from '../theme/colors';

export default function EditProfileScreen({ navigation }) {
  const { profileDraft, updateProfile } = useAppState();
  const [tagline, setTagline] = useState(profileDraft.tagline);
  const [location, setLocation] = useState(profileDraft.location);
  const [budget, setBudget] = useState(profileDraft.budget);
  const [moveIn, setMoveIn] = useState(profileDraft.moveIn);

  const saveProfile = () => {
    updateProfile({ tagline, location, budget, moveIn });
    navigation.goBack();
  };

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Edit"
          title="Update your profile"
          subtitle="Keep the basics current so matches and house suggestions stay useful."
          actionLabel="Back"
          onPressAction={() => navigation.goBack()}
        />

        <View style={styles.formCard}>
          <Field label="Tagline" value={tagline} onChangeText={setTagline} multiline />
          <Field label="Location" value={location} onChangeText={setLocation} />
          <Field label="Budget" value={budget} onChangeText={setBudget} />
          <Field label="Move-in" value={moveIn} onChangeText={setMoveIn} />
          <PrimaryButton label="Save profile" onPress={saveProfile} />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function Field({ label, value, onChangeText, multiline = false }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        style={[styles.input, multiline && styles.textarea]}
        placeholderTextColor={colors.mutedText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 18,
    paddingBottom: 32,
  },
  formCard: {
    padding: 18,
    gap: 14,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldWrap: {
    gap: 8,
  },
  fieldLabel: {
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#FFFDFC',
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  textarea: {
    minHeight: 104,
    textAlignVertical: 'top',
  },
});
