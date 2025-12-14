import { DiscountItem } from "@/types/supermarket";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductsState {
  items: DiscountItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<DiscountItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addProduct: (state, action: PayloadAction<DiscountItem>) => {
      state.items.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<DiscountItem>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearProducts: (state) => {
      state.items = [];
      state.error = null;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setLoading,
  setError,
  clearProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
