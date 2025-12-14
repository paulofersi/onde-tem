import {
  CREATE_SUPERMARKET,
  DELETE_SUPERMARKET,
  UPDATE_SUPERMARKET,
} from "@/graphql/mutations";
import { GET_SUPERMARKETS, GET_SUPERMARKET_BY_ID } from "@/graphql/queries";
import { apolloClient } from "@/lib/apollo-client";
import { Supermarket } from "@/types/supermarket";
import type { FetchPolicy } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPERMARKETS_STORAGE_KEY = "@onde_tem:supermarkets";

const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  if (error.networkError) return true;

  const errorString = JSON.stringify(error);
  const errorMessage = (
    error.message ||
    error.toString() ||
    errorString ||
    ""
  ).toLowerCase();

  const networkErrorPatterns = [
    "network request failed",
    "failed to fetch",
    "networkerror",
    "econnrefused",
    "timeout",
    "invariant violation",
    "an error occurred",
    "fetch",
    "connection",
    "refused",
    "unreachable",
  ];

  if (networkErrorPatterns.some((pattern) => errorMessage.includes(pattern))) {
    return true;
  }

  if (error.code === "NETWORK_ERROR" || error.code === "ECONNREFUSED") {
    return true;
  }

  if (
    errorString.includes("Invariant Violation") ||
    errorString.includes("invariant")
  ) {
    return true;
  }

  return false;
};

export const supermarketService = {
  async getAllSupermarkets(): Promise<Supermarket[]> {
    try {
      const { data } = await apolloClient.query({
        query: GET_SUPERMARKETS,
        fetchPolicy: "cache-first" as FetchPolicy,
        errorPolicy: "all",
      });
      if (data?.supermarkets) {
        const supermarkets = data.supermarkets.map((s: any) => {
          const latitude =
            typeof s.latitude === "string"
              ? parseFloat(s.latitude)
              : s.latitude;
          const longitude =
            typeof s.longitude === "string"
              ? parseFloat(s.longitude)
              : s.longitude;
          return {
            ...s,
            latitude,
            longitude,
          };
        });
        return supermarkets;
      }
      return [];
    } catch (graphqlError) {
      try {
        const data = await AsyncStorage.getItem(SUPERMARKETS_STORAGE_KEY);
        if (data) {
          return JSON.parse(data);
        }
      } catch (storageError) {
        // Ignore storage errors
      }
      return [];
    }
  },

  async getSupermarketById(id: string): Promise<Supermarket | null> {
    try {
      const { data } = await apolloClient.query({
        query: GET_SUPERMARKET_BY_ID,
        variables: { id },
        errorPolicy: "all",
      });
      if (data?.supermarket) {
        const latitude =
          typeof data.supermarket.latitude === "string"
            ? parseFloat(data.supermarket.latitude)
            : data.supermarket.latitude;
        const longitude =
          typeof data.supermarket.longitude === "string"
            ? parseFloat(data.supermarket.longitude)
            : data.supermarket.longitude;
        return {
          ...data.supermarket,
          latitude,
          longitude,
        };
      }
      return null;
    } catch (graphqlError) {
      try {
        const data = await AsyncStorage.getItem(SUPERMARKETS_STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          return parsed.find((s: Supermarket) => s.id === id) || null;
        }
      } catch {}
      return null;
    }
  },

  async createSupermarket(
    supermarket: Omit<Supermarket, "id">
  ): Promise<Supermarket> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_SUPERMARKET,
        variables: { input: supermarket },
      });
      return data?.createSupermarket;
    } catch (error) {
      throw error;
    }
  },

  async updateSupermarket(
    id: string,
    supermarket: Partial<Supermarket>
  ): Promise<Supermarket | null> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_SUPERMARKET,
        variables: { id, input: supermarket },
      });
      return data?.updateSupermarket || null;
    } catch (error) {
      throw error;
    }
  },

  async deleteSupermarket(id: string): Promise<boolean> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_SUPERMARKET,
        variables: { id },
      });
      return data?.deleteSupermarket || false;
    } catch (error) {
      return false;
    }
  },
};
