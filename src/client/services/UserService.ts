import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	FetchBaseQueryError
} from '@reduxjs/toolkit/dist/query/react';
import { handleApiError, handleApiLoading, handleApiSuccess } from '../components/Notifications';
import { IUser } from '../models/IUser';
import { clearUser } from '../store/reducers/UserSlice';
import { refreshPage } from '../utils';
import { setUserOnQueryFulfilled } from './AuthService';
import { baseQuery } from './config';

const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		const refreshResult: any = await baseQuery({ url: '/refresh', method: 'GET' }, api, extraOptions);
		if (refreshResult.data) {
			setUserOnQueryFulfilled(refreshResult.data, api.dispatch);
			result = await baseQuery(args, api, extraOptions);
		} else {
			await baseQuery({ url: '/sign-out', method: 'DELETE' }, api, extraOptions);
			api.dispatch(clearUser());
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