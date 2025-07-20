import { configureStore } from "@reduxjs/toolkit";
import { cardSlice } from "./apiSlice/CardSlice.ts";
import { authSlice } from "./apiSlice/AuthSlice.ts";
import { serviceSlice } from "./apiSlice/ServiceSlice.ts";
import { soldServiceSlice } from "./apiSlice/Soldslice.ts";

export const store = configureStore({
  reducer: {
    [cardSlice.reducerPath]: cardSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    [serviceSlice.reducerPath]: serviceSlice.reducer,
    [soldServiceSlice.reducerPath]: soldServiceSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      cardSlice.middleware,
      authSlice.middleware,
      serviceSlice.middleware,
      soldServiceSlice.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
