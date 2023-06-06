import { createApi } from '@reduxjs/toolkit/dist/query/react';
import jwt from 'jwt-decode';
import Router from 'next/router';
import { setCookie } from 'nookies';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { handleApiError } from '../components/Notifications';
import { IAuth, IRegister, IToken } from '../models/IAuth';
import { RouteNames } from '../router';
import { clearUser, setUser, UserState } from '../store/reducers/UserSlice';
import { baseQuery } from './config';

export const setUserOnQueryFulfilled = (data: IToken, dispatch: ThunkDispatch<any, any, AnyAction>) => {
	const user: UserState = {
		data: jwt(data.access),
		accessToken: data.access,
		refreshToken: data.refresh
	};
	setCookie(null, 'accessToken', data.access, { maxAge: 30 * 24 * 60 * 60, path: '/' });
	dispatch(setUser(user));
};

export const authAPI = createApi({
	reducerPath: 'authAPI',
	baseQuery,
	endpoints: (build) => ({
		userLogin: build.mutation<IToken, { data: IAuth, redirect: string | null }>({
			query: ({ data }) => ({
				url: '/sign-in',
				method: 'POST',
				body: data
			}),
			async onQueryStarted({ redirect }, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					setUserOnQueryFulfilled(data, dispatch);
					await Router.push(redirect || RouteNames.FILES);
				} catch (error) {
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
			async onQueryStarted(args, { queryFulfilled }) {
				try {
					await queryFulfilled;
					await Router.push(RouteNames.LOGIN);
				} catch (error) {
					console.log(error);
					await handleApiError(error);
				}
			}
		}),
		userLogout: build.mutation<null, void>({
			query: () => ({ url: '/sign-out', method: 'DELETE' }),
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (error) {
					handleApiError(error);
				}
				dispatch(clearUser());
			}
		})
	})
});