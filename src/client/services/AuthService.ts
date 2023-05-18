import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import jwt from 'jwt-decode';
import { destroyCookie, setCookie } from 'nookies';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { handleApiError } from '../components/Notifications';
import { IAuth, IRegister, IToken } from '../models/IAuth';
import { clearUser, setUser, UserState } from '../store/reducers/UserSlice';
import { apiUrl } from './config';

export const setUserOnQueryFulfilled = (data: IToken, dispatch: ThunkDispatch<any, any, AnyAction>) => {
	const user: UserState = {
		data: jwt(data.access),
		token: data.access
	};
	setCookie(null, 'accessToken', data.access, { maxAge: 30 * 24 * 60 * 60, path: '/' });
	dispatch(setUser(user));
};

export const clearUserOnQueryFulfilled = async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
	destroyCookie(null, 'accessToken');
	dispatch(clearUser());
};

export const authAPI = createApi({
	reducerPath: 'authAPI',
	baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
	endpoints: (build) => ({
		userLogin: build.mutation<IToken, IAuth>({
			query: (data) => ({
				url: '/sign-in',
				method: 'POST',
				body: data
			}),
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					setUserOnQueryFulfilled(data, dispatch);
				} catch (error) {
					await handleApiError(error);
				}
			}
		}),
		userRefresh: build.query<IToken, null>({
			query: () => ({ url: '/refresh' }),
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					setUserOnQueryFulfilled(data, dispatch);
				} catch (error) {
					console.log(error);
					await handleApiError(error);
				}
			}
		}),
		userRegister: build.mutation<IToken, IRegister>({
			query: (data) => ({
				url: '/sign-up',
				method: 'POST',
				body: data
			}),
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					setUserOnQueryFulfilled(data, dispatch);
				} catch (error) {
					console.log(error);
					await handleApiError(error);
				}
			}
		}),
		userLogout: build.mutation<null, void>({
			query: () => ({ url: '/sign-out', method: 'DELETE' }),
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				await queryFulfilled;
				await clearUserOnQueryFulfilled(dispatch);
			}
		})
	})
});