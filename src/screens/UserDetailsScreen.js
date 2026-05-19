import React, { useEffect, useMemo, useRef, useState } from 'react';
import { saveProfileToFirebase } from '../services/profileService';
import {
  Alert,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { auth } from '../firebase/firebaseConfig';
import { useAppState } from '../providers/AppProvider';
import CustomButton from '../components/CustomButton';
export default function UserDetailsScreen({ navigation }) {
  const { updateProfile, profileDraft } = useAppState();

  const [name, setName] = useState(profileDraft.name || '');
  const [job, setJob] = useState(profileDraft.job || '');
  const [dayValue, setDayValue] = useState(null);
  const [monthValue, setMonthValue] = useState(null);
  const [yearValue, setYearValue] = useState(null);
  const [genderValue, setGenderValue] = useState(null);
  const [pickerType, setPickerType] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const circleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(circleAnim, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const circularMove = (x1, x2, y1, y2) => ({
    transform: [
      {
        translateX: circleAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [x1, x2, x1],
        }),
      },
      {
        translateY: circleAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [y1, y2, y1],
        }),
      },
    ],
  });

  const dayItems = useMemo(
    () => Array.from({ length: 31 }, (_, i) => String(i + 1)),
    []
  );

  const monthItems = useMemo(
    () => [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    []
  );

  const yearItems = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 80 }, (_, i) => String(currentYear - i));
  }, []);

  const genderItems = useMemo(
    () => ['Female', 'Male', 'Non-binary', 'Prefer not to say'],
    []
  );

  const getPickerData = () => {
    if (pickerType === 'day') return dayItems;
    if (pickerType === 'month') return monthItems;
    if (pickerType === 'year') return yearItems;
    if (pickerType === 'gender') return genderItems;
    return [];
  };

  const getPickerTitle = () => {
    if (pickerType === 'day') return 'Choose day';
    if (pickerType === 'month') return 'Choose month';
    if (pickerType === 'year') return 'Choose year';
    if (pickerType === 'gender') return 'Choose gender';
    return '';
  };

  const setPickerValue = (value) => {
    if (pickerType === 'day') setDayValue(value);
    if (pickerType === 'month') setMonthValue(value);
    if (pickerType === 'year') setYearValue(value);
    if (pickerType === 'gender') setGenderValue(value);

    setPickerType(null);
  };

  const getSelectedValue = () => {
    if (pickerType === 'day') return dayValue;
    if (pickerType === 'month') return monthValue;
    if (pickerType === 'year') return yearValue;
    if (pickerType === 'gender') return genderValue;
    return null;
  };

