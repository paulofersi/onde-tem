import { Supermarket } from "@/types/supermarket";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SupermarketsState {
  items: Supermarket[];
  loading: boolean;
  error: string | null;
  selectedSupermarket: Supermarket | null;
}

const initialState: SupermarketsState = {
  items: [],
  loading: false,
  error: null,
  selectedSupermarket: null,
};

const supermarketsSlice = createSlice({
  name: "supermarkets",
  initialState,
  reducers: {
    setSupermarkets: (state, action: PayloadAction<Supermarket[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSupermarket: (state, action: PayloadAction<Supermarket>) => {
      state.items.push(action.payload);
    },
    updateSupermarket: (state, action: PayloadAction<Supermarket>) => {
      const index = state.items.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteSupermarket: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((s) => s.id !== action.payload);
    },
    setSelectedSupermarket: (
      state,
      action: PayloadAction<Supermarket | null>
    ) => {
      state.selectedSupermarket = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSupermarkets: (state) => {
      state.items = [];
      state.selectedSupermarket = null;
      state.error = null;
    },
  },
});

export const {
  setSupermarkets,
  addSupermarket,
  updateSupermarket,
  deleteSupermarket,
  setSelectedSupermarket,
  setLoading,
  setError,
  clearSupermarkets,
} = supermarketsSlice.actions;

export default supermarketsSlice.reducer;
