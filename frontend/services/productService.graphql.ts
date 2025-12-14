import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} from "@/graphql/mutations";
import { GET_PRODUCTS, GET_PRODUCT_BY_ID } from "@/graphql/queries";
import { apolloClient } from "@/lib/apollo-client";
import { DiscountItem } from "@/types/supermarket";
import type { FetchPolicy } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PRODUCTS_STORAGE_KEY = "@onde_tem:products";

export const productService = {
  async getAllProducts(): Promise<DiscountItem[]> {
    try {
      const { data } = await apolloClient.query({
        query: GET_PRODUCTS,
        fetchPolicy: "cache-first" as FetchPolicy,
        errorPolicy: "all",
      });
      return data?.products || [];
    } catch (error) {
      try {
        const data = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (data) {
          return JSON.parse(data);
        }
      } catch (storageError) {
        // Ignore storage errors
      }
      return [];
    }
  },

  async getProductById(id: string): Promise<DiscountItem | null> {
    try {
      const { data } = await apolloClient.query({
        query: GET_PRODUCT_BY_ID,
        variables: { id },
      });
      return data?.product || null;
    } catch (error) {
      try {
        const products = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (products) {
          const parsed = JSON.parse(products);
          const product = parsed.find((p: DiscountItem) => p.id === id);
          if (product) {
            return {
              ...product,
              image: product.image,
            };
          }
        }
      } catch {}
      return null;
    }
  },

  async createProduct(
    product: Omit<DiscountItem, "id">
  ): Promise<DiscountItem> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_PRODUCT,
        variables: { input: product },
      });
      return data?.createProduct;
    } catch (error) {
      throw error;
    }
  },

  async updateProduct(
    id: string,
    product: Partial<DiscountItem>
  ): Promise<DiscountItem | null> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_PRODUCT,
        variables: { id, input: product },
      });
      return data?.updateProduct || null;
    } catch (error) {
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_PRODUCT,
        variables: { id },
      });
      return data?.deleteProduct || false;
    } catch (error) {
      return false;
    }
  },
};
