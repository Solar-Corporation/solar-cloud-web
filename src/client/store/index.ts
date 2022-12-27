import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { authAPI } from '../services/AuthService';
import { filesAPI } from '../services/FilesService';
import userReducer from './reducers/UserSlice';

const rootReducer = combineReducers({
	userReducer,
	[authAPI.reducerPath]: authAPI.reducer,
	[filesAPI.reducerPath]: filesAPI.reducer
});

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(
				authAPI.middleware,
				filesAPI.middleware
			)
	});
};

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const wrapper = createWrapper<AppStore>(setupStore);