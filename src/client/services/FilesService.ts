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
import { IDirectory, IFile, IMove, IUpload } from '../models/IFile';
import { RouteNames } from '../router';
import { AppState } from '../store';
import { markFile, setMarked, unMarkFile } from '../store/reducers/CloudSlice';
import { setIsModalOpen } from '../store/reducers/ModalSlice';
import { refreshPage } from '../utils';
import { apiUrl, handleApiError } from './config';

const getFormData = ({ path, files }: IUpload) => {
	const formData = new FormData();
	formData.append('path', path);

	files.forEach((file) => {
		formData.append('files[]', new File(
			[file],
			encodeURIComponent(file.name),
			{ type: file.type, lastModified: file.lastModified }) as RcFile
		);
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
		if (refreshResult.data) {
			result = await baseQuery(args, api, extraOptions);
		}
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
			},
			transformResponse(response: IFile[]) {
				return response.map(file => ({ ...file, name: decodeURIComponent(file.name)}));
			}
		}),
		getFolders: build.mutation<IFile[], { path: string, filesPath: string[] }>({
			query: ({ path }) => ({
				url: '/files',
				method: 'GET',
				params: { path }
			}),
			async onQueryStarted(args, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (error) {
					await handleApiError(error);
				}
			},
			transformResponse(response: IFile[], meta, { filesPath }) {
				return response.filter((file) => file.isDir && !filesPath.find(path => path === file.path));
			}
		}),
		getMarkedFiles: build.query<IFile[], string>({
			query: () => ({ url: '/favorites' }),
			async onQueryStarted(args, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setMarked(data.map(file => file.path)));
				} catch (error) {
					console.log(error);
				}
			},
			transformResponse(response: IFile[]) {
				return response.map(file => ({ ...file, name: decodeURIComponent(file.name)}));
			}
		}),
		getTrashFiles: build.query<IFile[], string>({
			query: () => ({ url: '/trash' }),
			async onQueryStarted(args, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;
					const marked = data.filter(file => file.isFavorite);
					dispatch(setMarked(marked.map(file => file.path)));
				} catch (error) {
					console.log(error);
				}
			},
			transformResponse(response: IFile[]) {
				return response.map(file => ({ ...file, name: decodeURIComponent(file.name)}));
			}
		}),
		uploadFile: build.mutation<any, IUpload>({
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
					if (Router.asPath === RouteNames.FILES || Router.asPath === RouteNames.DIRECTORY) {
						await refreshPage();
					} else {
						await Router.push(RouteNames.FILES);
					}
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
					await dispatch(filesAPI.endpoints.uploadFile.initiate(upload));
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
						await Router.push(`${RouteNames.FILES}/${encodeURIComponent(path)}`);
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
				url: `/files/${encodeURIComponent(path)}`,
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
					if (Router.asPath !== RouteNames.MARKED) {
						paths.forEach((path) => dispatch(markFile(path)));
					} else {
						await refreshPage();
					}
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
					if (Router.asPath !== RouteNames.MARKED) {
						paths.forEach((path) => dispatch(unMarkFile(path)));
					} else {
						await refreshPage();
					}
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
							? isDir ? `Папки (${paths.length}) перемещены в корзину!` : `Файлы (${paths.length}) перемещены в корзину!`
							: isDir ? 'Папка перемещена в корзину!' : 'Файл перемещен в корзину!'
					);
					dispatch(setIsModalOpen({ deleteFile: false }));
					await refreshPage();
				} catch (error) {
					await handleApiError(error);
				}
			}
		}),
		moveFile: build.mutation<any, { paths: IMove[], isDir: boolean, destination: string }>({
			query: ({ paths }) => ({
				url: '/files',
				method: 'PATCH',
				body: { paths }
			}),
			async onQueryStarted({ paths, isDir, destination }, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
					message.success(
						paths.length > 1
							? isDir ? `Папки (${paths.length}) перемещены в "${destination}"!` : `Файлы (${paths.length}) перемещены в "${destination}"!`
							: isDir ? `Папка перемещена в "${destination}"!` : `Файл перемещен в "${destination}"!`
					);
					dispatch(setIsModalOpen({ moveFile: false }));
					await refreshPage();
				} catch (error) {
					await handleApiError(error);
				}
			}
		}),
		downloadFile: build.mutation<Blob, { name: string, path: string}>({
			query: ({ path }) => ({
				url: `/files/${encodeURIComponent(path)}`,
				method: 'GET',
				responseHandler: ((response) => response.blob()),
				redirect: 'follow'
			}),
			async onQueryStarted({ name, path }, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					const link = document.createElement('a');
					link.href = URL.createObjectURL(data);
					link.download = name;
					link.click();
					link.remove();
				} catch (error) {
					console.log(error);
					await handleApiError(error);
				}
			}
		})
	})
});