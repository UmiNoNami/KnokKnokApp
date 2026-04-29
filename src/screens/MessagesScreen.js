import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppScreen from '../components/AppScreen';
import { conversations } from '../data/conversations';

export default function MessagesScreen({ navigation }) {
  return (
    <AppScreen padded={false}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          
          <Text style={styles.title}>Message</Text>
          <View style={styles.headerSpace} />
        </View>

        <View style={styles.list}>
          {conversations.map((item) => (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => navigation.navigate('Chat', { conversation: item })}
            >
              <Image source={{ uri: item.avatar }} style={styles.avatar} />

              <View style={styles.textArea}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.previewBubble}>
                  <Text style={styles.previewText} numberOfLines={1}>
                    {item.preview}
                  </Text>
                </View>
              </View>
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
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 130,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 90,
  },

  homeIcon: {
    width: 45,
    fontSize: 26,
    color: '#222',
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
    gap: 38,
  },

  card: {
    height: 108,
    borderRadius: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0DC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginRight: 18,
  },

  textArea: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },

  previewBubble: {
    backgroundColor: '#E9E7E4',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  previewText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
});