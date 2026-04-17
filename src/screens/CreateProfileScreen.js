import React, { useState } from 'react';
import {
  Alert,
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

export default function CreateProfileScreen({ navigation }) {
  const [bio, setBio] = useState('');
  const { updateProfile } = useAppState();
  const [photos, setPhotos] = useState([]);
  

  const pickImage = async () => {
    if (photos.length >= 6) {
      Alert.alert('Limit reached', 'Users can upload up to 6 photos.');
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
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setPhotos((prev) => [...prev, selectedUri]);
    }
  };

  const renderPhotoBox = (index) => {
    const photo = photos[index];

    if (photo) {
      return (
        <Pressable key={index} style={styles.photoBox} onPress={pickImage}>
          <Image source={{ uri: photo }} style={styles.photoImage} />
        </Pressable>
      );
    }

    if (index === 0) {
      return (
        <Pressable key={index} style={styles.photoBox} onPress={pickImage}>
          <Text style={styles.plus}>＋</Text>
        </Pressable>
      );
    }

    return <View key={index} style={styles.photoBox} />;
  };

  return (
    <AppScreen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Create a profile</Text>

            <Text style={styles.sectionTitle}>Your bio:</Text>
            <Text style={styles.sectionSubtitle}>
              Make a great first impression
            </Text>

            <TextInput
              style={styles.bioInput}
              placeholder="This is a space that you write about yourself or your accomodation"
              placeholderTextColor="#9A9A9A"
              multiline
              textAlignVertical="top"
              value={bio}
              onChangeText={setBio}
            />

            <Text style={styles.sectionTitle}>Add photos</Text>
            <Text style={styles.sectionSubtitle}>
              Upload a few clear photos of yourself or your space
            </Text>

            <View style={styles.photoGrid}>
              {[0, 1, 2, 3, 4, 5].map((index) => renderPhotoBox(index))}
            </View>
          </View>

          <View style={styles.buttonWrapper}>
               <CustomButton
  title="Finish"
  onPress={() => {
    updateProfile({
      bio,
      photos,
    });

    navigation.navigate('Main'); // go to home tabs
  }}
/>
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 32,
    paddingTop: 70,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 42,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#3A3A3A',
    lineHeight: 23,
    marginBottom: 24,
    maxWidth: 320,
  },
  bioInput: {
    width: '100%',
    minHeight: 152,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D8D3CB',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    fontSize: 16,
    color: '#111',
    marginBottom: 40,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  photoBox: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#E3E1DE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  plus: {
    fontSize: 64,
    color: '#8A8A8A',
    lineHeight: 70,
    fontWeight: '300',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 40,
    marginBottom: 24,
  },
});