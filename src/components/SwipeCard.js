import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function SwipeCard({ item }) {
  return (
    <View style={styles.card}>
      
      {/* IMAGE CAROUSEL */}
      <ScrollView horizontal pagingEnabled>
        {item.photos?.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            style={styles.image}
          />
        ))}
      </ScrollView>

      {/* INFO */}
      <View style={styles.info}>
        <Text style={styles.title}>
          {item.accommodationType?.join(', ')} • {item.roomType?.join(', ')}
        </Text>

        <Text style={styles.location}>{item.location}</Text>

        <Text style={styles.price}>€{item.price}</Text>

        <Text style={styles.name}>{item.name}</Text>

        <Text style={styles.bio}>{item.bio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 300,
    marginRight: 10,
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  location: {
    marginTop: 6,
    color: '#666',
  },
  price: {
    marginTop: 6,
    fontWeight: '600',
  },
  name: {
    marginTop: 8,
  },
  bio: {
    marginTop: 8,
    color: '#444',
  },
});