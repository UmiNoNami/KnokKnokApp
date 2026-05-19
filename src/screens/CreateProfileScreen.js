import React, { useEffect, useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { storage, auth, db } from '../firebase/firebaseConfig';
import { saveProfileToFirebase } from '../services/profileService';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppState } from '../providers/AppProvider';
import * as ImagePicker from 'expo-image-picker';

import CustomButton from '../components/CustomButton';

const { width } = Dimensions.get('window');
const PHOTO_GAP = 14;
const PHOTO_SIZE = (width - 64 - PHOTO_GAP) / 2;

export default function CreateProfileScreen({ navigation }) {
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState('');

  const { updateProfile, profileDraft } = useAppState();

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

  const uploadProfileImageAsync = async (uri) => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      throw new Error('No logged-in user found');
    }

    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = `profileImages/${userId}_${Date.now()}.jpg`;
    const imageRef = ref(storage, fileName);

    await uploadBytes(imageRef, blob);

    return await getDownloadURL(imageRef);
  };

  const pickProfilePhoto = async () => {
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
      try {
        const selectedUri = result.assets[0].uri;
        const uploadedUrl = await uploadProfileImageAsync(selectedUri);
        setProfilePhoto(uploadedUrl);
      } catch (error) {
        console.log('Profile photo upload error:', error);
        Alert.alert('Upload failed', error.message);
      }
    }
  };

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

      try {
        const uploadedUrl = await uploadProfileImageAsync(selectedUri);
        setPhotos((prev) => [...prev, uploadedUrl]);
      } catch (error) {
        console.log('Profile image upload error:', error);
        Alert.alert('Upload failed', error.message);
      }
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
      const uploadedUrl = await uploadProfileImageAsync(selectedUri);

      setPhotos((prev) =>
        prev.map((photo, photoIndex) =>
          photoIndex === index ? uploadedUrl : photo
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
    const userId = auth.currentUser?.uid;

    if (!userId) {
      throw new Error('No logged-in user found');
    }

    const isProvider = profileDraft?.role === 'provider';

    if (isProvider) {
      const profileData = {
        bio,
        profilePhoto: profilePhoto || photos?.[0] || '',
        photos,
      };

      const listingData = {
        ownerId: userId,
        hostName: profileDraft?.name || '',
        hostAvatar: profilePhoto || photos?.[0] || '',
        title: profileDraft?.accommodationType?.[0] || 'Accommodation',
        description: bio,
        houseImages: photos,
        imageUrl: photos?.[0] || profilePhoto || '',
        area: profileDraft?.location || '',
        location: profileDraft?.location || '',
        price: profileDraft?.price || 200,
        billsIncluded: profileDraft?.billsIncluded ?? true,
        accommodationType: profileDraft?.accommodationType || [],
        roomType: profileDraft?.roomType || [],
        tenants: profileDraft?.tenants || 0,
        bedroomCount: profileDraft?.bedroomCount || 0,
        bathroomCount: profileDraft?.bathroomCount || 0,
        wifi: profileDraft?.wifi || false,
        furnished: profileDraft?.furnished || false,
        livingRoom: profileDraft?.livingRoom || false,
        gardenBalcony: profileDraft?.gardenBalcony || false,
        lifestyle: profileDraft?.lifestyle || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      updateProfile(profileData);
      await saveProfileToFirebase(profileData);

      await setDoc(doc(db, 'listings', `${userId}_listing`), listingData, {
        merge: true,
      });
    } else {
      const profileData = {
        bio,
        photos,
        profilePhoto: profilePhoto || photos?.[0] || '',
      };

      updateProfile(profileData);
      await saveProfileToFirebase(profileData);
    }

    navigation.replace('AccountReady');
  };

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

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create a profile</Text>

        <Text style={styles.sectionTitle}>Add a profile picture:</Text>

        <Pressable style={styles.profilePhotoCircle} onPress={pickProfilePhoto}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
          ) : (
            <Text style={styles.bigPlus}>＋</Text>
          )}
        </Pressable>

        <Text style={styles.sectionTitle}>Your bio:</Text>
        <Text style={styles.sectionSubtitle}>Make a great first impression</Text>

        <TextInput
          style={styles.bioInput}
          placeholder="This is a space that you write about yourself or your accommodation"
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
          <CustomButton
            title="Next"
            onPress={handleFinish}
            style={styles.buttonShadow}
          />
        </View>
      </ScrollView>
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
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
    fontFamily: 'IBM Plex Sans JP',
  },

  sectionSubtitle: {
    fontSize: 15,
    color: '#3A3A3A',
    lineHeight: 22,
    marginBottom: 22,
    fontFamily: 'IBM Plex Sans JP',
  },

profilePhotoCircle: {
  width: 142,
  height: 142,
  borderRadius: 71,
  backgroundColor: 'rgba(255,255,255,0.35)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.85)',
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 26,
  marginBottom: 44,
  overflow: 'hidden',

  shadowColor: '#FFFFFF',
  shadowOpacity: 0.25,
  shadowRadius: 20,
  shadowOffset: {
    width: 0,
    height: 0,
  },

  elevation: 8,
},

  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

 bigPlus: {
  fontSize: 58,
  color: '#F4B400',
  fontWeight: '300',
  lineHeight: 62,
},

  bioInput: {
    width: '100%',
    minHeight: 156,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(43,43,43,0.18)',
    backgroundColor: '#ffffff94',
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
    marginTop: 18,
  },

  photoBox: {
  width: PHOTO_SIZE,
  height: PHOTO_SIZE,
  borderRadius: 22,

  backgroundColor: 'rgba(255,255,255,0.30)',

  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.42)',

  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',

  shadowColor: '#FFFFFF',
  shadowOpacity: 0.22,
  shadowRadius: 18,
  shadowOffset: {
    width: 0,
    height: 0,
  },

  elevation: 6,
},

  photoBoxFilled: {
    backgroundColor: '#FFFFFF',
  },

  emptyPhotoBox: {
    opacity: 0.85,
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
  fontSize: 52,
  color: '#F4B400',
  lineHeight: 58,
  fontWeight: '300',
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
    marginTop: 48,
    marginBottom: 24,
  },

  buttonShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});