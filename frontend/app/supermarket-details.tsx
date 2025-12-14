import { useSupermarketDetails } from '@/components/supermarket-details/hooks';
import { ProductsList } from '@/components/supermarket-details/ProductsList';
import { SupermarketHeader } from '@/components/supermarket-details/SupermarketHeader';
import { SupermarketMap } from '@/components/supermarket-details/SupermarketMap';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SupermarketDetailsScreen() {
  const params = useLocalSearchParams();
  const { supermarket, discountItems } = useSupermarketDetails(params.id as string | undefined);

  const latitude = supermarket?.latitude || parseFloat(params.latitude as string) || -22.6129;
  const longitude = supermarket?.longitude || parseFloat(params.longitude as string) || -43.1774;
  const name = supermarket?.name || (params.name as string) || 'Supermercado';
  const address = supermarket?.address || (params.address as string) || '';
  const description = supermarket?.description || (params.description as string) || '';

  return (
    <ThemedView className="flex-1 flex-col bg-gray-50 dark:bg-gray-900" edges={['bottom', 'left', 'right']} useSafeArea={false}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ 
          paddingBottom: 32,
          ...(isTablet && {
            maxWidth: 1200,
            alignSelf: 'center',
            width: '90%',
          }),
        }}
        showsVerticalScrollIndicator={false}>
        <SupermarketHeader
          supermarket={supermarket}
          name={name}
          address={address}
          description={description}
          isTablet={isTablet}
        />

        <SupermarketMap
          latitude={latitude}
          longitude={longitude}
          name={name}
          address={address}
          isTablet={isTablet}
        />

        {/* <CoordinatesCard
          latitude={latitude}
          longitude={longitude}
          isTablet={isTablet}
        /> */}

        <ProductsList
          discountItems={discountItems}
          isTablet={isTablet}
        />
      </ScrollView>
    </ThemedView>
  );
}
