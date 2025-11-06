import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Location as LocationType } from '@/types/supermarket';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setError('Permissão de localização negada');
          setLoading(false);
          // Definir localização padrão (São Paulo) se a permissão for negada
          setLocation({
            latitude: -23.5505,
            longitude: -46.6333,
          });
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setError(null);
      } catch (err) {
        setError('Erro ao obter localização');
        // Definir localização padrão em caso de erro
        setLocation({
          latitude: -23.5505,
          longitude: -46.6333,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, error, loading };
};

