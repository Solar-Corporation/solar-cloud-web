import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError
} from '@reduxjs/toolkit/dist/query/react';
import { RootState } from '../store';
import { authAPI } from './AuthService';
import { apiUrl } from './config';


const baseQuery = fetchBaseQuery({
	baseUrl: `${apiUrl}`,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).userReducer.token;
		if (token) headers.set('Authorization', `Bearer ${token}`);
		return headers;
	}
});

const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);
	if (result.error && result.error.status === 401) {
		// try to get a new token
		const refreshResult = await authAPI.endpoints.userRefresh.initiate(null);
		console.log(refreshResult);
		// if (refreshResult.data) {
		// 	result = await baseQuery(args, api, extraOptions);
		// }
	}
	return result;
};

export const filesAPI = createApi({
	reducerPath: 'filesAPI',
	baseQuery: baseQueryWithRefresh,
	endpoints: (build) => ({
		getFiles: build.query<any, string>({
			query: (data) => ({
				url: '/files'
			})
		})
	})
});