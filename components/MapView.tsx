import { AddMarkerDialog } from '@/components/AddMarkerDialog';
import { useLocation } from '@/hooks/use-location';
import { Supermarket } from '@/types/supermarket';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

export interface CustomMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  color: string;
}

interface MapViewComponentProps {
  supermarkets: Supermarket[];
  onAddMarker?: (marker: CustomMarker) => void;
}

export const MapViewComponent: React.FC<MapViewComponentProps> = ({ 
  supermarkets,
  onAddMarker,
}) => {
  const { location, loading } = useLocation();
  const router = useRouter();
  const googleMapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey;

  const [region, setRegion] = useState<Region>({
    latitude: -22.6129,
    longitude: -43.1774,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);

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

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoordinate({ latitude, longitude });
    setDialogVisible(true);
  };

  const handleSaveMarker = (name: string, color: string) => {
    if (selectedCoordinate && onAddMarker) {
      const newMarker: CustomMarker = {
        id: `custom-${Date.now()}`,
        name,
        latitude: selectedCoordinate.latitude,
        longitude: selectedCoordinate.longitude,
        color,
      };
      onAddMarker(newMarker);
    }
  };

  if (loading) {
    return <View style={styles.container} />;
  }

  return (
    <>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
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
            pinColor={supermarket.color || '#FF0000'}
            onPress={() => handleMarkerPress(supermarket)}
          />
        ))}
      </MapView>
      {selectedCoordinate && (
        <AddMarkerDialog
          visible={dialogVisible}
          latitude={selectedCoordinate.latitude}
          longitude={selectedCoordinate.longitude}
          onClose={() => {
            setDialogVisible(false);
            setSelectedCoordinate(null);
          }}
          onSave={handleSaveMarker}
        />
      )}
    </>
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

