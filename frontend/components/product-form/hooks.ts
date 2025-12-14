import { productService } from "@/services/productService.graphql";
import { supermarketService } from "@/services/supermarketService";
import { Supermarket } from "@/types/supermarket";
import { useCallback, useEffect, useState } from "react";

export const useSupermarkets = () => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSupermarkets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supermarketService.getAllSupermarkets();
      setSupermarkets(data);
    } catch (err) {
      setError("Erro ao carregar supermercados");
      console.error("Error loading supermarkets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSupermarkets();
  }, [loadSupermarkets]);

  return { supermarkets, loading, error, reload: loadSupermarkets };
};

export const useProduct = (productId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!productId) return null;

    try {
      setLoading(true);
      setError(null);
      const product = await productService.getProductById(productId);
      return product;
    } catch (err) {
      setError("Erro ao carregar produto");
      console.error("Error loading product:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [productId]);

  return { loadProduct, loading, error };
};
