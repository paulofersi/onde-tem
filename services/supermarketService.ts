import { Supermarket } from "@/types/supermarket";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPERMARKETS_STORAGE_KEY = "@onde_tem:supermarkets";

export const supermarketService = {
  async getAllSupermarkets(): Promise<Supermarket[]> {
    try {
      const data = await AsyncStorage.getItem(SUPERMARKETS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar supermercados:", error);
      return [];
    }
  },

  async getSupermarketById(id: string): Promise<Supermarket | null> {
    try {
      const supermarkets = await this.getAllSupermarkets();
      return supermarkets.find((s) => s.id === id) || null;
    } catch (error) {
      console.error("Erro ao buscar supermercado:", error);
      return null;
    }
  },

  async createSupermarket(
    supermarket: Omit<Supermarket, "id">
  ): Promise<Supermarket> {
    try {
      const supermarkets = await this.getAllSupermarkets();
      const newSupermarket: Supermarket = {
        ...supermarket,
        id: `supermarket-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      };
      supermarkets.push(newSupermarket);
      await AsyncStorage.setItem(
        SUPERMARKETS_STORAGE_KEY,
        JSON.stringify(supermarkets)
      );
      return newSupermarket;
    } catch (error) {
      console.error("Erro ao criar supermercado:", error);
      throw error;
    }
  },

  async updateSupermarket(
    id: string,
    supermarket: Partial<Supermarket>
  ): Promise<Supermarket | null> {
    try {
      const supermarkets = await this.getAllSupermarkets();
      const index = supermarkets.findIndex((s) => s.id === id);
      if (index === -1) {
        return null;
      }
      supermarkets[index] = { ...supermarkets[index], ...supermarket };
      await AsyncStorage.setItem(
        SUPERMARKETS_STORAGE_KEY,
        JSON.stringify(supermarkets)
      );
      return supermarkets[index];
    } catch (error) {
      console.error("Erro ao atualizar supermercado:", error);
      throw error;
    }
  },

  async deleteSupermarket(id: string): Promise<boolean> {
    try {
      const supermarkets = await this.getAllSupermarkets();
      const filteredSupermarkets = supermarkets.filter((s) => s.id !== id);
      await AsyncStorage.setItem(
        SUPERMARKETS_STORAGE_KEY,
        JSON.stringify(filteredSupermarkets)
      );
      return true;
    } catch (error) {
      console.error("Erro ao deletar supermercado:", error);
      return false;
    }
  },

  async clearAllSupermarkets(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SUPERMARKETS_STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar supermercados:", error);
      throw error;
    }
  },
};
