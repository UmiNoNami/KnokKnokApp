import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Keyboard,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import {
  collection,
  onSnapshot,
} from 'firebase/firestore';

import { db } from '../firebase/firebaseConfig';

export default function MapScreen() {
  const mapRef = useRef(null);
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [mapListings, setMapListings] = useState([]);
  const [region, setRegion] = useState({
    latitude: 53.3498,
    longitude: -6.2603,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
  });

 useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'listings'),
    (snapshot) => {
      const loadedListings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMapListings(loadedListings);
    },
    (error) => {
      console.log('Listings load error:', error);
    }
  );

  return unsubscribe;
}, []);

useEffect(() => {

    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});

      const userRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };

      setRegion(userRegion);
      mapRef.current?.animateToRegion(userRegion, 800);
    };

    getLocation();
  }, []);

  const areas = useMemo(() => {
  const uniqueAreas = [
    ...new Set(
      mapListings
        .filter((item) => item.area && item.latitude && item.longitude)
        .map((item) => item.area)
    ),
  ];

  return uniqueAreas.map((area) => {
    const firstListing = mapListings.find((item) => item.area === area);

    return {
      area,
      latitude: firstListing.latitude,
      longitude: firstListing.longitude,
    };
  });
}, [mapListings]);

const suggestedAreas = useMemo(() => {
  const query = searchText.trim().toLowerCase();

  if (!query) return [];

  return areas.filter((item) =>
     item.area?.toLowerCase().includes(query)
  );
}, [searchText, areas]);

const filteredListings = useMemo(() => {
  const query = searchText.trim().toLowerCase();

  if (!query) return mapListings;

    return mapListings.filter((item) =>
  item.area?.toLowerCase().includes(query)
);

}, [searchText, mapListings]);

  const moveToListing = (item) => {
    Keyboard.dismiss();
    setSearchText(item.area);
    
    const newRegion = {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    };

    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 800);
  };

const moveToArea = (areaItem) => {
  Keyboard.dismiss();  

  setSearchText(areaItem.area);

  const newRegion = {
    latitude: areaItem.latitude,
    longitude: areaItem.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  setRegion(newRegion);
  mapRef.current?.animateToRegion(newRegion, 800);
};

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation
         onPress={() => Keyboard.dismiss()}
      >
        {filteredListings
          .filter((item) => item.latitude && item.longitude)
          .map((item) => (
           <Marker
  key={item.id}
  coordinate={{
    latitude: item.latitude,
    longitude: item.longitude,
  }}
  onPress={() =>
    navigation.navigate('ListingDetails', {
      item,
    })
  }
>
  <View style={styles.priceBubble}>
    <Text style={styles.priceBubbleText}>€{item.price}/wk</Text>
  </View>
</Marker>
          ))}
      </MapView>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
<TextInput
  style={styles.searchInput}
  placeholder="Search area, e.g. Bray or D16"
  value={searchText}
  onChangeText={setSearchText}
  returnKeyType="search"
  onSubmitEditing={() => {
    Keyboard.dismiss();   

    if (filteredListings.length > 0) {
      moveToListing(filteredListings[0]);
    }
  }}
/>

  <Pressable
    style={styles.searchIconButton}
    onPress={() => {
      if (filteredListings.length > 0) {
        moveToListing(filteredListings[0]);
      }
    }}
  >
    <Text style={styles.searchIcon}></Text>
  </Pressable>
</View>

        {searchText.length > 0 && (
          <FlatList
            data={suggestedAreas}
            keyExtractor={(item) => item.area}
            style={styles.dropdown}
            keyboardShouldPersistTaps="handled"
           renderItem={({ item }) => (
    <Pressable
    key={item.area}
    style={styles.resultItem}
    onPress={() => moveToArea(item)}
  >
    <Text style={styles.resultTitle}>{item.area}</Text>
    <Text style={styles.resultInfo}>
      {mapListings.filter((listing) => listing.area === item.area).length} places available
    </Text>
  </Pressable>
)}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No places found</Text>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 10,
  },

  searchInput: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    fontSize: 16,
  },

  dropdown: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    maxHeight: 260,
  },

  resultItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  resultTitle: {
    fontWeight: '700',
    fontSize: 15,
  },

  resultInfo: {
    marginTop: 4,
    color: '#555',
  },

  emptyText: {
    padding: 14,
    textAlign: 'center',
    color: '#777',
  },

  priceBubble: {
    backgroundColor: '#F4C21A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#fff',
  },

  priceBubbleText: {
    fontWeight: '800',
    color: '#050505',
  },
});