import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Constants from 'expo-constants';
import { Supermarket } from '@/types/supermarket';
import { useLocation } from '@/hooks/useLocation';
import { useRouter } from 'expo-router';

interface MapViewComponentProps {
  supermarkets: Supermarket[];
}

export const MapViewComponent: React.FC<MapViewComponentProps> = ({ supermarkets }) => {
  const { location, loading } = useLocation();
  const router = useRouter();
  const googleMapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
  const [region, setRegion] = useState<Region>({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    if (location && !loading) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [location, loading]);

  const handleMarkerPress = (supermarket: Supermarket) => {
    router.push({
      pathname: '/supermarket-details',
      params: {
        id: supermarket.id,
        name: supermarket.name,
        latitude: supermarket.latitude.toString(),
        longitude: supermarket.longitude.toString(),
        address: supermarket.address || '',
        description: supermarket.description || '',
      },
    });
  };

  if (loading) {
    return <View style={styles.container} />;
  }

  return (
    <MapView
      style={styles.map}
      region={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
      onRegionChangeComplete={setRegion}
      provider={googleMapsApiKey ? "google" : undefined}
      mapType="standard">
      {supermarkets.map((supermarket) => (
        <Marker
          key={supermarket.id}
          coordinate={{
            latitude: supermarket.latitude,
            longitude: supermarket.longitude,
          }}
          title={supermarket.name}
          description={supermarket.address}
          onPress={() => handleMarkerPress(supermarket)}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

