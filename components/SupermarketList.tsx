import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Supermarket } from '@/types/supermarket';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface SupermarketListProps {
  supermarkets: Supermarket[];
}

export const SupermarketList: React.FC<SupermarketListProps> = ({ supermarkets }) => {
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

  const renderItem = ({ item }: { item: Supermarket }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.address && <Text style={styles.itemAddress}>{item.address}</Text>}
        {item.description && (
          <Text style={styles.itemDescription}>{item.description}</Text>
        )}
        {item.discountItems && item.discountItems.length > 0 && (
          <Text style={styles.discountBadge}>
            {item.discountItems.length} produto(s) com desconto
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

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
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flex: isTablet ? 0.48 : 1,
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
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  discountBadge: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 4,
  },
});

