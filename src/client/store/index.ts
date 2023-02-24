import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { authAPI } from '../services/AuthService';
import { filesAPI } from '../services/FilesService';
import cloudReducer from './reducers/CloudSlice';
import userReducer from './reducers/UserSlice';
import modalReducer from './reducers/ModalSlice';

const rootReducer = combineReducers({
	userReducer,
	cloudReducer,
	modalReducer,
	[authAPI.reducerPath]: authAPI.reducer,
	[filesAPI.reducerPath]: filesAPI.reducer
});

export const makeStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(
				authAPI.middleware,
				filesAPI.middleware
			)
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const wrapper = createWrapper<AppStore>(makeStore);