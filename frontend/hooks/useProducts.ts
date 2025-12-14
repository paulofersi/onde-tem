import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} from "@/graphql/mutations";
import { GET_PRODUCTS } from "@/graphql/queries";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addProduct,
  deleteProduct,
  setError,
  setLoading,
  setProducts,
  updateProduct,
} from "@/store/slices/productsSlice";
import { DiscountItem } from "@/types/supermarket";
import { useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const PRODUCTS_STORAGE_KEY = "@onde_tem:products";

export function useProducts() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.products);

  // Verificar se tem token para usar GraphQL
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("@onde_tem:token");
      setHasToken(!!token);
    };
    checkToken();
  }, []);

  // Query GraphQL
  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(GET_PRODUCTS, {
    skip: !hasToken,
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data?.products) {
        dispatch(setProducts(data.products));
      }
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  // Mutations
  const [createProductMutation] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.createProduct) {
        dispatch(addProduct(data.createProduct));
      }
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  const [updateProductMutation] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.updateProduct) {
        dispatch(updateProduct(data.updateProduct));
      }
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  const [deleteProductMutation] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    onCompleted: () => {
      // O produto já foi removido do cache do Apollo
      // Precisamos atualizar o Redux manualmente após a mutation
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  // Atualizar loading state
  useEffect(() => {
    dispatch(setLoading(queryLoading));
  }, [queryLoading, dispatch]);

  // Funções para criar, atualizar e deletar
  const createProduct = async (product: Omit<DiscountItem, "id">) => {
    try {
      if (hasToken) {
        const { data } = await createProductMutation({
          variables: { input: product },
        });
        return data?.createProduct;
      } else {
        // Fallback para AsyncStorage
        const newProduct: DiscountItem = {
          ...product,
          id: `product-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        };
        dispatch(addProduct(newProduct));
        const products = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        const productsList = products ? JSON.parse(products) : [];
        productsList.push(newProduct);
        await AsyncStorage.setItem(
          PRODUCTS_STORAGE_KEY,
          JSON.stringify(productsList)
        );
        return newProduct;
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const updateProductById = async (
    id: string,
    product: Partial<DiscountItem>
  ) => {
    try {
      if (hasToken) {
        const { data } = await updateProductMutation({
          variables: { id, input: product },
        });
        return data?.updateProduct;
      } else {
        // Fallback para AsyncStorage
        const updatedProduct = {
          ...items.find((p) => p.id === id),
          ...product,
        } as DiscountItem;
        dispatch(updateProduct(updatedProduct));
        const products = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        const productsList = products ? JSON.parse(products) : [];
        const index = productsList.findIndex((p: DiscountItem) => p.id === id);
        if (index !== -1) {
          productsList[index] = updatedProduct;
          await AsyncStorage.setItem(
            PRODUCTS_STORAGE_KEY,
            JSON.stringify(productsList)
          );
        }
        return updatedProduct;
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const deleteProductById = async (id: string) => {
    try {
      if (hasToken) {
        await deleteProductMutation({ variables: { id } });
        dispatch(deleteProduct(id));
      } else {
        // Fallback para AsyncStorage
        dispatch(deleteProduct(id));
        const products = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        const productsList = products ? JSON.parse(products) : [];
        const filtered = productsList.filter((p: DiscountItem) => p.id !== id);
        await AsyncStorage.setItem(
          PRODUCTS_STORAGE_KEY,
          JSON.stringify(filtered)
        );
      }
      return true;
    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    }
  };

  return {
    products: items,
    loading: loading || queryLoading,
    error: error || queryError?.message || null,
    refetch,
    createProduct,
    updateProduct: updateProductById,
    deleteProduct: deleteProductById,
  };
}
