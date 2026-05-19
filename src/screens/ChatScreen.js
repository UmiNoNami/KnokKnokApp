import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  arrayRemove,
} from 'firebase/firestore';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import AppScreen from '../components/AppScreen';
import { db, storage, auth } from '../firebase/firebaseConfig';

export default function ChatScreen({ navigation, route }) {
  const { conversation = {} } = route.params || {};

  const scrollViewRef = useRef(null);

  const currentUserId = auth.currentUser?.uid;

if (!currentUserId) {
  return null;
}

 const otherUserId = conversation.id || 'unknownUser';

  const chatId =
    conversation.chatId || [currentUserId, otherUserId].sort().join('_');

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);



useEffect(() => {
  const loadChatMessages = async () => {
    const chatSnap = await getDoc(doc(db, 'chats', chatId));
    const clearedAt = chatSnap.exists()
      ? chatSnap.data()?.clearedAtFor?.[currentUserId]
      : null;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedMessages = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((message) => {
            if (!clearedAt?.toDate || !message.createdAt?.toDate) {
              return true;
            }

            return message.createdAt.toDate() > clearedAt.toDate();
          });

        setMessages(loadedMessages);
        scrollToBottom();
      },
      (error) => {
        console.log('Chat load error:', error);
      }
    );

    return unsubscribe;
  };

  const unsubscribePromise = loadChatMessages();

  return () => {
    unsubscribePromise.then((unsubscribe) => {
      if (unsubscribe) unsubscribe();
    });
  };
}, [chatId, currentUserId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (createdAt) => {
    if (!createdAt?.toDate) return '';

    return createdAt.toDate().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const deleteMessage = async (messageId) => {
    try {
      
      await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
    } catch (error) {
      console.log('Delete message error:', error);
    }
  };

  const showMessageOptions = (message) => {
    Alert.alert('Message options', 'Choose an action', [
      {
        text: 'Edit',
        onPress: () => {
          setEditingMessageId(message.id);
          setText(message.text);
        },
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMessage(message.id),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };





  const sendMessage = async () => {
    const trimmed = text.trim();
  

    if (
  conversation.currentUserRole &&
  conversation.otherUserRole &&
  conversation.currentUserRole === conversation.otherUserRole
) {
  Alert.alert(
    'Chat blocked',
    'Users with the same role cannot message each other.'
  );
  return;
}
    console.log('ANDROID SEND TEST:', {
  trimmed,
  currentUserId,
  otherUserId,
  chatId,
});

    if (!trimmed) return;

    if (editingMessageId) {
      try {
        await updateDoc(
          doc(db, 'chats', chatId, 'messages', editingMessageId),
          {
            text: trimmed,
            edited: true,
          }
        );

        await setDoc(
          doc(db, 'chats', chatId),
          {
            lastMessage: trimmed,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        setText('');
        setEditingMessageId(null);
        return;
      } catch (error) {
  console.log('Send message error:', error);
  Alert.alert('Send failed', error.message);
}
    }

    try {
      const chatRef = doc(db, 'chats', chatId);

      await setDoc(
  chatRef,
  {
    participants: [currentUserId, otherUserId],
    otherName: conversation.name || 'Chat',
    otherAvatar: conversation.avatar || null,
    lastMessage: trimmed,
    updatedAt: serverTimestamp(),
    hiddenFor: arrayRemove(otherUserId),
  },
  { merge: true }
);

      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        type: 'text',
        text: trimmed,
        senderId: currentUserId,
        createdAt: serverTimestamp(),
      });

      setText('');
      scrollToBottom();
    } catch (error) {
      console.log('Send message error:', error);
    }
  };

  const uploadImageAsync = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = `chatImages/${chatId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permission is needed to open your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled) return;

    try {
      const localUri = result.assets[0].uri;
      const imageUrl = await uploadImageAsync(localUri);

      const chatRef = doc(db, 'chats', chatId);

      await setDoc(
  chatRef,
  {
    participants: [currentUserId, otherUserId],
    otherName: conversation.name || 'Chat',
    otherAvatar: conversation.avatar || null,
    lastMessage: trimmed,
    updatedAt: serverTimestamp(),
    hiddenFor: arrayRemove(otherUserId),
  },
  { merge: true }
);

      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        type: 'image',
        image: imageUrl,
        senderId: currentUserId,
        createdAt: serverTimestamp(),
      });

      scrollToBottom();
    } catch (error) {
      console.log('Upload image error:', error);
      alert('Failed to upload image.');
    }
  };

  const avatarSource =
    typeof conversation.avatar === 'number'
      ? conversation.avatar
      : conversation.avatar
        ? { uri: conversation.avatar }
        : require('../../assets/rooms/room1.jpg');

  return (
    <AppScreen padded={false}>
      <KeyboardAvoidingView
  style={styles.screen}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
>
        <ImageBackground
  source={require('../../assets/icons/chatPattern.png')}
  resizeMode="cover"
  style={styles.inner}
  imageStyle={styles.patternImage}
>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={styles.back}>‹</Text>
            </Pressable>

            <Text style={styles.title}>{conversation.name || 'Chat'}</Text>

            <View style={styles.headerSpace} />
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.chatArea}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            onContentSizeChange={scrollToBottom}
          >
            {messages.length === 0 && !editingMessageId && (
              <View style={styles.emptyChatBox}>
                <Text style={styles.emptyChatText}>Start a chat 👋</Text>
                <Text style={styles.emptyChatSubText}>
                  Send a message to begin the conversation.
                </Text>
              </View>
            )}

            {messages.map((message) => {
              const fromMe = message.senderId === currentUserId;

              if (fromMe) {
                return (
                  <View key={message.id} style={styles.rightRow}>
                    {message.type === 'image' ? (
                      <Image
                        source={{ uri: message.image }}
                        style={styles.sentImage}
                      />
                    ) : (
                      <Pressable
                        style={styles.rightBubble}
                        onLongPress={() => showMessageOptions(message)}
                      >
                        <Text style={styles.messageText}>{message.text}</Text>

                        {message.edited && (
                          <Text style={styles.editedText}>edited</Text>
                        )}
                      </Pressable>
                    )}

                    <Text style={styles.timeRight}>
                      {formatTime(message.createdAt)}
                    </Text>
                  </View>
                );
              }

              return (
                <View key={message.id} style={styles.leftRow}>
                  <Image source={avatarSource} style={styles.smallAvatar} />

                  <View>
                    {message.type === 'image' ? (
                      <Image
                        source={{ uri: message.image }}
                        style={styles.sentImage}
                      />
                    ) : (
                      <View style={styles.leftBubble}>
                        <Text style={styles.messageText}>{message.text}</Text>
                      </View>
                    )}

                    <Text style={styles.timeLeft}>
                      {formatTime(message.createdAt)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
           
           <LinearGradient
  pointerEvents="none"
  colors={[
    'rgba(0,0,0,0)',
    'rgba(0,0,0,0.10)',
    'rgba(0,0,0,0.18)',
  ]}
  style={styles.bottomShadow}
/>
          <View style={styles.inputBar}>
            <Pressable style={styles.plusButton} onPress={pickImage}>
              <Text style={styles.plus}>＋</Text>
            </Pressable>

            <View style={styles.inputBox}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder={editingMessageId ? 'Edit message' : 'Type Message'}
                placeholderTextColor="#757474"
                style={styles.input}
                returnKeyType={editingMessageId ? 'done' : 'send'}
                onSubmitEditing={sendMessage}
blurOnSubmit={false}
                
              />
            </View>

           <TouchableOpacity
  activeOpacity={0.75}
  style={styles.sendButton}
  onPress={sendMessage}
>
  <Image
  source={require('../../assets/icons/send.png')}
  style={styles.sendIcon}
  resizeMode="contain"
/>
</TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },

  inner: {
    flex: 1,
  },

  header: {
    paddingTop: 28,
    paddingHorizontal: 26,
    flexDirection: 'row',
    alignItems: 'center',
  },
back: {
  width: 54,
  height: 54,
  borderRadius: 27,
  overflow: 'hidden',

  textAlign: 'center',
  textAlignVertical: 'center',

  fontSize: 42,
  lineHeight: 54,

  color: '#111',

  backgroundColor: 'rgba(255,255,255,0.38)',

  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.5)',
},

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 23,
    fontWeight: '700',
    color: '#050505',
  },

  headerSpace: {
    width: 44,
  },

  chatArea: {
    flex: 1,
  },

  chatContent: {
  paddingHorizontal: 14,
  paddingTop: 40,
  paddingBottom: Platform.OS === 'android' ? 150 : 120,
},

  leftRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 22,
  },

  smallAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 16,
  },

  leftBubble: {
    maxWidth: 252,
     borderWidth: 1,
     borderColor: '#F4B400',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  rightRow: {
    alignItems: 'flex-end',
    marginBottom: 26,
  },

  rightBubble: {
    maxWidth: 230,
    borderWidth: 1,
    borderColor: '#F4B400',
    backgroundColor: '#F4B400',
    borderRadius: 22,
    paddingHorizontal: 26,
    paddingVertical: 14,
  },

  messageText: {
    fontSize: 15,
    color: '#050505',
    lineHeight: 20,
  },

  editedText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },

  timeLeft: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },

  timeRight: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 6,
  },

  sentImage: {
    width: 190,
    height: 220,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F2B705',
  },


inputBar: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 18,
  paddingBottom: Platform.OS === 'android' ? 18 : 34,
  paddingTop: 12,
  gap: 10,
  backgroundColor: 'transparent',
  zIndex: 10,
  elevation: 10,
},

bottomShadow: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 180,

  backgroundColor: 'rgba(0,0,0,0.18)',
},

plusButton: {
  width: 54,
  height: 54,
  borderRadius: 27,
  backgroundColor: 'rgba(255,255,255,0.12)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.28)',
  alignItems: 'center',
  justifyContent: 'center',
},

plus: {
  fontSize: 28,
  color: '#2b2b2b',
  fontWeight: '300',
},

inputBox: {
  flex: 1,
  height: 54,
  borderRadius: 27,

  backgroundColor: 'rgba(255,255,255,0.42)',

  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.55)',

  justifyContent: 'center',
  paddingHorizontal: 20,

  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
},

sendButton: {
  width: 54,
  height: 54,
  borderRadius: 27,
  backgroundColor: 'rgba(255,255,255,0.12)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.28)',
  alignItems: 'center',
  justifyContent: 'center',
},

  sendText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  emptyChatBox: {
    alignItems: 'center',
    marginTop: 120,
    paddingHorizontal: 30,
  },

  emptyChatText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#050505',
    marginBottom: 8,
  },

  emptyChatSubText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },

  patternImage: {
  opacity: 0.06,
},

sendIcon: {
  width: 22,
  height: 22,
},

bottomShadow: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: Platform.OS === 'android' ? 230 : 180,
  zIndex: 5,
  elevation: 5,
},

});