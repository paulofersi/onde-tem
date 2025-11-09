import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { productService } from '@/services/productService';
import { supermarketService } from '@/services/supermarketService';
import { DiscountItem, Supermarket } from '@/types/supermarket';
import Constants from 'expo-constants';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SupermarketDetailsScreen() {
  const params = useLocalSearchParams();
  const googleMapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey;

  const [supermarket, setSupermarket] = useState<Supermarket | null>(null);
  const [discountItems, setDiscountItems] = useState<DiscountItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const id = params.id as string;
      const supermarketData = await supermarketService.getSupermarketById(id);
      
      if (supermarketData) {
        setSupermarket(supermarketData);
        
        const allProducts = await productService.getAllProducts();
        const relatedProducts = allProducts.filter((p) => p.supermarketId === id);
        setDiscountItems(relatedProducts);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const latitude = supermarket?.latitude || parseFloat(params.latitude as string) || -22.6129;
  const longitude = supermarket?.longitude || parseFloat(params.longitude as string) || -43.1774;
  const name = supermarket?.name || (params.name as string) || 'Supermercado';
  const address = supermarket?.address || (params.address as string) || '';
  const description = supermarket?.description || (params.description as string) || '';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <ThemedView style={styles.container} edges={['bottom', 'left', 'right']} useSafeArea={false}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {name}
          </ThemedText>
          {address && (
            <ThemedText style={styles.address}>📍 {address}</ThemedText>
          )}
          {description && (
            <ThemedText style={styles.description}>{description}</ThemedText>
          )}
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            provider={googleMapsApiKey ? "google" : undefined}
            mapType="standard">
            <Marker
              coordinate={{
                latitude,
                longitude,
              }}
              title={name}
              description={address}
            />
          </MapView>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Latitude:</ThemedText>
            <ThemedText style={styles.infoValue}>{latitude.toFixed(6)}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Longitude:</ThemedText>
            <ThemedText style={styles.infoValue}>{longitude.toFixed(6)}</ThemedText>
          </View>
        </View>

        <View style={styles.productsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Produtos com Desconto
          </ThemedText>
          {discountItems.length > 0 ? (
            <View style={styles.productsList}>
              {discountItems.map((item: DiscountItem) => (
                <View key={item.id} style={styles.productCard}>
                  <View style={styles.productHeader}>
                    <ThemedText style={styles.productName}>{item.name}</ThemedText>
                    <View style={styles.discountBadge}>
                      <ThemedText style={styles.discountBadgeText}>
                        -{item.discountPercentage}%
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.productPrices}>
                    <ThemedText style={styles.originalPrice}>
                      {formatPrice(item.originalPrice)}
                    </ThemedText>
                    <View style={{ width: 12 }} />
                    <ThemedText style={styles.discountPrice}>
                      {formatPrice(item.discountPrice)}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <ThemedText style={styles.sectionDescription}>
              Nenhum produto com desconto disponível no momento.
            </ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    ...(isTablet && {
      maxWidth: 1200,
      alignSelf: 'center',
      width: '90%',
    }),
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 16,
    paddingTop: 16,
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
    ...(isTablet && {
      padding: 24,
      paddingTop: Platform.OS === 'ios' ? 80 : 40,
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    ...(isTablet && {
      fontSize: 32,
      marginBottom: 12,
    }),
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    ...(isTablet && {
      fontSize: 16,
    }),
  },
  description: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    ...(isTablet && {
      fontSize: 16,
      lineHeight: 24,
    }),
  },
  mapContainer: {
    height: height * (isTablet ? 0.4 : 0.35),
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
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
    ...(isTablet && {
      margin: 24,
    }),
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
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
    ...(isTablet && {
      marginHorizontal: 24,
      padding: 24,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    ...(isTablet && {
      width: '48%',
      paddingVertical: 12,
    }),
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    ...(isTablet && {
      fontSize: 16,
    }),
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    ...(isTablet && {
      fontSize: 16,
    }),
  },
  productsSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
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
    ...(isTablet && {
      marginHorizontal: 24,
      padding: 24,
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    ...(isTablet && {
      fontSize: 24,
      marginBottom: 12,
    }),
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    ...(isTablet && {
      fontSize: 16,
      lineHeight: 24,
    }),
  },
  productsList: {
    marginTop: 12,
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
    ...(isTablet && {
      padding: 20,
    }),
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
    ...(isTablet && {
      fontSize: 18,
    }),
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  discountBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    ...(isTablet && {
      fontSize: 14,
    }),
  },
  productPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    ...(isTablet && {
      fontSize: 16,
    }),
  },
  discountPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
    ...(isTablet && {
      fontSize: 24,
    }),
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

