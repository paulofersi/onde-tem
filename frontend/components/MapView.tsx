import { AddMarkerDialog } from '@/components/AddMarkerDialog';
import { ThemedText } from '@/components/ThemedText';
import { darkMapStyle } from '@/constants/mapStyles';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/hooks/use-location';
import { Supermarket } from '@/types/supermarket';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
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
  const { location, loading, error } = useLocation();
  const router = useRouter();
  const { theme } = useTheme();
  const googleMapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey;

  const [region, setRegion] = useState<Region | null>(null);
  const [initialRegionSet, setInitialRegionSet] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (!loading && !initialRegionSet) {
      if (location) {
        // Prioriza localização do usuário
        setRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        // Fallback para localização padrão (Rio de Janeiro)
        setRegion({
          latitude: -22.6129,
          longitude: -43.1774,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }
      setInitialRegionSet(true);
    }
  }, [location, loading, initialRegionSet]);

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
    setDialogVisible(false);
    setSelectedCoordinate(null);
  };

  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      {region ? (
        <MapView
          style={{ flex: 1, width: '100%', height: '100%' }}
          region={region}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
          provider={googleMapsApiKey ? "google" : undefined}
          mapType="standard"
          customMapStyle={theme === 'dark' ? darkMapStyle : []}
          loadingEnabled={true}
          toolbarEnabled={false}
        >
          {supermarkets.map((supermarket) => {
            const lat = typeof supermarket.latitude === 'string'
              ? parseFloat(supermarket.latitude)
              : supermarket.latitude;
            const lng = typeof supermarket.longitude === 'string'
              ? parseFloat(supermarket.longitude)
              : supermarket.longitude;

            if (isNaN(lat) || isNaN(lng)) {
              return null;
            }

            return (
              <Marker
                key={supermarket.id}
                coordinate={{
                  latitude: lat,
                  longitude: lng,
                }}
                title={supermarket.name}
                description={supermarket.address}
                pinColor={supermarket.color || '#FF0000'}
                onPress={() => handleMarkerPress(supermarket)}
              />
            );
        })}
        </MapView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>Carregando mapa...</ThemedText>
        </View>
      )}

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
    </View>
  );
};