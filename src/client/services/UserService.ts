import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	FetchBaseQueryError
} from '@reduxjs/toolkit/dist/query/react';
import Router from 'next/router';
import { handleApiError, handleApiLoading, handleApiSuccess } from '../components/Notifications';
import { IUser } from '../models/IUser';
import { RouteNames } from '../router';
import { refreshPage } from '../utils';
import { clearUserOnQueryFulfilled } from './AuthService';
import { baseQuery } from './config';

const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		const refreshResult = await baseQuery('/refresh', api, extraOptions);
		if (refreshResult.data) {
			result = await baseQuery(args, api, extraOptions);
		} else {
			await baseQuery('/sign-out', api, extraOptions);
			clearUserOnQueryFulfilled(api.dispatch);
			if (typeof window !== 'undefined') {
				if (Router.pathname === RouteNames.FILES || Router.pathname === RouteNames.DIRECTORY) {
					await Router.push(RouteNames.LOGIN);
				} else {
					await Router.push(`${RouteNames.LOGIN}?return_to=${Router.pathname}`);
				}
			}
		}
	}

	return result;
};

export const userAPI = createApi({
	reducerPath: 'userAPI',
	baseQuery: baseQueryWithRefresh,
	endpoints: (build) => ({
		getUsers: build.query<IUser[], void>({
			query: () => ({ url: '/settings/users' }),
			async onQueryStarted(args, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (error) {
					console.log(error);
				}
			}
		}),
		acceptUser: build.mutation<null, number>({
			query: (id) => ({
				url: `/settings/users/${id}`,
				method: 'PUT'
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Подтверждение заявки...',
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Пользователь подтвержден!'
					});
					await refreshPage();
				} catch (error) {
					handleApiError(error, key);
				}
			}
		}),
		deleteUser: build.mutation<null, number>({
			query: (id) => ({
				url: `/settings/users/${id}`,
				method: 'DELETE'
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Удаление пользователя...',
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Пользователь удалён!'
					});
					await refreshPage();
				} catch (error) {
					handleApiError(error, key);
				}
			}
		})
	})
});