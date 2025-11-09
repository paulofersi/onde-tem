import { CustomMarker, MapViewComponent } from '@/components/MapView';
import { ThemedView } from '@/components/ThemedView';
import { supermarketService } from '@/services/supermarketService';
import { Supermarket } from '@/types/supermarket';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

export default function HomeScreen() {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);

  const loadSupermarkets = useCallback(async () => {
    try {
      const data = await supermarketService.getAllSupermarkets();
      setSupermarkets(data);
    } catch (error) {
      console.error('Erro ao carregar supermercados:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSupermarkets();
    }, [loadSupermarkets])
  );

  const handleAddMarker = async (marker: CustomMarker) => {
    try {
      await supermarketService.createSupermarket({
        name: marker.name,
        latitude: marker.latitude,
        longitude: marker.longitude,
        address: '',
        description: '',
        color: marker.color,
      });
      await loadSupermarkets();
    } catch (error) {
      console.error('Erro ao salvar supermercado:', error);
    }
  };

  return (
    <ThemedView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={[styles.mapContainer, isTablet && styles.mapContainerTablet]}>
        <MapViewComponent 
          supermarkets={supermarkets}
          onAddMarker={handleAddMarker}
        />
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
