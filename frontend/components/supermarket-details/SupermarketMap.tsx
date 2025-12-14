import { Box } from '@/components/ui/box';
import { darkMapStyle } from '@/constants/mapStyles';
import { useTheme } from '@/context/ThemeContext';
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { height } = Dimensions.get('window');

interface SupermarketMapProps {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  isTablet: boolean;
}

export function SupermarketMap({
  latitude,
  longitude,
  name,
  address,
  isTablet,
}: SupermarketMapProps) {
  const { theme } = useTheme();
  const googleMapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey;

  return (
    <Box 
      className={`${isTablet ? 'm-6' : 'm-4'} rounded-xl overflow-hidden shadow-md`}
      style={{ height: height * (isTablet ? 0.4 : 0.35) }}>
      <MapView
        key={theme}
        style={{ flex: 1 }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        provider={googleMapsApiKey ? "google" : undefined}
        mapType="standard"
        customMapStyle={theme === 'dark' ? darkMapStyle : []}>
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title={name}
          description={address}
        />
      </MapView>
    </Box>
  );
}

