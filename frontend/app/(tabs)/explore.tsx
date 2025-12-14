import { SupermarketList } from '@/components/SupermarketList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Box } from '@/components/ui/box';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useProducts } from '@/hooks/useProducts';
import { useSupermarkets } from '@/hooks/useSupermarkets';
import React from 'react';
import { Alert, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function ExploreScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { supermarkets, deleteSupermarket, loading: loadingSupermarkets, error: supermarketsError } = useSupermarkets();
  const { products, loading: loadingProducts, error: productsError } = useProducts();

  const handleDeleteSupermarket = async (id: string) => {
    try {
      await deleteSupermarket(id);
      Alert.alert('Sucesso', 'Supermercado excluído com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o supermercado');
      console.error('Error deleting supermarket:', error);
    }
  };

  const hasError = supermarketsError || productsError;

  return (
    <ThemedView
      className="flex-1 flex-col"
      style={{ backgroundColor: colors.backgroundSecondary }}
      edges={['top', 'left', 'right']}>
      <Box
        className={`p-4 ${isTablet ? 'p-6 items-center' : ''} ${
          theme === 'dark'
            ? 'shadow-lg'
            : 'shadow-sm'
        }`}
        style={{ backgroundColor: colors.background }}>
        <ThemedText type="title" className={isTablet ? 'text-4xl mb-3' : 'mb-2'}>
          Supermercados
        </ThemedText>
        <ThemedText className={isTablet ? 'text-lg' : 'text-sm'}>
          Encontre produtos com desconto próximos ao vencimento
        </ThemedText>
        {hasError && (
          <ThemedText className="text-sm text-orange-500 mt-2">
            ⚠️ Modo offline: Alguns recursos podem não estar disponíveis
          </ThemedText>
        )}
      </Box>
      <Box className={`flex-1 w-full ${isTablet ? 'max-w-[1200px] self-center w-[90%]' : ''}`}>
        <SupermarketList
          supermarkets={supermarkets}
          products={products}
          onDeleteSupermarket={handleDeleteSupermarket}
        />
      </Box>
    </ThemedView>
  );
}