const handleNext = async () => {
  if (!name.trim()) {
    Alert.alert('Missing name', 'Please enter your name.');
    return;
  }

  const dateOfBirth = `${dayValue || ''}-${monthValue || ''}-${yearValue || ''}`;

  const profileData = {
    name: name || '',
    job: job || '',
    gender: genderValue || '',
    dateOfBirth: dateOfBirth || '',
  };

  updateProfile(profileData);

  console.log('CURRENT USER:', auth.currentUser?.uid);

  try {
    await saveProfileToFirebase(profileData);
  } catch (error) {
    console.log('User details save skipped:', error.message);
  }

  navigation.navigate('LookingFor');
};

  const PickerField = ({ value, placeholder, onPress, style }) => (
    <Pressable
      style={({ pressed }) => [
        styles.pickerField,
        pressed && styles.fieldPressed,
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[styles.pickerText, !value && styles.placeholderText]}
        numberOfLines={1}
      >
        {value || placeholder}
      </Text>

      <Text style={styles.chevron}>⌄</Text>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.backgroundLayer}>
        <Animated.View
          style={[
            styles.colorBlob,
            styles.yellowBlob,
            circularMove(-120, 120, 80, -80),
          ]}
        />

        <Animated.View
          style={[
            styles.colorBlob,
            styles.greyBlob,
            circularMove(80, -80, -60, 60),
          ]}
        />

        <Animated.View
          style={[
            styles.colorBlob,
            styles.creamBlob,
            circularMove(-90, 90, -70, 70),
          ]}
        />

        <BlurView
          intensity={Platform.OS === 'android' ? 45 : 60}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />

        {Platform.OS === 'android' && (
          <View style={styles.androidSoftOverlay} />
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.topContent}>
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
                  <PickerField
                    value={dayValue}
                    placeholder="Day"
                    onPress={() => setPickerType('day')}
                    style={styles.dateField}
                  />

                  <PickerField
                    value={monthValue}
                    placeholder="Month"
                    onPress={() => setPickerType('month')}
                    style={styles.dateField}
                  />

                  <PickerField
                    value={yearValue}
                    placeholder="Year"
                    onPress={() => setPickerType('year')}
                    style={styles.dateField}
                  />
                </View>

                <Text style={styles.label}>Gender</Text>

                <PickerField
                  value={genderValue}
                  placeholder="Select"
                  onPress={() => setPickerType('gender')}
                  style={styles.genderField}
                />
              </View>
            </ScrollView>

            {!keyboardVisible && (
              <View style={styles.bottomContent}>
                <View style={styles.carouselDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={[styles.dot, styles.activeDot]} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>

                <CustomButton
                  title="Next"
                  onPress={handleNext}
                  style={styles.buttonShadow}
                />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        <Modal
          transparent
          visible={Boolean(pickerType)}
          animationType="fade"
          onRequestClose={() => setPickerType(null)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setPickerType(null)}
          >
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>{getPickerTitle()}</Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.sheetList}
              >
                {getPickerData().map((item) => {
                  const selected = getSelectedValue() === item;

                  return (
                    <Pressable
                      key={item}
                      style={[
                        styles.sheetOption,
                        selected && styles.selectedOption,
                      ]}
                      onPress={() => setPickerValue(item)}
                    >
                      <Text
                        style={[
                          styles.sheetOptionText,
                          selected && styles.selectedOptionText,
                        ]}
                      >
                        {item}
                      </Text>

                      {selected && (
                        <Text style={styles.selectedCheck}>✓</Text>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FDF4D4',
    overflow: 'hidden',
  },

  androidSoftOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(253, 244, 212, 0.35)',
  },

  flex: {
    flex: 1,
  },

  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FDF4D4',
  },

  colorBlob: {
    position: 'absolute',
    width: 560,
    height: 560,
    borderRadius: 280,
  },

  yellowBlob: {
    backgroundColor: '#F4B400',
    left: -170,
    bottom: -180,
    opacity: Platform.OS === 'android' ? 0.9 : 0.62,
  },

  greyBlob: {
    backgroundColor: '#E8E7E3',
    right: -180,
    top: -80,
    opacity: 0.9,
  },

  creamBlob: {
    backgroundColor: '#FDF4D4',
    left: -120,
    top: -120,
    opacity: Platform.OS === 'android' ? 0.9 : 0.95,
  },

  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 70,
    paddingBottom: 40,
  },

  scrollContent: {
    paddingBottom: 130,
  },

  topContent: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2A2A2A',
    marginBottom: 14,
    fontFamily: 'IBM Plex Sans JP',
  },

  subtitle: {
    fontSize: 16,
    color: '#2F2F2F',
    lineHeight: 26,
    marginBottom: 36,
    fontFamily: 'IBM Plex Sans JP',
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 12,
    fontFamily: 'IBM Plex Sans JP',
  },

  input: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.28)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
    marginBottom: 24,
    fontFamily: 'IBM Plex Sans JP',
  },

  dateRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  dateField: {
    flex: 1,
  },

  genderField: {
    width: '100%',
  },

  pickerField: {
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.28)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  fieldPressed: {
    backgroundColor: '#F6F6F6',
  },

  pickerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    fontFamily: 'IBM Plex Sans JP',
  },

  placeholderText: {
    color: '#777',
    fontWeight: '500',
  },

  chevron: {
    fontSize: 18,
    color: '#555',
    marginLeft: 6,
    marginTop: -10,
  },

  bottomContent: {
    marginTop: 12,
    marginBottom: 24,
  },

  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 8,
    backgroundColor: 'rgba(43,43,43,0.18)',
  },

  activeDot: {
    width: 22,
    backgroundColor: '#2B2B2B',
  },

  buttonShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 36,
    maxHeight: '70%',
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 16,
    fontFamily: 'IBM Plex Sans JP',
  },

  sheetList: {
    maxHeight: 420,
  },

  sheetOption: {
    minHeight: 56,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
  },

  selectedOption: {
    backgroundColor: '#EFEFEF',
  },

  sheetOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    fontFamily: 'IBM Plex Sans JP',
  },

  selectedOptionText: {
    color: '#000',
  },

  selectedCheck: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2B2B2B',
  },
});