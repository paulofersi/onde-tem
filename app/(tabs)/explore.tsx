import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { SupermarketList } from '@/components/SupermarketList';
import { mockSupermarkets } from '@/data/mockSupermarkets';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <ThemedText type="title" style={[styles.title, isTablet && styles.titleTablet]}>
          Supermercados
        </ThemedText>
        <ThemedText style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
          Encontre produtos com desconto próximos ao vencimento
        </ThemedText>
      </View>
      <View style={[styles.listContainer, isTablet && styles.listContainerTablet]}>
        <SupermarketList supermarkets={mockSupermarkets} />
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
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
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
