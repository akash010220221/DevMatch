import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import feedReducer from "./feedSlice"
import connectionReducer from "./connectionSlice"
import requestReducer from "./requestSlice"
import { apiSlice } from "./apiSlice"

const appStore = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
        connections: connectionReducer,
        requests: requestReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
})


export default appStore;