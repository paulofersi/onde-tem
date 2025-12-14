import { CustomMarker, MapViewComponent } from '@/components/MapView';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useSupermarkets } from '@/hooks/useSupermarkets';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

export default function HomeScreen() {
  const { theme, toggleTheme } = useTheme();

  const {
    supermarkets,
    loading: loadingSupermarkets,
    error: supermarketsError,
    refetch: refetchSupermarkets,
    createSupermarket,
  } = useSupermarkets();


  useFocusEffect(
    useCallback(() => {
      refetchSupermarkets();
    }, [refetchSupermarkets])
  );

  const handleAddMarker = async (marker: CustomMarker) => {
    try {
      await createSupermarket({
        name: marker.name,
        latitude: marker.latitude,
        longitude: marker.longitude,
        address: '',
        description: '',
        color: marker.color,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ThemedView className="flex-1" edges={['top', 'left', 'right']} useSafeArea={true}>
      <ThemedView
        className="flex-1 w-full h-full"
        useSafeArea={false}
      >
        <MapViewComponent 
          supermarkets={supermarkets}
          onAddMarker={handleAddMarker}
        />
        <TouchableOpacity
          className={`absolute ${isTablet ? 'top-12' : 'top-5'} left-4 w-12 h-12 rounded-full items-center justify-center shadow-lg`}
          style={[
            { backgroundColor: theme === 'dark' ? Colors[theme].backgroundSecondary : '#fff' },
            getThemeButtonStyle(theme)
          ]}
          onPress={toggleTheme}
          activeOpacity={0.7}>
          <Ionicons
            name={theme === 'dark' ? 'sunny' : 'moon'}
            size={24}
            color={theme === 'dark' ? '#fbbf24' : Colors[theme].tint}
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const getThemeButtonStyle = (theme: 'light' | 'dark') => ({
  shadowColor: Colors[theme].text,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
});
