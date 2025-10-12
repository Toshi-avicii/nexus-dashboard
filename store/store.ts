import storage from 'redux-persist/es/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth.slice';
import profileReducer from './slices/profile.slice';

const persistConfig = {
    key: "root",
    storage,
    whitelist: ['auth', 'profile']
}

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Avoid warnings with redux-persist
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch