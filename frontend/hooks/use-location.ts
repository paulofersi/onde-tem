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
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setError(null);
      } catch (err: any) {
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
