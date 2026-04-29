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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import AppScreen from '../components/AppScreen';

export default function ChatScreen({ navigation, route }) {
 const { conversation, isNewMatch } = route.params;

  const storageKey = `chat_${conversation.id}`;
  const scrollViewRef = useRef(null);

  const defaultMessages = [
    {
      id: '1',
      type: 'text',
      fromMe: false,
      text: 'Hi Andrew, May I ask you some questions?',
      time: '11:56 AM',
    },
    {
      id: '2',
      type: 'text',
      fromMe: false,
      text: 'Is that ok?',
      time: '11:56 AM',
    },
    {
      id: '3',
      type: 'text',
      fromMe: true,
      text: 'Hi Edoardo, sure!\nHow can I help you?',
      time: '11:58 AM',
    },
  ];

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem(storageKey);

        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (error) {
        console.log('Failed to load messages:', error);
      }
    };

    loadMessages();
  }, [storageKey]);

     useEffect(() => {
  const loadMessages = async () => {
    try {
      if (isNewMatch) {
        setMessages([]);
        await AsyncStorage.removeItem(storageKey);
        return;
      }

      const savedMessages = await AsyncStorage.getItem(storageKey);

      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.log('Failed to load messages:', error);
    }
  };

  loadMessages();
}, [storageKey, isNewMatch]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sendMessage = () => {
    const trimmed = text.trim();

    if (!trimmed) return;

    const newMessage = {
      id: Date.now().toString(),
      type: 'text',
      fromMe: true,
      text: trimmed,
      time: getCurrentTime(),
    };

    setMessages((current) => [...current, newMessage]);
    setText('');
    scrollToBottom();
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

    const imageMessage = {
      id: Date.now().toString(),
      type: 'image',
      fromMe: true,
      image: result.assets[0].uri,
      time: getCurrentTime(),
    };

    setMessages((current) => [...current, imageMessage]);
    scrollToBottom();
  };

  return (
    <AppScreen padded={false}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={styles.back}>‹</Text>
            </Pressable>

            <Text style={styles.title}>{conversation.name}</Text>

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
            {messages.map((message) => {
              if (message.fromMe) {
                return (
                  <View key={message.id} style={styles.rightRow}>
                    {message.type === 'image' ? (
                      <Image source={{ uri: message.image }} style={styles.sentImage} />
                    ) : (
                      <View style={styles.rightBubble}>
                        <Text style={styles.messageText}>{message.text}</Text>
                      </View>
                    )}

                    <Text style={styles.timeRight}>{message.time}</Text>
                  </View>
                );
              }

              return (
                <View key={message.id} style={styles.leftRow}>
                  <Image source={{ uri: conversation.avatar }} style={styles.smallAvatar} />

                  <View>
                    <View style={styles.leftBubble}>
                      <Text style={styles.messageText}>{message.text}</Text>
                    </View>

                    <Text style={styles.timeLeft}>{message.time}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.inputBar}>
            <Pressable style={styles.plusButton} onPress={pickImage}>
              <Text style={styles.plus}>＋</Text>
            </Pressable>

            <View style={styles.inputBox}>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Type Message"
                placeholderTextColor="#D4D4D4"
                style={styles.input}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                onBlur={Keyboard.dismiss}
              />
            </View>

            <Pressable style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </View>
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
    paddingTop: 58,
    paddingHorizontal: 26,
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingBottom: 30,
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
    backgroundColor: '#E9E7E4',
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
    borderColor: '#F2B705',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 26,
    paddingVertical: 14,
  },

  messageText: {
    fontSize: 15,
    color: '#050505',
    lineHeight: 20,
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
    paddingBottom: 34,
    paddingTop: 10,
    gap: 10,
    backgroundColor: '#FAF8F4',
  },

  plusButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E2DD',
  },

  plus: {
    fontSize: 30,
    color: '#111',
  },

  inputBox: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E2DD',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  input: {
    fontSize: 15,
    color: '#111',
  },

  sendButton: {
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 27,
    backgroundColor: '#F2B705',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
});