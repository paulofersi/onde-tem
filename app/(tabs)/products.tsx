import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { productService } from '@/services/productService';
import { supermarketService } from '@/services/supermarketService';
import { DiscountItem, Supermarket } from '@/types/supermarket';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function ProductsScreen() {
  const [products, setProducts] = useState<DiscountItem[]>([]);
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';

  const loadProducts = useCallback(async () => {
    try {
      const productsData = await productService.getAllProducts();
      const supermarketsData = await supermarketService.getAllSupermarkets();
      setProducts(productsData);
      setSupermarkets(supermarketsData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleAddProduct = () => {
    router.push('/product-form');
  };

  const handleEditProduct = (product: DiscountItem) => {
    router.push({
      pathname: '/product-form',
      params: {
        id: product.id,
      },
    });
  };

  const handleDeleteProduct = (product: DiscountItem) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o produto "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.deleteProduct(product.id);
              loadProducts();
              Alert.alert('Sucesso', 'Produto excluído com sucesso');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o produto');
            }
          },
        },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getSupermarketName = (supermarketId: string) => {
    const supermarket = supermarkets.find((s) => s.id === supermarketId);
    return supermarket?.name || 'Supermercado não encontrado';
  };

  const renderProduct = ({ item }: { item: DiscountItem }) => (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productInfo}>
          <ThemedText style={styles.productName}>{item.name}</ThemedText>
          <View style={styles.productPrices}>
            <ThemedText style={styles.originalPrice}>
              {formatPrice(item.originalPrice)}
            </ThemedText>
            <View style={{ width: 8 }} />
            <ThemedText style={styles.discountPrice}>
              {formatPrice(item.discountPrice)}
            </ThemedText>
          </View>
          <View style={styles.productFooter}>
            <ThemedText style={styles.supermarketLabel}>Supermercado:</ThemedText>
            <View style={{ width: 8 }} />
            <ThemedText style={styles.supermarketName}>
              {getSupermarketName(item.supermarketId)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.discountBadge}>
          <ThemedText style={styles.discountBadgeText}>
            -{item.discountPercentage}%
          </ThemedText>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditProduct(item)}>
          <IconSymbol name="pencil" size={18} color={Colors[colorScheme].tint} />
          <ThemedText style={styles.actionButtonText}>Editar</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProduct(item)}>
          <IconSymbol name="trash" size={18} color="#DC143C" />
          <ThemedText style={[styles.actionButtonText, { color: '#DC143C' }]}>
            Excluir
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>Carregando produtos...</ThemedText>
      </ThemedView>
    );
  }

  const hasSupermarkets = supermarkets.length > 0;

  return (
    <ThemedView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <ThemedText type="title" style={[styles.title, isTablet && styles.titleTablet]}>
          Produtos
        </ThemedText>
        <ThemedText style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
          Gerencie seus produtos com desconto
        </ThemedText>
      </View>

      <View style={styles.content}>
        {!hasSupermarkets ? (
          <View style={styles.emptyState}>
            <IconSymbol
              name="building.2"
              size={64}
              color={Colors[colorScheme].icon}
            />
            <ThemedText style={styles.emptyText}>
              Cadastre primeiro um supermercado
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Adicione um supermercado clicando no mapa.
            </ThemedText>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              name="cube.box"
              size={64}
              color={Colors[colorScheme].icon}
            />
            <ThemedText style={styles.emptyText}>
              Nenhum produto cadastrado
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Toque no botão + para adicionar um novo produto
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.fab, !hasSupermarkets && styles.fabDisabled]}
        onPress={handleAddProduct}
        disabled={!hasSupermarkets}>
        <IconSymbol name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  productPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expirationLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  expirationDate: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  supermarketLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  supermarketName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  discountBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  editButton: {
    backgroundColor: '#f0f0f0',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  fabDisabled: {
    backgroundColor: '#9e9e9e',
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});

