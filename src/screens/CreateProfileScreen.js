import React, { useState } from 'react';
import { saveProfileToFirebase } from '../services/profileService';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAppState } from '../providers/AppProvider';
import * as ImagePicker from 'expo-image-picker';

import AppScreen from '../components/AppScreen';
import CustomButton from '../components/CustomButton';

const { width } = Dimensions.get('window');
const PHOTO_GAP = 14;
const PHOTO_SIZE = (width - 64 - PHOTO_GAP) / 2;

export default function CreateProfileScreen({ navigation }) {
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState([]);

  const { updateProfile } = useAppState();

  const pickImage = async () => {
    if (photos.length >= 4) {
      Alert.alert('Limit reached', 'You can upload up to 4 photos.');
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow access to your photo library.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setPhotos((prev) => [...prev, selectedUri]);
    }
  };

  const replaceImage = async (index) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow access to your photo library.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;

      setPhotos((prev) =>
        prev.map((photo, photoIndex) =>
          photoIndex === index ? selectedUri : photo
        )
      );
    }
  };

  const deleteImage = (index) => {
    setPhotos((prev) => prev.filter((_, photoIndex) => photoIndex !== index));
  };

  const renderPhotoBox = (index) => {
    const photo = photos[index];
    const isNextAddBox = index === photos.length && photos.length < 4;

    if (photo) {
      return (
        <View key={index} style={[styles.photoBox, styles.photoBoxFilled]}>
          <Pressable
            style={styles.photoPressArea}
            onPress={() => replaceImage(index)}
          >
            <Image source={{ uri: photo }} style={styles.photoImage} />
          </Pressable>

          <Pressable
            style={styles.deletePhotoButton}
            onPress={() => deleteImage(index)}
          >
            <Text style={styles.deletePhotoText}>×</Text>
          </Pressable>
        </View>
      );
    }

    if (isNextAddBox) {
      return (
        <Pressable key={index} style={styles.photoBox} onPress={pickImage}>
          <Text style={styles.plus}>＋</Text>
        </Pressable>
      );
    }

    return <View key={index} style={[styles.photoBox, styles.emptyPhotoBox]} />;
  };

  const handleFinish = async () => {
    const profileData = {
      bio,
      photos,
    };

    updateProfile(profileData);

    await saveProfileToFirebase(profileData);

    navigation.replace('AccountReady');
  };

  return (
    <AppScreen padded={false}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create a profile</Text>

        <Text style={styles.sectionTitle}>Your bio</Text>
        <Text style={styles.sectionSubtitle}>
          Make a great first impression
        </Text>

        <TextInput
          style={styles.bioInput}
          placeholder="Write a little about yourself or your accommodation"
          placeholderTextColor="#9A9A9A"
          multiline
          textAlignVertical="top"
          value={bio}
          onChangeText={setBio}
        />

        <Text style={styles.sectionTitle}>Add photos</Text>
        <Text style={styles.sectionSubtitle}>
          Upload up to 4 clear photos of yourself or your space
        </Text>

        <View style={styles.photoGrid}>
          {[0, 1, 2, 3].map((index) => renderPhotoBox(index))}
        </View>

        <View style={styles.bottomContent}>
          <View style={styles.carouselDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>

          <CustomButton title="Finish" onPress={handleFinish} />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingTop: 70,
  },

  scrollContent: {
    paddingBottom: 70,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginTop: 20,
    marginBottom: 42,
    fontFamily: 'IBM Plex Sans JP',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    fontFamily: 'IBM Plex Sans JP',
  },

  sectionSubtitle: {
    fontSize: 16,
    color: '#3A3A3A',
    lineHeight: 23,
    marginBottom: 22,
    fontFamily: 'IBM Plex Sans JP',
  },

  bioInput: {
    width: '100%',
    minHeight: 146,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.28)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    fontSize: 16,
    color: '#111',
    marginBottom: 34,
    fontFamily: 'IBM Plex Sans JP',
  },

  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PHOTO_GAP,
    marginTop: 2,
  },

  photoBox: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 18,
    borderWidth: 1.4,
    borderColor: '#2B2B2B',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  photoBoxFilled: {
    borderColor: '#F4B400',
  },

  emptyPhotoBox: {
    opacity: 0.28,
  },

  photoPressArea: {
    width: '100%',
    height: '100%',
  },

  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  plus: {
    fontSize: 30,
    color: '#F4B400',
    lineHeight: 34,
    fontWeight: '700',
    textAlign: 'center',
  },

  deletePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2B2B2B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deletePhotoText: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
    color: '#2B2B2B',
  },

  bottomContent: {
    marginTop: 38,
    marginBottom: 24,
  },

  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(43,43,43,0.18)',
  },

  activeDot: {
    width: 22,
    backgroundColor: '#2B2B2B',
  },
});