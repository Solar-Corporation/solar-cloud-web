import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError
} from '@reduxjs/toolkit/dist/query/react';
import { message } from 'antd';
import { RcFile } from 'antd/es/upload';
import Router from 'next/router';
import { IDirectory, IFile, IUpload } from '../models/IFile';
import { RouteNames } from '../router';
import { AppState } from '../store';
import { setIsModalOpen } from '../store/reducers/ModalSlice';
import { apiUrl, handleApiError } from './config';

const getFormData = (data: IUpload) => {
	const formData = new FormData();
	formData.append('path', data.path);

	data.files.forEach((file) => {
		formData.append('files[]', file as RcFile);
	});

	return formData;
};

const baseQuery = fetchBaseQuery({
	baseUrl: apiUrl,
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
		getFiles: build.query<IFile[], string>({
			query: (path) => ({
				url: '/files',
				params: { path }
			}),
			async onQueryStarted(args, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (error) {
					console.log(error);
				}
			}
		}),
		uploadFiles: build.mutation<any, IUpload>({
			query: (data) => ({
				url: '/files',
				method: 'POST',
				body: getFormData(data)
			}),
			async onQueryStarted(args, { queryFulfilled }) {
				const key = `${Date.now}`;
				try {
					message.open({
						key,
						type: 'loading',
						content: args.files.length > 1 ? 'Загрузка файлов...' : 'Загрузка файла...',
						duration: 0
					});
					await queryFulfilled;
					message.open({
						key,
						type: 'success',
						content: args.files.length > 1 ? 'Файлы успешно загружены!' : 'Файл успешно загружен!'
					});
					await Router.replace(Router.asPath);
				} catch (error) {
					console.log(error);
					await handleApiError(error, key);
				}
			}
		}),
		uploadDirectory: build.mutation<any, { directory: IDirectory, files: RcFile[] }>({
			query: ({ directory }) => ({
				url: '/directories',
				method: 'POST',
				body: directory
			}),
			async onQueryStarted({ directory, files }, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
					const path = directory.path === '/' ? `${directory.path}${directory.name}` : `${directory.path}/${directory.name}`;
					const upload: IUpload = { path, files };
					await dispatch(filesAPI.endpoints.uploadFiles.initiate(upload));
				} catch (error) {
					await handleApiError(error);
				}
			}
		}),
		createDirectory: build.mutation<any, { directory: IDirectory, relocate: boolean }>({
			query: ({ directory }) => ({
				url: '/directories',
				method: 'POST',
				body: directory
			}),
			async onQueryStarted({ directory, relocate }, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
					dispatch(setIsModalOpen({ createDirectory: false }));
					message.success('Папка успешно создана!');
					if (relocate) {
						const path = directory.path === '/' ? `${directory.path}${directory.name}` : `${directory.path}/${directory.name}`;
						await Router.push(`${RouteNames.CLOUD}?path=${path}`);
					} else {
						await Router.replace(Router.asPath);
					}
				} catch (error) {
					await handleApiError(error);
				}
			}
		}),
		renameFile: build.mutation<any, { path: string, new_name: string, isDir: boolean }>({
			query: ({ path, new_name }) => ({
				url: `/files${path}`,
				method: 'PUT',
				params: { new_name }
			}),
			async onQueryStarted({ isDir }, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
					dispatch(setIsModalOpen({ renameFile: false }));
					message.success(isDir ? 'Папка переименована!' : 'Файл переименован!');
					await Router.replace(Router.asPath);
				} catch (error) {
					await handleApiError(error);
				}
			}
		})
	})
});