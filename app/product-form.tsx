import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/use-theme-color';
import { productService } from '@/services/productService';
import { supermarketService } from '@/services/supermarketService';
import { Supermarket } from '@/types/supermarket';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProductFormScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const isEdit = !!params.id;

  const [name, setName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [supermarketId, setSupermarketId] = useState('');
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    loadSupermarkets();
    if (isEdit && params.id) {
      loadProduct();
    }
  }, [isEdit, params.id]);

  useEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Editar Produto' : 'Novo Produto',
    });
  }, [navigation, isEdit]);

  const loadSupermarkets = async () => {
    try {
      const data = await supermarketService.getAllSupermarkets();
      setSupermarkets(data);
      if (data.length === 0) {
        setSupermarketId('');
      }
    } catch (error) {
      console.error('Erro ao carregar supermercados:', error);
    }
  };

  const loadProduct = async () => {
    try {
      const product = await productService.getProductById(params.id as string);
      if (product) {
        setName(product.name);
        setOriginalPrice(product.originalPrice.toString());
        setDiscountPrice(product.discountPrice.toString());
        setSupermarketId(product.supermarketId);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o produto');
    }
  };

  const calculateDiscountPercentage = (original: number, discount: number): number => {
    return Math.round(((original - discount) / original) * 100);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do produto');
      return;
    }

    if (!originalPrice || parseFloat(originalPrice) <= 0) {
      Alert.alert('Erro', 'Por favor, informe um preço original válido');
      return;
    }

    if (!discountPrice || parseFloat(discountPrice) <= 0) {
      Alert.alert('Erro', 'Por favor, informe um preço com desconto válido');
      return;
    }

    const original = parseFloat(originalPrice);
    const discount = parseFloat(discountPrice);

    if (discount >= original) {
      Alert.alert('Erro', 'O preço com desconto deve ser menor que o preço original');
      return;
    }

    if (!supermarketId) {
      Alert.alert('Erro', 'Por favor, selecione um supermercado');
      return;
    }

    try {
      const discountPercentage = calculateDiscountPercentage(original, discount);

      if (isEdit && params.id) {
        await productService.updateProduct(params.id as string, {
          name: name.trim(),
          originalPrice: original,
          discountPrice: discount,
          discountPercentage,
          supermarketId,
        });
        Alert.alert('Sucesso', 'Produto atualizado com sucesso', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        await productService.createProduct({
          name: name.trim(),
          originalPrice: original,
          discountPrice: discount,
          discountPercentage,
          supermarketId,
        });
        Alert.alert('Sucesso', 'Produto criado com sucesso', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o produto');
    }
  };

  const selectedSupermarket = supermarkets.find((s) => s.id === supermarketId);

  return (
    <ThemedView style={styles.container} useSafeArea={false}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Nome do Produto</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, backgroundColor }]}
            value={name}
            onChangeText={setName}
            placeholder="Digite o nome do produto"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Preço Original (R$)</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, backgroundColor }]}
            value={originalPrice}
            onChangeText={setOriginalPrice}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Preço com Desconto (R$)</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, backgroundColor }]}
            value={discountPrice}
            onChangeText={setDiscountPrice}
            placeholder="0.00"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Supermercado</ThemedText>
          {supermarkets.length === 0 ? (
            <ThemedText style={styles.emptyStateText}>Cadastre um supermercado primeiro.</ThemedText>
          ) : (
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={[styles.dropdownToggle, { backgroundColor }]}
                activeOpacity={0.8}
                onPress={() => setIsDropdownOpen((prev) => !prev)}>
                <ThemedText style={[styles.dropdownText, { color: selectedSupermarket ? textColor : '#999' }]}>
                  {selectedSupermarket ? selectedSupermarket.name : 'Selecione um supermercado'}
                </ThemedText>
                <ThemedText style={[styles.dropdownIcon, { color: textColor }]}>
                  {isDropdownOpen ? '▲' : '▼'}
                </ThemedText>
              </TouchableOpacity>
              {isDropdownOpen && (
                <View style={[styles.dropdownOptions, { backgroundColor }]}>
                  <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                    {supermarkets.map((supermarket) => {
                      const isSelected = supermarket.id === supermarketId;
                      return (
                        <TouchableOpacity
                          key={supermarket.id}
                          style={[
                            styles.dropdownOption,
                            isSelected && styles.dropdownOptionSelected,
                          ]}
                          onPress={() => {
                            setSupermarketId(supermarket.id);
                            setIsDropdownOpen(false);
                          }}>
                          <ThemedText
                            style={[
                              styles.dropdownOptionText,
                              isSelected && styles.dropdownOptionTextSelected,
                            ]}>
                            {supermarket.name}
                          </ThemedText>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </View>

        {originalPrice && discountPrice && parseFloat(originalPrice) > 0 && parseFloat(discountPrice) > 0 && (
          <View style={styles.discountInfo}>
            <ThemedText style={styles.discountLabel}>
              Desconto: {calculateDiscountPercentage(parseFloat(originalPrice), parseFloat(discountPrice))}%
            </ThemedText>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}>
          <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.saveButton,
            (supermarkets.length === 0) && styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={supermarkets.length === 0}>
          <ThemedText style={styles.saveButtonText}>Salvar</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  discountInfo: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  discountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownToggle: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownIcon: {
    fontSize: 12,
    marginLeft: 8,
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 6,
    maxHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
  },
  dropdownScroll: {
    maxHeight: 180,
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  dropdownOptionSelected: {
    backgroundColor: '#e8f5e9',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownOptionTextSelected: {
    color: '#2e7d32',
    fontWeight: '600',
  },
});
