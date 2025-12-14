import { DiscountBox } from '@/components/product-form/DiscountBox';
import { FormFooter } from '@/components/product-form/FormFooter';
import { useProduct, useSupermarkets } from '@/components/product-form/hooks';
import { LoadingScreen } from '@/components/product-form/LoadingScreen';
import { SupermarketSelect } from '@/components/product-form/SupermarketSelect';
import { FormData } from '@/components/product-form/types';
import { calculateDiscountPercentage, formatCurrency, parsePrice, validateForm } from '@/components/product-form/utils';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Box } from '@/components/ui/box';
import { Input } from '@/components/ui/input';
import { productService } from '@/services/productService.graphql';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';

export default function ProductFormScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const isEdit = !!params.id;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    originalPrice: '',
    discountPrice: '',
    supermarketId: '',
    image: undefined,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const { supermarkets, loading: loadingSupermarkets } = useSupermarkets();
  const { loadProduct } = useProduct(params.id as string | undefined);

  useEffect(() => {
    const loadProductData = async () => {
      if (isEdit && params.id) {
        setIsLoadingProduct(true);
        const product = await loadProduct();
        if (product) {
          setFormData({
            name: product.name,
            originalPrice: product.originalPrice.toFixed(2),
            discountPrice: product.discountPrice.toFixed(2),
            supermarketId: product.supermarketId,
            image: product.image,
          });
          setImageUri(product.image || null);
          setImageBase64(product.image || null);
        }
        setIsLoadingProduct(false);
      }
    };

    loadProductData();
  }, [isEdit, params.id, loadProduct]);

  useEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Editar Produto' : 'Novo Produto',
    });
  }, [navigation, isEdit]);

  const handleFieldChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
  }, []);

  const handlePriceChange = useCallback((field: 'originalPrice' | 'discountPrice', value: string) => {
    const formatted = formatCurrency(value);
    handleFieldChange(field, formatted);
  }, [handleFieldChange]);

  const convertImageToBase64 = useCallback(async (uri: string): Promise<string | null> => {
    try {
      if (uri.startsWith('data:image/')) {
        return uri;
      }
      
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        return uri;
      }
      
      if (uri.startsWith('file://')) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        const extension = uri.toLowerCase().split('.').pop();
        let mimeType = 'image/jpeg';
        
        if (extension === 'png') {
          mimeType = 'image/png';
        } else if (extension === 'gif') {
          mimeType = 'image/gif';
        } else if (extension === 'webp') {
          mimeType = 'image/webp';
        }
        
        const base64DataUri = `data:${mimeType};base64,${base64}`;
        return base64DataUri;
      }
      
      return uri;
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível converter a imagem. Tente novamente.');
      return null;
    }
  }, []);

  const pickImage = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'É necessário permitir acesso à galeria de fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        
        const base64 = await convertImageToBase64(uri);
        if (base64) {
          setImageBase64(base64);
          handleFieldChange('image', base64);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  }, [handleFieldChange, convertImageToBase64]);

  const takePhoto = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'É necessário permitir acesso à câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        
        const base64 = await convertImageToBase64(uri);
        if (base64) {
          setImageBase64(base64);
          handleFieldChange('image', base64);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  }, [handleFieldChange, convertImageToBase64]);

  const removeImage = useCallback(() => {
    setImageUri(null);
    setImageBase64(null);
    handleFieldChange('image', '');
  }, [handleFieldChange]);

  const handleSave = useCallback(async () => {
    const errors = validateForm(formData, supermarkets);
    
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0] as string;
      Alert.alert('Erro de Validação', firstError);
      return;
    }

    setIsSaving(true);

    try {
      const original = parsePrice(formData.originalPrice);
      const discount = parsePrice(formData.discountPrice);
      const discountPercentage = calculateDiscountPercentage(original, discount);

      let finalImage: string | undefined = undefined;
      if (imageBase64) {
        finalImage = imageBase64;
      } else if (formData.image) {
        const converted = await convertImageToBase64(formData.image);
        if (!converted) {
          Alert.alert('Erro', 'Não foi possível processar a imagem. Tente novamente.');
          setIsSaving(false);
          return;
        }
        finalImage = converted;
      }

      const productData = {
        name: formData.name.trim(),
        originalPrice: original,
        discountPrice: discount,
        discountPercentage,
        supermarketId: formData.supermarketId,
        image: finalImage,
      };
      
      if (isEdit && params.id) {
        await productService.updateProduct(params.id as string, productData);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso', [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)/products');
            }
          },
        ]);
      } else {
        await productService.createProduct(productData);
        Alert.alert('Sucesso', 'Produto criado com sucesso', [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)/products');
            }
          },
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        `Não foi possível ${isEdit ? 'atualizar' : 'criar'} o produto. Tente novamente.`
      );
    } finally {
      setIsSaving(false);
    }
  }, [formData, supermarkets, isEdit, params.id, router, imageBase64, convertImageToBase64]);

  const discountPercentage = useMemo(() => {
    const original = parsePrice(formData.originalPrice);
    const discount = parsePrice(formData.discountPrice);
    
    if (original > 0 && discount > 0 && discount < original) {
      return calculateDiscountPercentage(original, discount);
    }
    return null;
  }, [formData.originalPrice, formData.discountPrice]);

  const canSave = useMemo(
    () => supermarkets.length > 0 && !isSaving && !isLoadingProduct,
    [supermarkets.length, isSaving, isLoadingProduct]
  );

  if (isLoadingProduct || loadingSupermarkets) {
    return <LoadingScreen />;
  }

  return (
    <ThemedView className="flex-1 bg-gray-50 dark:bg-gray-900" useSafeArea={false}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Box className="mb-6">
          <ThemedText className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Nome do Produto
          </ThemedText>
          <Input
            value={formData.name}
            onChangeText={(value) => handleFieldChange('name', value)}
            placeholder="Digite o nome do produto"
            editable={!isSaving}
          />
        </Box>

        <Box className="mb-6">
          <ThemedText className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Preço Original (R$)
          </ThemedText>
          <Input
            value={formData.originalPrice}
            onChangeText={(value) => handlePriceChange('originalPrice', value)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            editable={!isSaving}
          />
        </Box>

        <Box className="mb-6">
          <ThemedText className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Preço com Desconto (R$)
          </ThemedText>
          <Input
            value={formData.discountPrice}
            onChangeText={(value) => handlePriceChange('discountPrice', value)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            editable={!isSaving}
          />
        </Box>

        <Box className="mb-6">
          <ThemedText className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Supermercado
          </ThemedText>
          <SupermarketSelect
            supermarkets={supermarkets}
            selectedSupermarketId={formData.supermarketId}
            onValueChange={(value: string) => handleFieldChange('supermarketId', value)}
            disabled={isSaving}
          />
        </Box>

        <Box className="mb-6">
          <ThemedText className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Imagem do Produto
          </ThemedText>
          {imageUri ? (
            <View className="relative">
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: 200, borderRadius: 8 }}
                resizeMode="cover"
              />
              <TouchableOpacity
                className="absolute top-2 right-2 bg-red-500 rounded-full w-8 h-8 items-center justify-center"
                onPress={removeImage}
              >
                <ThemedText className="text-white font-bold text-lg">×</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-lg py-3 items-center justify-center"
                onPress={pickImage}
                disabled={isSaving}
              >
                <ThemedText className="text-white font-semibold">Galeria</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-lg py-3 items-center justify-center"
                onPress={takePhoto}
                disabled={isSaving}
              >
                <ThemedText className="text-white font-semibold">Câmera</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </Box>

        {discountPercentage !== null && (
          <DiscountBox
            discountPercentage={discountPercentage}
            originalPrice={formData.originalPrice}
            discountPrice={formData.discountPrice}
          />
        )}
      </ScrollView>

      <FormFooter
        isSaving={isSaving}
        canSave={canSave}
        isEdit={isEdit}
        onSave={handleSave}
      />
    </ThemedView>
  );
}