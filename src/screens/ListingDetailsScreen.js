import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import AppScreen from '../components/AppScreen';

export default function ListingDetailsScreen({ navigation, route }) {
  const { item } = route.params;
  
  const isAccommodation = item?.price !== undefined;
  const [showMatch, setShowMatch] = useState(false);
  const [showMessagePrompt, setShowMessagePrompt] = useState(false);

  const tags = ['non-smoker', 'quiet', 'no pets', 'night owl', 'tidy', 'LGBT'];

  const handleLike = () => {
    setShowMatch(true);

    setTimeout(() => {
      setShowMessagePrompt(true);
    }, 1000);
  };

  const closeMatchModal = () => {
    setShowMatch(false);
    setShowMessagePrompt(false);
  };

const goToChat = () => {
  closeMatchModal();

  navigation.navigate('Chat', {
    conversation: {
      id: `match_${item.id}`,
      name: item.title || 'House profile',
      avatar:
        typeof item.image === 'number'
          ? Image.resolveAssetSource(item.image).uri
          : item.image.uri,
    },
    isNewMatch: true,
  });
};
  return (
    <AppScreen padded={false}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
  <Pressable onPress={() => navigation.goBack()}>
    <Text style={styles.back}>‹</Text>
  </Pressable>

  <Text style={styles.title}>
    {isAccommodation ? 'House Profile' : 'Profile'}
  </Text>

  <View style={styles.headerSpace} />
</View>

        <View style={styles.imageWrap}>
          <Image
  source={item.imageUrl ? { uri: item.imageUrl } : item.image}
  style={styles.image}
/>

          <View style={styles.dots}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.houseTitle}>
            {item.title || 'Single bedroom'}
          </Text>
          <Text style={styles.location}>
            {item.location || 'Smithfield D07'}
          </Text>
          <Text style={styles.meta}>2 Beds - 1 Bath - House</Text>
        </View>

        <Text style={styles.sectionTitle}>Bio</Text>
        <View style={styles.card}>
          <Text style={styles.body}>
            Single bedroom available in a calm and peaceful house. The room is
            ideal for one person looking for a comfortable and friendly place to
            live.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Number of tenants:</Text>
            <Text style={styles.value}>3</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>Lifestyle Preferences:</Text>

          <View style={styles.tagsWrap}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionRow}>
        <Pressable style={styles.circleButton} onPress={navigation.goBack}>
          <Text style={styles.closeIcon}>×</Text>
        </Pressable>

        <Pressable
  style={styles.circleButton}
  onPress={() => {
    console.log(' Heart pressed');
    handleLike();
  }}
>
  <Text style={styles.heartIcon}>♡</Text>
</Pressable>
      </View>

      <Modal transparent visible={showMatch} animationType="fade">
        <BlurView intensity={35} tint="light" style={styles.modalOverlay}>
          {!showMessagePrompt ? (
            <Text style={styles.matchText}>You Matched</Text>
          ) : (
            <View style={styles.messageBox}>
              <Text style={styles.messageQuestion}>
                Would you like to send{'\n'}a message?
              </Text>

              <View style={styles.messageActions}>
                <Pressable style={styles.messageOption} onPress={goToChat}>
                  <Text style={styles.optionText}>Yes</Text>
                </Pressable>

                <Pressable
                  style={styles.messageOption}
                  onPress={closeMatchModal}
                >
                  <Text style={styles.optionText}>No</Text>
                </Pressable>
              </View>
            </View>
          )}
        </BlurView>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF8F4',
    paddingHorizontal: 18,
    paddingTop: 54,
    paddingBottom: 150,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },

  back: {
    width: 44,
    fontSize: 44,
    lineHeight: 44,
    color: '#111',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#050505',
  },

  headerSpace: {
    width: 44,
  },

  imageWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 26,
  },

  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },

  dots: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },

  activeDot: {
    backgroundColor: '#F2B705',
  },

  infoBlock: {
    paddingHorizontal: 12,
    marginBottom: 34,
  },

  houseTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#222',
    marginBottom: 8,
  },

  location: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },

  meta: {
    fontSize: 16,
    color: '#333',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#050505',
    marginBottom: 12,
    marginLeft: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 9,
    padding: 22,
    marginBottom: 32,
  },

  body: {
    fontSize: 16,
    lineHeight: 23,
    color: '#111',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontSize: 16,
    color: '#111',
  },

  value: {
    fontSize: 16,
    color: '#111',
  },

  divider: {
    height: 1,
    backgroundColor: '#DADADA',
    marginVertical: 22,
  },

  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    marginTop: 26,
  },

  tag: {
    width: 108,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  tagText: {
    fontSize: 15,
    color: '#111',
  },

  actionRow: {
  position: 'absolute',
  left: 75,
  right: 75,
  bottom: 108,
  flexDirection: 'row',
  justifyContent: 'space-between',
  zIndex: 999,
  elevation: 999,
},

circleButton: {
  width: 62,
  height: 62,
  borderRadius: 31,
  backgroundColor: '#FFFFFF',
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 20,
  zIndex: 1000,
},

  closeIcon: {
    fontSize: 48,
    lineHeight: 54,
    color: '#222',
  },

  heartIcon: {
    fontSize: 48,
    lineHeight: 54,
    color: '#222',
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  matchText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
  },

  messageBox: {
    width: '96%',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  messageQuestion: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
    paddingHorizontal: 32,
    paddingTop: 44,
    paddingBottom: 34,
    lineHeight: 31,
  },

  messageActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.8)',
  },

  messageOption: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.8)',
  },

  optionText: {
    fontSize: 16,
    color: '#000',
  },
});