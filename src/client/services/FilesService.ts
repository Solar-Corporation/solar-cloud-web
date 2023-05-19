import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query/react';
import { RcFile } from 'antd/es/upload';
import Router from 'next/router';
import { handleApiError, handleApiLoading, handleApiSuccess } from '../components/Notifications';
import { IDirectory, IFile, IMove, IUpload } from '../models/IFile';
import { RouteNames } from '../router';
import { AppState } from '../store';
import { markFile, setCurrent, setMarked, setShared, unmarkFile } from '../store/reducers/CloudSlice';
import { refreshPage } from '../utils';
import { clearUserOnQueryFulfilled } from './AuthService';
import { apiUrl } from './config';

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
					dispatch(setMarked(data.filter(file => file.isFavorite).map(file => file.path)));
					dispatch(setShared(data.filter(file => file.isShared).map(file => file.path)));
					dispatch(setCurrent(data));
				} catch (error) {
					console.log(error);
				}
			},
			transformResponse(response: IFile[]) {
				return response.map(file => ({ ...file, name: decodeURIComponent(file.name) }));
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
					handleApiError(error);
				}
			},
			transformResponse(response: IFile[], meta, { filesPath }) {
				return response.filter((file) => file.isDir && !filesPath.find(path => path === file.path));
			}
		}),
		getMarkedFiles: build.query<IFile[], void>({
			query: () => ({ url: '/favorites' }),
			async onQueryStarted(args, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setMarked(data.map(file => file.path)));
					dispatch(setShared(data.filter(file => file.isShared).map(file => file.path)));
					dispatch(setCurrent(data));
				} catch (error) {
					console.log(error);
				}
			},
			transformResponse(response: IFile[]) {
				return response.map(file => ({ ...file, name: decodeURIComponent(file.name) }));
			}
		}),
		getTrashFiles: build.query<IFile[], void>({
			query: () => ({ url: '/trash' }),
			async onQueryStarted(args, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setMarked(data.filter(file => file.isFavorite).map(file => file.path)));
					dispatch(setShared(data.filter(file => file.isShared).map(file => file.path)));
					dispatch(setCurrent(data));
				} catch (error) {
					console.log(error);
				}
			},
			transformResponse(response: IFile[]) {
				return response.map(file => ({ ...file, name: decodeURIComponent(file.name) }));
			}
		}),
		uploadFile: build.mutation<any, IUpload>({
			query: (data) => ({
				url: '/files',
				method: 'POST',
				body: getFormData(data)
			}),
			async onQueryStarted({ files }, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: files.length > 1 ? 'Загрузка файлов...' : 'Загрузка файла...',
						description: `Загрузка ${files.length > 1 ? `файлов (${files.length})` : 'файла'} в процессе...`
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Загрузка завершена!',
						description: files.length > 1 ? `Файлы (${files.length}) успешно загружены.` : 'Файл успешно загружен.'
					});
				} catch (error) {
					handleApiError(error, key);
				}
				if (Router.pathname === RouteNames.FILES || Router.pathname === RouteNames.DIRECTORY) {
					await refreshPage();
				} else {
					await Router.push(RouteNames.FILES);
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
					handleApiError(error);
				}
			}
		}),
		createDirectory: build.mutation<any, { directory: IDirectory, relocate: boolean }>({
			query: ({ directory }) => ({
				url: '/directories',
				method: 'POST',
				body: directory
			}),
			async onQueryStarted({ directory, relocate }, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Создание папки...',
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Папка создана!'
					});
					if (relocate) {
						const path = directory.path === '/' ? `${directory.path}${directory.name}` : `${directory.path}/${directory.name}`;
						await Router.push(`${RouteNames.FILES}/${encodeURIComponent(path)}`);
					} else {
						await refreshPage();
					}
				} catch (error) {
					handleApiError(error, key);
				}
			}
		}),
		renameFile: build.mutation<any, { path: string, new_name: string, isDir: boolean }>({
			query: ({ path, new_name }) => ({
				url: `/files/${encodeURIComponent(path)}`,
				method: 'PUT',
				params: { new_name }
			}),
			async onQueryStarted({ isDir }, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Изменение...',
						description: `Изменение названия ${isDir ? 'папки' : 'файла'} в процессе...`
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Изменение завершено!',
						description: isDir ? 'Папка успешно переименована.' : 'Файл успешно переименован.'
					});
					await refreshPage();
				} catch (error) {
					handleApiError(error, key);
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
					if (Router.pathname !== RouteNames.MARKED) {
						paths.forEach((path) => dispatch(markFile(path)));
					} else {
						await refreshPage();
					}
				} catch (error) {
					handleApiError(error);
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
						paths.forEach((path) => dispatch(unmarkFile(path)));
					} else {
						await refreshPage();
					}
				} catch (error) {
					handleApiError(error);
				}
			}
		}),
		deleteFile: build.mutation<any, { paths: string [], isDir: boolean }>({
			query: ({ paths }) => ({
				url: '/files',
				method: 'DELETE',
				body: { paths }
			}),
			async onQueryStarted({ paths, isDir }, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Удаление...',
						description: paths.length > 1
							? `Перемещение ${isDir ? 'папок' : 'файлов'} (${paths.length}) в корзину...`
							: `Перемещение ${isDir ? 'папки' : 'файла'} в корзину...`
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Удаление завершено!',
						description: paths.length > 1
							? isDir ? `Папки (${paths.length}) перемещены в корзину.` : `Файлы (${paths.length}) перемещены в корзину.`
							: isDir ? 'Папка перемещена в корзину.' : 'Файл перемещен в корзину.'
					});
					await refreshPage();
				} catch (error) {
					handleApiError(error, key);
				}
			}
		}),
		moveFile: build.mutation<any, { paths: IMove[], isDir: boolean, destination: string }>({
			query: ({ paths }) => ({
				url: '/files',
				method: 'PATCH',
				body: { paths }
			}),
			async onQueryStarted({ paths, isDir, destination }, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Перемещение...',
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Перемещение завершено!',
						description: paths.length > 1
							? isDir ? `Папки (${paths.length}) перемещены в "${destination}".` : `Файлы (${paths.length}) перемещены в "${destination}".`
							: isDir ? `Папка перемещена в "${destination}".` : `Файл перемещен в "${destination}".`
					});
					await refreshPage();
				} catch (error) {
					handleApiError(error, key);
				}
			}
		}),
		downloadFile: build.mutation<Blob, { name: string, path: string }>({
			query: ({ path }) => ({
				url: `/files/${encodeURIComponent(path)}`,
				method: 'GET',
				responseHandler: ((response) => response.blob())
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
					handleApiError(error);
				}
			}
		}),
		clearTrash: build.mutation<any, string>({
			query: () => ({
				url: '/trash',
				method: 'DELETE'
			}),
			async onQueryStarted(args, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Очистка корзины...'
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Корзина очищена!'
					});
					await refreshPage();
				} catch (error) {
					console.log(error);
					handleApiError(error, key);
				}
			}
		}),
		recoverFile: build.mutation<any, { paths: string[], isDir: boolean }>({
			query: ({ paths }) => ({
				url: '/trash',
				method: 'PUT',
				body: { paths }
			}),
			async onQueryStarted({ paths, isDir }, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Восстановление...',
						description: paths.length > 1
							? `Восстановление ${isDir ? 'папок' : 'файлов'} (${paths.length}) в процессе...`
							: `Восстановление ${isDir ? 'папки' : 'файла'} в процессе...`
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Восстановление завершено!',
						description: paths.length > 1
							? isDir ? `Папки (${paths.length}) восстановлены.` : `Файлы (${paths.length}) восстановлены.`
							: isDir ? `Папка восстановлена.` : `Файл восстановлен.`
					});
					await refreshPage();
				} catch (error) {
					console.log(error);
					handleApiError(error);
				}
			}
		})
	})
});
