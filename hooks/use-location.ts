import { Location as LocationType } from "@/types/supermarket";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export const useLocation = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError("Permissão de localização negada");
          setLoading(false);
          setLocation({
            latitude: -22.6129,
            longitude: -43.1774,
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
        setError("Erro ao obter localização");
        setLocation({
          latitude: -22.6129,
          longitude: -43.1774,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { location, error, loading };
};
