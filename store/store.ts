'use client';

import {
  combineReducers,
  configureStore,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import storage from './storage';
import {
  AuthSlice,
  AuthReducer,
  ProfileSlice,
} from './slices';

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: [AuthSlice.name, ProfileSlice.reducerPath],
  whiteList: [],
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  [AuthSlice.name]: persistReducer(authPersistConfig, AuthReducer),
  [ProfileSlice.reducerPath]: ProfileSlice.reducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: (options: any) => any) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      ProfileSlice.middleware,
    ]),
  devTools: process.env.NODE_ENV === 'development' ? true : false,
});

export const persistedStore = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type TAppState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type TAppDispatch = typeof store.dispatch;
export type TAppThunkDispatch = ThunkDispatch<TAppState, any, any>;
export const useAppDispatch = () => useDispatch<TAppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<TAppState> = useSelector;
