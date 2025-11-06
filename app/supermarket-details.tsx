import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SupermarketDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const googleMapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey;

  const latitude = parseFloat(params.latitude as string) || -23.5505;
  const longitude = parseFloat(params.longitude as string) || -46.6333;
  const name = (params.name as string) || 'Supermercado';
  const address = (params.address as string) || '';
  const description = (params.description as string) || '';

  return (
    <ThemedView style={styles.container}>
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
          <ThemedText style={styles.sectionDescription}>
            Este supermercado possui produtos próximos ao vencimento com descontos
            especiais. Visite a loja para conferir as ofertas disponíveis.
          </ThemedText>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
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
});

