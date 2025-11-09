import { DiscountItem } from "@/types/supermarket";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PRODUCTS_STORAGE_KEY = "@onde_tem:products";

export const productService = {
  async getAllProducts(): Promise<DiscountItem[]> {
    try {
      const data = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  },

  async getProductById(id: string): Promise<DiscountItem | null> {
    try {
      const products = await this.getAllProducts();
      return products.find((p) => p.id === id) || null;
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      return null;
    }
  },

  async createProduct(
    product: Omit<DiscountItem, "id">
  ): Promise<DiscountItem> {
    try {
      const products = await this.getAllProducts();
      const newProduct: DiscountItem = {
        ...product,
        id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      products.push(newProduct);
      await AsyncStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(products)
      );
      return newProduct;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  },

  async updateProduct(
    id: string,
    product: Partial<DiscountItem>
  ): Promise<DiscountItem | null> {
    try {
      const products = await this.getAllProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) {
        return null;
      }
      products[index] = { ...products[index], ...product };
      await AsyncStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(products)
      );
      return products[index];
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const products = await this.getAllProducts();
      const filteredProducts = products.filter((p) => p.id !== id);
      await AsyncStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(filteredProducts)
      );
      return true;
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return false;
    }
  },

  async clearAllProducts(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PRODUCTS_STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar produtos:", error);
      throw error;
    }
  },
};
