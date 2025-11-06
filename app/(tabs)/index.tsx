import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { MapViewComponent } from '@/components/MapView';
import { mockSupermarkets } from '@/data/mockSupermarkets';
import { ThemedView } from '@/components/themed-view';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.mapContainer, isTablet && styles.mapContainerTablet]}>
        <MapViewComponent supermarkets={mockSupermarkets} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  mapContainerTablet: {
    maxWidth: '100%',
    alignSelf: 'center',
  },
});
