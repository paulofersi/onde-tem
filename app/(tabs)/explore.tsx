import { SupermarketList } from '@/components/SupermarketList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { productService } from '@/services/productService';
import { supermarketService } from '@/services/supermarketService';
import { DiscountItem, Supermarket } from '@/types/supermarket';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Dimensions, Platform, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function ExploreScreen() {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [products, setProducts] = useState<DiscountItem[]>([]);

  const loadSupermarkets = useCallback(async () => {
    try {
      const supermarketsData = await supermarketService.getAllSupermarkets();
      const productsData = await productService.getAllProducts();
      setSupermarkets(supermarketsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar supermercados:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSupermarkets();
    }, [loadSupermarkets])
  );

  const handleDeleteSupermarket = async (id: string) => {
    try {
      await supermarketService.deleteSupermarket(id);
      await loadSupermarkets();
      Alert.alert('Sucesso', 'Supermercado excluído com sucesso');
    } catch (error) {
      throw error;
    }
  };

  return (
    <ThemedView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <ThemedText type="title" style={[styles.title, isTablet && styles.titleTablet]}>
          Supermercados
        </ThemedText>
        <ThemedText style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
          Encontre produtos com desconto próximos ao vencimento
        </ThemedText>
      </View>
      <View style={[styles.listContainer, isTablet && styles.listContainerTablet]}>
        <SupermarketList 
          supermarkets={supermarkets}
          products={products}
          onDeleteSupermarket={handleDeleteSupermarket}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    paddingTop: 16,
    backgroundColor: '#ffffff',
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
  },
  headerTablet: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 80 : 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titleTablet: {
    fontSize: 36,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  subtitleTablet: {
    fontSize: 18,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  listContainerTablet: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '90%',
  },
});
