import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { authAPI } from '../services/AuthService';
import { filesAPI } from '../services/FilesService';
import { userAPI } from '../services/UserService';
import cloudReducer from './reducers/CloudSlice';
import modalReducer from './reducers/ModalSlice';
import userReducer from './reducers/UserSlice';

const rootReducer = combineReducers({
	userReducer,
	cloudReducer,
	modalReducer,
	[authAPI.reducerPath]: authAPI.reducer,
	[filesAPI.reducerPath]: filesAPI.reducer,
	[userAPI.reducerPath]: userAPI.reducer
});

export const makeStore = () => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(
				authAPI.middleware,
				filesAPI.middleware,
				userAPI.middleware
			)
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const wrapper = createWrapper<AppStore>(makeStore);