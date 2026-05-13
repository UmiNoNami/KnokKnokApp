import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';

import { mapListings } from '../data/mockData';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');

  const filteredListings = mapListings.filter((item) =>
    item.area.toLowerCase().includes(searchText.toLowerCase())
  );
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search housing</Text>

      <TextInput
        style={styles.input}
        placeholder="Type location (e.g. Bray)"
        value={searchText}
        onChangeText={setSearchText}
      />
      

      <Pressable
  style={styles.mapButton}
  onPress={() =>
    navigation.navigate('Map', { listings: filteredListings })
  }
>
  <Text style={styles.mapButtonText}>🗺️ View on Map</Text>
</Pressable>


      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>{item.area}</Text>
            <Text>€{item.price}/month</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No results
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F1',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

mapButton: {
  backgroundColor: '#000',
  padding: 14,
  borderRadius: 12,
  marginBottom: 12,
},

mapButtonText: {
  color: '#fff',
  textAlign: 'center',
  fontWeight: '700',
},

});