import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useProducts } from '@/hooks/useProducts';
import { useSupermarkets } from '@/hooks/useSupermarkets';
import { DiscountItem, Supermarket } from '@/types/supermarket';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function ProductsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { user, logout } = useAuth();

  // Usando hooks do Redux e Apollo Client
  const {
    products,
    loading,
    error: productsError,
    refetch: refetchProducts,
    deleteProduct,
  } = useProducts();

  const {
    supermarkets,
    loading: supermarketsLoading,
    error: supermarketsError,
    refetch: refetchSupermarkets,
  } = useSupermarkets();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer logout');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchProducts(), refetchSupermarkets()]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados');
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Recarrega os dados quando volta para a tela
      refetchProducts();
      refetchSupermarkets();
    }, [refetchProducts, refetchSupermarkets])
  );

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
              await deleteProduct(product.id);
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
    const supermarket = supermarkets.find((s: Supermarket) => s.id === supermarketId);
    return supermarket?.name || 'Supermercado não encontrado';
  };

  const renderProduct = ({ item }: { item: DiscountItem }) => (
    <Card
      variant="elevated"
      className="mb-4 rounded-2xl border-l-4 border"
      style={[
        {
          borderLeftColor: colors.success,
          borderColor: colors.border,
        },
        getCardShadow(theme === 'dark'),
      ]}>
      <CardHeader size="md" className="pb-5">
        <Box className="flex-row justify-between items-start">
          <Box className="flex-1 mr-3">
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={{
                  width: '100%',
                  height: 120,
                  borderRadius: 8,
                  marginBottom: 12
                }}
                contentFit="cover"
                placeholder={require('@/assets/images/favicon.png')}
              />
            )}
            <ThemedText className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
              {item.name}
            </ThemedText>
            <Box className="flex-row items-center mb-3">
              <ThemedText className="text-sm line-through" style={{ color: colors.textTertiary }}>
                {formatPrice(item.originalPrice)}
              </ThemedText>
              <Box className="w-3" />
              <ThemedText className="text-xl font-bold" style={{ color: colors.success }}>
                {formatPrice(item.discountPrice)}
              </ThemedText>
            </Box>
            <Box className="flex-row items-center">
              <ThemedText className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                Supermercado:
              </ThemedText>
              <Box className="w-2" />
              <ThemedText className="text-xs font-semibold" style={{ color: colors.text }}>
                {getSupermarketName(item.supermarketId)}
              </ThemedText>
            </Box>
          </Box>
          <Box
            style={{ backgroundColor: colors.success }}
            className="rounded-xl px-3 py-2 min-w-[65px] items-center justify-center">
            <ThemedText className="text-sm font-bold text-white">
              -{item.discountPercentage}%
            </ThemedText>
          </Box>
        </Box>
      </CardHeader>
      <CardFooter size="md" className="pt-4">
        <Box className="flex-row gap-3">
          <TouchableOpacity
            style={[
              { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              },
              getButtonShadow(theme === 'dark'),
            ]}
            className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl border"
            onPress={() => handleEditProduct(item)}
            activeOpacity={0.7}>
            <IconSymbol name="pencil" size={18} color={colors.tint} />
            <Box className="w-2" />
            <ThemedText className="text-sm font-semibold" style={{ color: colors.text }}>
              Editar
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              { 
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              },
              getButtonShadow(theme === 'dark'),
            ]}
            className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl border"
            onPress={() => handleDeleteProduct(item)}
            activeOpacity={0.7}>
            <IconSymbol name="trash" size={18} color={colors.error} />
            <Box className="w-2" />
            <ThemedText className="text-sm font-semibold" style={{ color: colors.error }}>
              Excluir
            </ThemedText>
          </TouchableOpacity>
        </Box>
      </CardFooter>
    </Card>
  );

  if (loading || supermarketsLoading) {
    return (
      <ThemedView className="flex-1">
        <ThemedText className="text-base text-center mt-8">Carregando produtos...</ThemedText>
      </ThemedView>
    );
  }

  const hasSupermarkets = supermarkets.length > 0;

  return (
    <ThemedView 
      className="flex-1" 
      style={{ backgroundColor: colors.backgroundSecondary }}
      edges={['top', 'left', 'right']}>
      <Box 
        className={`p-4 ${isTablet ? 'p-6 items-center' : ''}`}
        style={[
          { backgroundColor: colors.background },
          getHeaderShadow(theme === 'dark'),
        ]}>
        <Box className="flex-row justify-between items-start">
          <Box className="flex-1">
            <ThemedText type="title" className={isTablet ? 'text-4xl mb-3' : 'mb-2'}>
              Produtos
            </ThemedText>
            <ThemedText className={isTablet ? 'text-lg' : 'text-sm'}>
              Veja os produtos com desconto
            </ThemedText>
            {user && (
              <ThemedText className="text-xs mt-1">
                Olá, {user.name}
              </ThemedText>
            )}
          </Box>
          {user && (
            <Button
              variant="outline"
              size="sm"
              onPress={handleLogout}
              className="ml-4">
              Sair
            </Button>
          )}
        </Box>
      </Box>

      <Box className="flex-1">
        {!hasSupermarkets ? (
          <Box className="flex-1 items-center justify-center p-8">
            <IconSymbol
              name="building.2"
              size={64}
              color={Colors[theme].icon}
            />
            <ThemedText className="text-lg font-semibold mt-4 mb-2">
              Cadastre primeiro um supermercado
            </ThemedText>
            <ThemedText className="text-sm text-center" style={{ color: colors.textSecondary }}>
              Adicione um supermercado clicando no mapa.
            </ThemedText>
          </Box>
        ) : products.length === 0 ? (
          <Box className="flex-1 items-center justify-center p-8">
            <IconSymbol
              name="cube.box"
              size={64}
              color={colors.icon}
            />
            <ThemedText className="text-lg font-semibold mt-4 mb-2">
              Nenhum produto cadastrado
            </ThemedText>
            <ThemedText className="text-sm text-center" style={{ color: colors.textSecondary }}>
              Toque no botão + para adicionar um novo produto
            </ThemedText>
          </Box>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        )}
      </Box>

      <TouchableOpacity
        className={`absolute right-5 bottom-5 w-14 h-14 rounded-full items-center justify-center ${!hasSupermarkets ? 'opacity-60' : ''}`}
        style={[
          {
            backgroundColor: colors.success,
          },
          getFloatingButtonShadow(theme === 'dark'),
        ]}
        onPress={handleAddProduct}
        disabled={!hasSupermarkets}>
        <IconSymbol name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const getHeaderShadow = (isDark: boolean) => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: isDark ? 2 : 1 },
  shadowOpacity: isDark ? 0.3 : 0.05,
  shadowRadius: isDark ? 4 : 2,
  elevation: isDark ? 4 : 2,
});

const getCardShadow = (isDark: boolean) => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: isDark ? 3 : 2 },
  shadowOpacity: isDark ? 0.25 : 0.06,
  shadowRadius: isDark ? 8 : 6,
  elevation: isDark ? 5 : 3,
});

const getButtonShadow = (isDark: boolean) => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: isDark ? 1 : 1 },
  shadowOpacity: isDark ? 0.2 : 0.03,
  shadowRadius: isDark ? 3 : 2,
  elevation: isDark ? 2 : 1,
});

const getFloatingButtonShadow = (isDark: boolean) => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: isDark ? 4 : 2 },
  shadowOpacity: isDark ? 0.3 : 0.2,
  shadowRadius: 4,
  elevation: isDark ? 6 : 4,
});
