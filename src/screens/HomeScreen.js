import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../providers/AppProvider';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 24;

export default function HomeScreen() {
  const { profileDraft } = useAppState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const photos = profileDraft.photos || [];

  const accommodationText = profileDraft.accommodationType?.length
    ? profileDraft.accommodationType.join(', ')
    : 'Accommodation';

  const roomText = profileDraft.roomType?.length
    ? profileDraft.roomType.join(', ')
    : 'Room type';

  const locationText = profileDraft.location || 'Location not added';
  const priceText = profileDraft.price
    ? `€${profileDraft.price} / month`
    : 'Price not added';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable style={styles.searchButton}>
            <Text style={styles.searchText}>Search</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.imageWrapper}>
            {photos.length > 0 ? (
              <>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(event) => {
                    const slideWidth = event.nativeEvent.layoutMeasurement.width;
                    const index = Math.round(
                      event.nativeEvent.contentOffset.x / slideWidth
                    );
                    setCurrentIndex(index);
                  }}
                >
                  {photos.map((photo, index) => (
                    <Image
                      key={index}
                      source={{ uri: photo }}
                      style={styles.roomImage}
                    />
                  ))}
                </ScrollView>

                <View style={styles.dotsWrapper}>
                  {photos.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        currentIndex === index && styles.activeDot,
                      ]}
                    />
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>No photos uploaded yet</Text>
              </View>
            )}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.headerRow}>
              <View style={styles.titleBlock}>
                <Text style={styles.title}>{accommodationText}</Text>
                <Text style={styles.subtitle}>
                  {roomText} • {locationText}
                </Text>
              </View>

              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>{priceText}</Text>
              </View>
            </View>

            <View style={styles.chipsRow}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{accommodationText}</Text>
              </View>

              <View style={styles.chip}>
                <Text style={styles.chipText}>{roomText}</Text>
              </View>

              <View style={styles.chip}>
                <Text style={styles.chipText}>{locationText}</Text>
              </View>
            </View>

            <View style={styles.hostBox}>
              <Text style={styles.hostLabel}>Posted by</Text>
              <Text style={styles.hostName}>{profileDraft.name || 'No name yet'}</Text>
            </View>

            {!!profileDraft.bio && (
              <View style={styles.bioBox}>
                <Text style={styles.bioTitle}>About this place</Text>
                <Text style={styles.bioText}>{profileDraft.bio}</Text>
              </View>
            )}
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.iconButton}>
              <Image
                source={require('../../assets/icons/close.png')}
                style={styles.actionIcon}
              />
            </Pressable>

            <Pressable style={[styles.iconButton, styles.likeButton]}>
              <Image
                source={require('../../assets/icons/like.png')}
                style={styles.actionIcon}
              />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 12,
  },
  topBar: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 12,
    paddingRight: 6,
  },
  searchButton: {
    minHeight: 38,
    paddingHorizontal: 18,
    borderWidth: 1.4,
    borderColor: '#111',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
  },
  searchText: {
    fontSize: 17,
    color: '#111',
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  imageWrapper: {
    position: 'relative',
  },
  roomImage: {
    width: CARD_WIDTH,
    height: 360,
    borderRadius: 24,
    marginRight: 12,
  },
  placeholderImage: {
    width: CARD_WIDTH,
    height: 360,
    borderRadius: 24,
    backgroundColor: '#E3E1DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
  dotsWrapper: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.55)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 18,
  },
  infoSection: {
    marginTop: 18,
    paddingHorizontal: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: '#4F4B45',
    lineHeight: 22,
  },
  priceBadge: {
    backgroundColor: '#F3E7B7',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  priceText: {
    fontSize: 15,
    color: '#111',
    fontWeight: '700',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  chip: {
    backgroundColor: '#F3E7B7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
  },
  hostBox: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  hostLabel: {
    fontSize: 14,
    color: '#666',
  },
  hostName: {
    fontSize: 18,
    color: '#111',
    fontWeight: '700',
  },
  bioBox: {
    marginTop: 16,
    backgroundColor: '#ECEAE7',
    borderRadius: 18,
    padding: 14,
  },
  bioTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 15,
    color: '#2F2F2F',
    lineHeight: 22,
  },
  actionRow: {
    marginTop: 24,
    marginBottom: 10,
    paddingHorizontal: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 82,
    height: 82,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#111',
    backgroundColor: '#F8F6F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeButton: {
    backgroundColor: '#FFF8F1',
  },
  actionIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
});