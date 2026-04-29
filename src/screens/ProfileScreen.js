import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';

import AppScreen from '../components/AppScreen';
import { useAppState } from '../providers/AppProvider';
import { saveProfileToFirebase, getProfileFromFirebase } from '../services/profileService';

const fallbackImage =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 44;

export default function ProfileScreen() {
  const { profileDraft } = useAppState();

  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const [name, setName] = useState('');
  const [accommodationType, setAccommodationType] = useState([]);
const [roomType, setRoomType] = useState([]);
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [job, setJob] = useState('');

  const [tenants, setTenants] = useState('0');
  const [bedroomCount, setBedroomCount] = useState('0');
  const [bathroomCount, setBathroomCount] = useState('0');

  const [wifi, setWifi] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [livingRoom, setLivingRoom] = useState(false);
  const [gardenBalcony, setGardenBalcony] = useState(false);

  const [price, setPrice] = useState(200);
  const [billsIncluded, setBillsIncluded] = useState(true);

  const [selectedTags, setSelectedTags] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const cleanPhotos = (data) => {
    const possiblePhotos =
      data?.photos ||
      data?.profilePhotos ||
      data?.profileImages ||
      data?.images ||
      [];

    if (!Array.isArray(possiblePhotos)) return [];

    return possiblePhotos.filter((photo) => typeof photo === 'string' && photo.trim() !== '');
  };

  const cleanTags = (data) => {
    const possibleTags =
      data?.lifestyleTags ||
      data?.lifestyle ||
      data?.preferences ||
      [];

    if (!Array.isArray(possibleTags)) return [];

    return possibleTags.map((tag) => String(tag).toLowerCase().trim());
  };

  const applyProfileData = (data) => {
    setName(data?.name || '');
    setBio(data?.bio || '');
    setDateOfBirth(data?.dateOfBirth || '');
    setJob(data?.job || '');

    setTenants(String(data?.tenants ?? '0'));
    setBedroomCount(String(data?.bedroomCount ?? data?.bedrooms ?? '0'));
    setBathroomCount(String(data?.bathroomCount ?? data?.bathrooms ?? '0'));

    setWifi(Boolean(data?.wifi));
    setFurnished(Boolean(data?.furnished));
    setLivingRoom(Boolean(data?.livingRoom));
    setGardenBalcony(Boolean(data?.gardenBalcony));

    setPrice(Number(data?.price ?? 200));
    setBillsIncluded(data?.billsIncluded ?? true);

    setSelectedTags(cleanTags(data));
    setPhotos(cleanPhotos(data));
  };

  useEffect(() => {
    const loadProfile = async () => {
      const firebaseData = await getProfileFromFirebase();

      if (firebaseData) {
        applyProfileData(firebaseData);
      } else {
        applyProfileData(profileDraft);
      }
    };

    loadProfile();
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return '';

    const parts = dob.split('-');
    if (parts.length !== 3) return '';

    const year = parseInt(parts[2], 10);
    const today = new Date();

    return today.getFullYear() - year;
  };

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permission is needed to open your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const selectedPhotos = result.assets.map((asset) => asset.uri);
    setPhotos(selectedPhotos);
    setActivePhotoIndex(0);
  };

  const handleSave = async () => {
    if (isEditing) {
      const updatedProfile = {
        ...profileDraft,
        name,
        bio,
        dateOfBirth,
        job,
        tenants: Number(tenants),
        bedroomCount: Number(bedroomCount),
        bathroomCount: Number(bathroomCount),
        wifi,
        furnished,
        livingRoom,
        gardenBalcony,
        price: Number(price),
        billsIncluded,
        lifestyleTags: selectedTags,
        photos,
      };

      await saveProfileToFirebase(updatedProfile);

      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 1800);
    }

    setIsEditing((current) => !current);
  };

  const toggleTag = (tag) => {
    const cleanTag = tag.toLowerCase().trim();

    setSelectedTags((current) =>
      current.includes(cleanTag)
        ? current.filter((item) => item !== cleanTag)
        : [...current, cleanTag]
    );
  };

  const displayPhotos = photos.length > 0 ? photos : [fallbackImage];

  const preferenceGroups = [
    { title: 'Daily Rhythm', options: ['early bird', 'night owl', 'flexible'] },
    { title: 'Noise Level', options: ['quiet', 'social', 'lively'] },
    { title: 'Sleep Habits', options: ['light sleeper', 'heavy sleeper'] },
    { title: 'Cleanliness', options: ['tidy', 'average', 'relaxed'] },
    { title: 'Pets', options: ['no pets', 'pets friendly'] },
    { title: 'Smoking', options: ['smoker', 'non-smoker'] },
    { title: 'Other Preferences', options: ['lgbtq', 'vegan'] },
  ];

  const EditableNumberRow = ({ label, value, onChange }) => (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          <TextInput
            value={String(value)}
            onChangeText={onChange}
            style={styles.smallInput}
            keyboardType="number-pad"
          />
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
      <View style={styles.divider} />
    </>
  );

  const EditableSwitchRow = ({ label, value, onChange }) => (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          <Switch value={value} onValueChange={onChange} />
        ) : (
          <Text style={styles.value}>{value ? 'Yes' : 'No'}</Text>
        )}
      </View>
      <View style={styles.divider} />
    </>
  );

  return (
    <AppScreen padded={false}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={require('../../assets/icons/house.png')} style={styles.homeIcon} />
          <Text style={styles.title}>Your Profile</Text>

          <Pressable onPress={handleSave}>
            <Text style={styles.edit}>{isEditing ? 'Save' : 'Edit'}</Text>
          </Pressable>
        </View>

        {savedMessage && (
          <View style={styles.savedBox}>
            <Text style={styles.savedText}>Saved ✓</Text>
          </View>
        )}

        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / IMAGE_WIDTH);
              setActivePhotoIndex(index);
            }}
          >
            {displayPhotos.map((photo, index) => (
              <Image key={`${photo}-${index}`} source={{ uri: photo }} style={styles.image} />
            ))}
          </ScrollView>

          <View style={styles.dots}>
            {displayPhotos.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, activePhotoIndex === index && styles.activeDot]}
              />
            ))}
          </View>

          {isEditing && (
            <Pressable style={styles.changePhotoButton} onPress={pickProfilePhoto}>
              <Text style={styles.changePhotoText}>Change photos</Text>
            </Pressable>
          )}
        </View>

        {isEditing ? (
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Name" />
        ) : (
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{name || 'No name added'}</Text>
            <Text style={styles.subtitle}>
              {calculateAge(dateOfBirth)}
              {calculateAge(dateOfBirth) && job ? ', ' : ''}
              {job}
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Bio</Text>

        <View style={styles.card}>
          {isEditing ? (
            <TextInput
              value={bio}
              onChangeText={setBio}
              style={styles.bioInput}
              multiline
              textAlignVertical="top"
              placeholder="Write something about yourself"
            />
          ) : (
            <Text style={styles.bioText}>{bio || 'No bio added yet.'}</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Description</Text>

        <View style={styles.card}>
          <EditableNumberRow label="Number of tenants:" value={tenants} onChange={setTenants} />
          <EditableNumberRow label="Bedrooms:" value={bedroomCount} onChange={setBedroomCount} />
          <EditableNumberRow label="Bathrooms:" value={bathroomCount} onChange={setBathroomCount} />

          <EditableSwitchRow label="Wifi:" value={wifi} onChange={setWifi} />
          <EditableSwitchRow label="Furnished:" value={furnished} onChange={setFurnished} />
          <EditableSwitchRow label="Living Room:" value={livingRoom} onChange={setLivingRoom} />
          <EditableSwitchRow label="Garden/Balcony:" value={gardenBalcony} onChange={setGardenBalcony} />

          <Text style={styles.label}>Lifestyle Preferences:</Text>

          {isEditing ? (
            preferenceGroups.map((group) => (
              <View key={group.title} style={styles.group}>
                <Text style={styles.groupTitle}>{group.title}</Text>

                <View style={styles.tagsWrap}>
                  {group.options.map((tag) => {
                    const cleanTag = tag.toLowerCase().trim();
                    const selected = selectedTags.includes(cleanTag);

                    return (
                      <Pressable
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        style={[styles.tag, selected && styles.selectedTag]}
                      >
                        <Text style={styles.tagText}>{tag}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.tagsWrap}>
              {selectedTags.length > 0 ? (
                selectedTags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No lifestyle preferences added.</Text>
              )}
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Budget</Text>

        <View style={styles.card}>
          {isEditing ? (
            <>
              <Text style={styles.label}>Price Range</Text>

              <Slider
                style={styles.slider}
                minimumValue={100}
                maximumValue={1000}
                step={50}
                value={Number(price)}
                onValueChange={setPrice}
                minimumTrackTintColor="#222"
                maximumTrackTintColor="#D8D8D8"
                thumbTintColor="#222"
              />

              <Text style={styles.price}>€{price}</Text>
              <Text style={styles.perWeek}>per week</Text>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Bills Included:</Text>
                <Switch value={billsIncluded} onValueChange={setBillsIncluded} />
              </View>
            </>
          ) : (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Price Range:</Text>
                <Text style={styles.value}>€{price} per week</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.label}>Bills:</Text>
                <Text style={styles.value}>{billsIncluded ? 'Included' : 'Not included'}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.accountBox}>
          <Text style={styles.accountText}>Log Out</Text>
          <Text style={styles.accountText}>Pause Account</Text>
          <Text style={styles.deleteText}>Delete Account</Text>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 54,
    paddingBottom: 140,
    backgroundColor: '#FAF8F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  homeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#050505',
  },
  edit: {
    width: 45,
    textAlign: 'right',
    fontSize: 16,
    color: '#111',
  },
  savedBox: {
    alignSelf: 'center',
    backgroundColor: '#FFF1C7',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 14,
  },
  savedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  image: {
    width: IMAGE_WIDTH,
    height: 282,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#EFEFEF',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },
  activeDot: {
    backgroundColor: '#F2B705',
  },
  changePhotoButton: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 16,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  nameBlock: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 28,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#252525',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 18,
    height: 42,
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#050505',
    marginBottom: 12,
    marginLeft: 6,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    padding: 18,
    marginBottom: 22,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 23,
    color: '#111',
  },
  bioInput: {
    minHeight: 92,
    fontSize: 16,
    lineHeight: 22,
    color: '#111',
  },
  row: {
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  value: {
    fontSize: 16,
    color: '#111',
    textAlign: 'right',
  },
  smallInput: {
    width: 56,
    height: 34,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 7,
    textAlign: 'center',
    fontSize: 15,
    backgroundColor: '#FFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#DADADA',
    marginVertical: 18,
  },
  group: {
    marginTop: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  tag: {
    minWidth: 92,
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedTag: {
    backgroundColor: '#FFF1C7',
    borderColor: '#F2B705',
  },
  tagText: {
    fontSize: 14,
    color: '#111',
    textTransform: 'capitalize',
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
  },
  slider: {
    width: '100%',
    height: 44,
    marginTop: 18,
  },
  price: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  perWeek: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
  accountBox: {
    marginHorizontal: -22,
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#DADADA',
  },
  accountText: {
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 1,
    color: '#111',
    paddingVertical: 28,
  },
  deleteText: {
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 1,
    color: '#D00000',
    paddingVertical: 28,
  },
});