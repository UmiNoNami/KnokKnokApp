import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';

import AppScreen from '../components/AppScreen';

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  deleteDoc,
} from 'firebase/firestore';

import { db } from '../firebase/firebaseConfig';
import { useAppState } from '../providers/AppProvider';

export default function MessagesScreen({ navigation }) {
  const { profileDraft } = useAppState();

  const role = profileDraft?.role || 'seeker';
  const isAccommodationSeeker = role === 'seeker';

  const [firebaseConversations, setFirebaseConversations] = useState([]);

  useEffect(() => {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedChats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFirebaseConversations(loadedChats);
      },
      (error) => {
        console.log('Messages load error:', error);
      }
    );

    return unsubscribe;
  }, []);

  const conversations = firebaseConversations.map((item) => ({
    chatId: item.id,
    id: item.participants?.find((p) => p !== 'demoUser') || item.id,

    name: item.otherName || 'Chat',
    avatar: item.otherAvatar || null,

    listingTitle: item.listingTitle || item.propertyTitle || '',
    listingImage: item.listingImage || item.houseImage || null,

    preview:
      item.lastMessage && item.lastMessage.length > 0
        ? item.lastMessage
        : item.matchMessage || 'You matched with this user. Say hi 👋',
  }));

  const deleteChat = (chatId) => {
    Alert.alert(
      'Delete chat?',
      'This will remove the conversation from your inbox.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'chats', chatId));
            } catch (error) {
              console.log('Delete chat error:', error);
            }
          },
        },
      ]
    );
  };

  const getMainImage = (item) => {
    if (isAccommodationSeeker) {
      if (item.listingImage) return { uri: item.listingImage };
      return require('../../assets/rooms/room1.jpg');
    }

    if (item.avatar) return { uri: item.avatar };
    return require('../../assets/rooms/room1.jpg');
  };

  const getSmallImage = (item) => {
    if (isAccommodationSeeker) {
      if (item.avatar) return { uri: item.avatar };
      return require('../../assets/rooms/room1.jpg');
    }

    if (item.listingImage) return { uri: item.listingImage };
    return require('../../assets/rooms/room1.jpg');
  };

  return (
    <AppScreen padded={false}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Message</Text>
          <View style={styles.headerSpace} />
        </View>

        <View style={styles.list}>
          {conversations.map((item) => (
            <Pressable
              key={item.chatId}
              style={styles.card}
              onPress={() =>
                navigation.navigate('Chat', {
                  conversation: item,
                })
              }
            >
              <Image source={getMainImage(item)} style={styles.houseImage} />

              <View style={styles.textArea}>
                {isAccommodationSeeker && item.listingTitle?.length > 0 && (
                  <Text style={styles.listingTitle} numberOfLines={1}>
                    {item.listingTitle}
                  </Text>
                )}

                {!isAccommodationSeeker && (
                  <Text style={styles.listingTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                )}

                <View style={styles.hostRow}>
                  <Image source={getSmallImage(item)} style={styles.smallAvatar} />

                  <Text style={styles.name} numberOfLines={1}>
                    {isAccommodationSeeker
                      ? item.name
                      : item.listingTitle || 'Interested in your place'}
                  </Text>
                </View>

                <View style={styles.previewBubble}>
                  <Text style={styles.previewText} numberOfLines={1}>
                    {item.preview}
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.deleteButton}
                onPress={(event) => {
                  event.stopPropagation();
                  deleteChat(item.chatId);
                }}
              >
                <Text style={styles.deleteText}>×</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FAF8F4',
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 130,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 56,
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#050505',
  },

  headerSpace: {
    width: 45,
  },

  list: {
    gap: 20,
  },

  card: {
    minHeight: 132,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0DC',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  houseImage: {
    width: 92,
    height: 104,
    borderRadius: 20,
    marginRight: 14,
    backgroundColor: '#eee',
  },

  textArea: {
    flex: 1,
  },

  listingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
  },

  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  smallAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8,
  },

  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  previewBubble: {
    backgroundColor: '#E9E7E4',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  previewText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },

  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F2F0EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  deleteText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#555',
    lineHeight: 24,
  },
});