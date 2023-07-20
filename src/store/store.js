import { configureStore } from "@reduxjs/toolkit";
import reducers from "./reducer";
import api from "./middlewares/api";

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).prepend([api]),
});
