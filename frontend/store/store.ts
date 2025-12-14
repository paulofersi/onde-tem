import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import supermarketsReducer from "./slices/supermarketsSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    supermarkets: supermarketsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
