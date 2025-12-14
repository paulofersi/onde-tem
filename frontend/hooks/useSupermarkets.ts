import {
  CREATE_SUPERMARKET,
  DELETE_SUPERMARKET,
  UPDATE_SUPERMARKET,
} from "@/graphql/mutations";
import { GET_SUPERMARKETS } from "@/graphql/queries";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addSupermarket,
  deleteSupermarket,
  setError,
  setLoading,
  setSelectedSupermarket,
  setSupermarkets,
  updateSupermarket,
} from "@/store/slices/supermarketsSlice";
import { Supermarket } from "@/types/supermarket";
import { useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const SUPERMARKETS_STORAGE_KEY = "@onde_tem:supermarkets";

export function useSupermarkets() {
  const dispatch = useAppDispatch();
  const { items, loading, error, selectedSupermarket } = useAppSelector(
    (state) => state.supermarkets
  );

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
  } = useQuery(GET_SUPERMARKETS, {
    skip: !hasToken,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.supermarkets) {
        const supermarkets = data.supermarkets.map((s: any) => ({
          ...s,
          latitude:
            typeof s.latitude === "string"
              ? parseFloat(s.latitude)
              : s.latitude,
          longitude:
            typeof s.longitude === "string"
              ? parseFloat(s.longitude)
              : s.longitude,
        }));
        dispatch(setSupermarkets(supermarkets));
      }
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  // Mutations
  const [createSupermarketMutation] = useMutation(CREATE_SUPERMARKET, {
    refetchQueries: [{ query: GET_SUPERMARKETS }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.createSupermarket) {
        const newSupermarket = {
          ...data.createSupermarket,
          latitude:
            typeof data.createSupermarket.latitude === "string"
              ? parseFloat(data.createSupermarket.latitude)
              : data.createSupermarket.latitude,
          longitude:
            typeof data.createSupermarket.longitude === "string"
              ? parseFloat(data.createSupermarket.longitude)
              : data.createSupermarket.longitude,
        };
        dispatch(addSupermarket(newSupermarket));
      }
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  const [updateSupermarketMutation] = useMutation(UPDATE_SUPERMARKET, {
    refetchQueries: [{ query: GET_SUPERMARKETS }],
    onCompleted: (data) => {
      if (data?.updateSupermarket) {
        dispatch(updateSupermarket(data.updateSupermarket));
      }
    },
    onError: (error) => {
      dispatch(setError(error.message));
    },
  });

  const [deleteSupermarketMutation] = useMutation(DELETE_SUPERMARKET, {
    refetchQueries: [{ query: GET_SUPERMARKETS }],
    onCompleted: () => {
      // O supermercado já foi removido do cache do Apollo
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
  const createSupermarket = async (supermarket: Omit<Supermarket, "id">) => {
    try {
      if (hasToken) {
        const { data } = await createSupermarketMutation({
          variables: { input: supermarket },
        });
        return data?.createSupermarket;
      } else {
        // Fallback para AsyncStorage
        const newSupermarket: Supermarket = {
          ...supermarket,
          id: `supermarket-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        };
        dispatch(addSupermarket(newSupermarket));
        const supermarkets = await AsyncStorage.getItem(
          SUPERMARKETS_STORAGE_KEY
        );
        const supermarketsList = supermarkets ? JSON.parse(supermarkets) : [];
        supermarketsList.push(newSupermarket);
        await AsyncStorage.setItem(
          SUPERMARKETS_STORAGE_KEY,
          JSON.stringify(supermarketsList)
        );
        return newSupermarket;
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const updateSupermarketById = async (
    id: string,
    supermarket: Partial<Supermarket>
  ) => {
    try {
      if (hasToken) {
        const { data } = await updateSupermarketMutation({
          variables: { id, input: supermarket },
        });
        return data?.updateSupermarket;
      } else {
        // Fallback para AsyncStorage
        const updatedSupermarket = {
          ...items.find((s) => s.id === id),
          ...supermarket,
        } as Supermarket;
        dispatch(updateSupermarket(updatedSupermarket));
        const supermarkets = await AsyncStorage.getItem(
          SUPERMARKETS_STORAGE_KEY
        );
        const supermarketsList = supermarkets ? JSON.parse(supermarkets) : [];
        const index = supermarketsList.findIndex(
          (s: Supermarket) => s.id === id
        );
        if (index !== -1) {
          supermarketsList[index] = updatedSupermarket;
          await AsyncStorage.setItem(
            SUPERMARKETS_STORAGE_KEY,
            JSON.stringify(supermarketsList)
          );
        }
        return updatedSupermarket;
      }
    } catch (error: any) {
      dispatch(setError(error.message));
      throw error;
    }
  };

  const deleteSupermarketById = async (id: string) => {
    try {
      if (hasToken) {
        await deleteSupermarketMutation({ variables: { id } });
        dispatch(deleteSupermarket(id));
      } else {
        // Fallback para AsyncStorage
        dispatch(deleteSupermarket(id));
        const supermarkets = await AsyncStorage.getItem(
          SUPERMARKETS_STORAGE_KEY
        );
        const supermarketsList = supermarkets ? JSON.parse(supermarkets) : [];
        const filtered = supermarketsList.filter(
          (s: Supermarket) => s.id !== id
        );
        await AsyncStorage.setItem(
          SUPERMARKETS_STORAGE_KEY,
          JSON.stringify(filtered)
        );
      }
      return true;
    } catch (error: any) {
      dispatch(setError(error.message));
      return false;
    }
  };

  const selectSupermarket = (supermarket: Supermarket | null) => {
    dispatch(setSelectedSupermarket(supermarket));
  };

  return {
    supermarkets: items,
    selectedSupermarket,
    loading: loading || queryLoading,
    error: error || queryError?.message || null,
    refetch,
    createSupermarket,
    updateSupermarket: updateSupermarketById,
    deleteSupermarket: deleteSupermarketById,
    selectSupermarket,
  };
}
