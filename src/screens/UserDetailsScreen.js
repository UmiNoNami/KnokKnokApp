import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';
import { useAppState } from '../providers/AppProvider';
import DropDownPicker from 'react-native-dropdown-picker';
import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';

export default function UserDetailsScreen({ navigation }) {
  const { updateProfile, profileDraft } = useAppState();
  const [name, setName] = useState(profileDraft.name || '');
  const [job, setJob] = useState(profileDraft.job || '');

  const [dayOpen, setDayOpen] = useState(false);
  const [dayValue, setDayValue] = useState(null);

  const [monthOpen, setMonthOpen] = useState(false);
  const [monthValue, setMonthValue] = useState(null);

  const [yearOpen, setYearOpen] = useState(false);
  const [yearValue, setYearValue] = useState(null);

  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);

  const dayItems = useMemo(
    () =>
      Array.from({ length: 31 }, (_, i) => ({
        label: String(i + 1),
        value: String(i + 1),
      })),
    []
  );

  const monthItems = useMemo(
    () => [
      { label: 'Jan', value: 'Jan' },
      { label: 'Feb', value: 'Feb' },
      { label: 'Mar', value: 'Mar' },
      { label: 'Apr', value: 'Apr' },
      { label: 'May', value: 'May' },
      { label: 'Jun', value: 'Jun' },
      { label: 'Jul', value: 'Jul' },
      { label: 'Aug', value: 'Aug' },
      { label: 'Sep', value: 'Sep' },
      { label: 'Oct', value: 'Oct' },
      { label: 'Nov', value: 'Nov' },
      { label: 'Dec', value: 'Dec' },
    ],
    []
  );

  const yearItems = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 80 }, (_, i) => ({
      label: String(currentYear - i),
      value: String(currentYear - i),
    }));
  }, []);

  const genderItems = useMemo(
    () => [
      { label: 'Female', value: 'Female' },
      { label: 'Male', value: 'Male' },
      { label: 'Non-binary', value: 'Non-binary' },
      { label: 'Prefer not to say', value: 'Prefer not to say' },
    ],
    []
  );

  const closeAllDropdowns = () => {
    setDayOpen(false);
    setMonthOpen(false);
    setYearOpen(false);
    setGenderOpen(false);
    Keyboard.dismiss();
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={closeAllDropdowns}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={styles.topSection}>
                <Text style={styles.title}>Let’s get you started</Text>
                <Text style={styles.subtitle}>
                  Fill in your details to create your account.
                </Text>

                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Write your name"
                  placeholderTextColor="#A8A29E"
                  value={name}
                  onChangeText={setName}
                />
                <Text style={styles.label}>What do you do?</Text>
                <TextInput
                 style={styles.input}
                  placeholder="Example: Waitress, Student, Designer"
                  placeholderTextColor="#A8A29E"
                   value={job}
                    onChangeText={setJob}
                      />

                <Text style={styles.label}>Date of Birth</Text>
                <View style={styles.dateRow}>
                  <View style={[styles.dropdownSmallWrap, { zIndex: 3000 }]}>
                    <DropDownPicker
                      open={dayOpen}
                      value={dayValue}
                      items={dayItems}
                      setOpen={(open) => {
                        setMonthOpen(false);
                        setYearOpen(false);
                        setGenderOpen(false);
                        setDayOpen(open);
                      }}
                      setValue={setDayValue}
                      placeholder="Day"
                      listMode="SCROLLVIEW"
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                      textStyle={styles.dropdownText}
                      placeholderStyle={styles.placeholderText}
                    />
                  </View>

                  <View style={[styles.dropdownSmallWrap, { zIndex: 2000 }]}>
                    <DropDownPicker
                      open={monthOpen}
                      value={monthValue}
                      items={monthItems}
                      setOpen={(open) => {
                        setDayOpen(false);
                        setYearOpen(false);
                        setGenderOpen(false);
                        setMonthOpen(open);
                      }}
                      setValue={setMonthValue}
                      placeholder="Month"
                      listMode="SCROLLVIEW"
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                      textStyle={styles.dropdownText}
                      placeholderStyle={styles.placeholderText}
                    />
                  </View>

                  <View style={[styles.dropdownSmallWrap, { zIndex: 1000 }]}>
                    <DropDownPicker
                      open={yearOpen}
                      value={yearValue}
                      items={yearItems}
                      setOpen={(open) => {
                        setDayOpen(false);
                        setMonthOpen(false);
                        setGenderOpen(false);
                        setYearOpen(open);
                      }}
                      setValue={setYearValue}
                      placeholder="Year"
                      listMode="SCROLLVIEW"
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                      textStyle={styles.dropdownText}
                      placeholderStyle={styles.placeholderText}
                    />
                  </View>
                </View>

                <Text style={styles.label}>Gender</Text>
                <View style={[styles.dropdownGenderWrap, { zIndex: 500 }]}>
                  <DropDownPicker
                    open={genderOpen}
                    value={genderValue}
                    items={genderItems}
                    setOpen={(open) => {
                      setDayOpen(false);
                      setMonthOpen(false);
                      setYearOpen(false);
                      setGenderOpen(open);
                    }}
                    setValue={setGenderValue}
                    placeholder="Select"
                    listMode="SCROLLVIEW"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    textStyle={styles.dropdownText}
                    placeholderStyle={styles.placeholderText}
                  />
                </View>
              </View>

              <View style={styles.buttonWrapper}>
       <CustomButton
  title="Next"
  onPress={() => {
    updateProfile({
  name,
  job,
  gender: genderValue,
  dateOfBirth: `${dayValue || ''}-${monthValue || ''}-${yearValue || ''}`,
});

    navigation.navigate('LookingFor');
  }}
/>
</View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 32,
    paddingTop: 70,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2A2A2A',
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 16,
    color: '#2F2F2F',
    lineHeight: 24,
    marginBottom: 48,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 14,
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8D3CB',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
    marginBottom: 28,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  dropdownSmallWrap: {
    width: '32.5%',
  },
  dropdownGenderWrap: {
    width: '55%',
  },
  dropdown: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8D3CB',
    backgroundColor: '#F4F4F4',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#D8D3CB',
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#111',
  },
  placeholderText: {
    color: '#555',
    fontSize: 14.5,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 40,
    marginBottom: 24,
  },
});