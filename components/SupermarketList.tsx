import { SupermarketCard } from '@/components/SupermarketCard';
import { DiscountItem, Supermarket } from '@/types/supermarket';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, FlatList, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface SupermarketListProps {
  supermarkets: Supermarket[];
  products?: DiscountItem[];
  onDeleteSupermarket?: (id: string) => Promise<void>;
}

export const SupermarketList: React.FC<SupermarketListProps> = ({ 
  supermarkets,
  products = [],
  onDeleteSupermarket,
}) => {
  const router = useRouter();

  const handleItemPress = (supermarket: Supermarket) => {
    router.push({
      pathname: '/supermarket-details',
      params: {
        id: supermarket.id,
        name: supermarket.name,
        latitude: supermarket.latitude.toString(),
        longitude: supermarket.longitude.toString(),
        address: supermarket.address || '',
        description: supermarket.description || '',
      },
    });
  };

  const handleDeletePress = (supermarket: Supermarket) => {
    const hasProducts = products.some((p) => p.supermarketId === supermarket.id);
    
    if (hasProducts) {
      Alert.alert(
        'Não é possível excluir',
        'Este supermercado possui produtos cadastrados. Remova os produtos antes de excluir o supermercado.'
      );
      return;
    }

    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o supermercado "${supermarket.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (onDeleteSupermarket) {
              try {
                await onDeleteSupermarket(supermarket.id);
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível excluir o supermercado');
              }
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Supermarket }) => {
    const hasProducts = products.some((p) => p.supermarketId === item.id);
    const productCount = products.filter((p) => p.supermarketId === item.id).length;

    return (
      <SupermarketCard
        supermarket={item}
        productCount={productCount}
        onPress={handleItemPress}
        disableDelete={hasProducts}
        isTablet={isTablet}
        onDeletePress={
          onDeleteSupermarket ? () => handleDeletePress(item) : undefined
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={supermarkets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={isTablet ? 2 : 1}
        columnWrapperStyle={isTablet ? styles.row : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});

