import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError
} from '@reduxjs/toolkit/dist/query/react';
import { IFile } from '../models/IFile';
import { IUpload } from '../models/IUpload';
import { AppState } from '../store';
import { apiUrl } from './config';

const baseQuery = fetchBaseQuery({
	baseUrl: `${apiUrl}`,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as AppState).userReducer.token;
		if (token) headers.set('Authorization', `Bearer ${token}`);
		return headers;
	}
});

const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		const refreshResult = await baseQuery('/refresh', api, extraOptions);
		console.log('refresh', refreshResult);
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
		getFiles: build.query<IFile[], string | string[]>({
			query: (path) => ({
				url: '/files',
				params: { path }
			})
		}),
		uploadFiles: build.mutation<any, IUpload>({
			query: (data) => ({
				url: '/files',
				method: 'POST',
				credentials: 'include',
				body: data
			})
		})
	})
});