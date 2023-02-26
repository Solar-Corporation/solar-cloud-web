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
import { markFile, setMarked, unMarkFile } from '../store/reducers/CloudSlice';
import { setIsModalOpen } from '../store/reducers/ModalSlice';
import { apiUrl, handleApiError } from './config';
import { refreshPage } from '../utils';

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
			async onQueryStarted(args, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;
					const marked = data.filter(file => file.isFavorite);
					dispatch(setMarked(marked.map(file => file.path)));
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
					await refreshPage();
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
					message.success('Папка создана!');
					if (relocate) {
						const path = directory.path === '/' ? `${directory.path}${directory.name}` : `${directory.path}/${directory.name}`;
						await Router.push(`${RouteNames.CLOUD}?path=${path}`);
					} else {
						await refreshPage();
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
					await refreshPage();
				} catch (error) {
					await handleApiError(error);
				}
			}
		}),
		markFile: build.mutation<any, { paths: string[] }>({
			query: (data) => ({
				url: '/favorites',
				method: 'POST',
				body: data
			}),
			async onQueryStarted({ paths }, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
					paths.forEach((path) => dispatch(markFile(path)));
				} catch (error) {
					await handleApiError(error);
				}
			}
		}),
		unmarkFile: build.mutation<any, { paths: string[] }>({
			query: (data) => ({
				url: '/favorites',
				method: 'DELETE',
				body: data
			}),
			async onQueryStarted({ paths }, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
					paths.forEach((path) => dispatch(unMarkFile(path)));
				} catch (error) {
					await handleApiError(error);
				}
			}
		}),
		deleteFile: build.mutation<any, { paths: string [], isDir: boolean }>({
			query: ({ paths }) => ({
				url: '/files',
				method: 'DELETE',
				body: { paths }
			}),
			async onQueryStarted({ paths, isDir }, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
					message.success(
						paths.length > 1
							? isDir ? `Папки (${paths.length}) перемещены в корзину` : `Файлы (${paths.length}) перемещены в корзину!`
							: isDir ? 'Папка перемещена в корзину!' : 'Файл перемещен в корзину!'
					);
					dispatch(setIsModalOpen({ deleteFile: false }));
					await refreshPage();
				} catch (error) {
					await handleApiError(error);
				}
			}
		})
	})
});