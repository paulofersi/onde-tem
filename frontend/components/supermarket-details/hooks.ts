import { productService } from "@/services/productService.graphql";
import { supermarketService } from "@/services/supermarketService";
import { DiscountItem, Supermarket } from "@/types/supermarket";
import { useCallback, useEffect, useState } from "react";

interface UseSupermarketDetailsReturn {
  supermarket: Supermarket | null;
  discountItems: DiscountItem[];
  loading: boolean;
  reload: () => Promise<void>;
}

export const useSupermarketDetails = (
  id: string | undefined
): UseSupermarketDetailsReturn => {
  const [supermarket, setSupermarket] = useState<Supermarket | null>(null);
  const [discountItems, setDiscountItems] = useState<DiscountItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const supermarketData = await supermarketService.getSupermarketById(id);

      if (supermarketData) {
        setSupermarket(supermarketData);

        const allProducts = await productService.getAllProducts();
        const relatedProducts = allProducts.filter(
          (p) => p.supermarketId === id
        );
        setDiscountItems(relatedProducts);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { supermarket, discountItems, loading, reload: loadData };
};
