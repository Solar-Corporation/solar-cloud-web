import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError
} from '@reduxjs/toolkit/dist/query/react';
import { RcFile } from 'antd/es/upload';
import Router from 'next/router';
import { handleApiError, handleApiLoading, handleApiSuccess } from '../components/Notifications';
import { IDirectory, IFile, IMove, IStorageSpace, IUpload } from '../models/IFile';
import { RouteNames } from '../router';
import { AppState } from '../store';
import {
	markFile,
	setCurrent,
	setDirectory, setIsContextMenuOpen,
	setIsFilesContextMenuOpen,
	setMarked,
	setShared,
	shareFile,
	unmarkFile, unshareFile
} from '../store/reducers/CloudSlice';
import { refreshPage } from '../utils';
import { clearUserOnQueryFulfilled } from './AuthService';
import { apiUrl } from './config';
import copy from 'copy-to-clipboard';

const getFormData = ({ files, hash, dir }: IUpload) => {
	const formData = new FormData();
	if (hash) formData.append('hash', hash);
	if (dir) formData.append('dir', dir);

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
		getSpace: build.query<IStorageSpace, void>({
			query: () => ({
				url: '/space',
			})
		}),
		getFiles: build.query<IFile[], string | void>({
			query: (hash) => ({
				url: '/files',
				params: { hash }
			}),
			async onQueryStarted(args, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setMarked(data.filter(file => file.isFavorite).map(file => file.hash)));
					dispatch(setShared(data.filter(file => file.isShare).map(file => file.hash)));
					dispatch(setCurrent(data));
				} catch (error) {
					console.log(error);
				}
			},
			transformResponse(response: IFile[]) {
				return response.map(file => ({ ...file, name: decodeURIComponent(file.name) }));
			}
		}),
		getFolders: build.mutation<IFile[], { hash: string | undefined, filesPath: string[] }>({
			query: ({ hash }) => ({
				url: '/files',
				method: 'GET',
				params: { hash }
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
		getFolderPath: build.query<IFile[], string>({
			query: hash => ({ url: `/files/${hash}/path` }),
			async onQueryStarted(args, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (error) {
					console.log(error);
				}
			}
		}),
		getMarkedFiles: build.query<IFile[], void>({
			query: () => ({ url: '/favorites' }),
			async onQueryStarted(args, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setMarked(data.map(file => file.hash)));
					dispatch(setShared(data.filter(file => file.isShare).map(file => file.hash)));
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
					dispatch(setMarked(data.filter(file => file.isFavorite).map(file => file.hash)));
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
		createDirectory: build.mutation<{ hash: string }, { directory: IDirectory, relocate: boolean }>({
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
					const { data } = await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Папка создана!'
					});
					if (relocate) {
						await Router.push(`${RouteNames.FILES}/${data.hash}`);
					} else {
						await refreshPage();
					}
				} catch (error) {
					handleApiError(error, key);
				}
			}
		}),
		renameFile: build.mutation<any, { hash: string, newName: string, isDir: boolean }>({
			query: ({ hash, newName }) => ({
				url: `/files/${hash}`,
				method: 'PUT',
				params: { newName }
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
		markFile: build.mutation<any, { hashes: string[] }>({
			query: (data) => ({
				url: '/favorites',
				method: 'POST',
				body: data
			}),
			async onQueryStarted({ hashes }, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
					if (Router.pathname !== RouteNames.MARKED) {
						hashes.forEach(hash => dispatch(markFile(hash)));
					} else {
						await refreshPage();
					}
				} catch (error) {
					handleApiError(error);
				}
			}
		}),
		unmarkFile: build.mutation<any, { hashes: string[] }>({
			query: (data) => ({
				url: '/favorites',
				method: 'DELETE',
				body: data
			}),
			async onQueryStarted({ hashes }, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
					if (Router.asPath !== RouteNames.MARKED) {
						hashes.forEach(hash => dispatch(unmarkFile(hash)));
					} else {
						await refreshPage();
					}
				} catch (error) {
					handleApiError(error);
				}
			}
		}),
		deleteFile: build.mutation<any, { hashes: string [], isDir: boolean }>({
			query: ({ hashes }) => ({
				url: '/files',
				method: 'DELETE',
				body: { hashes }
			}),
			async onQueryStarted({ hashes, isDir }, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Удаление...',
						description: hashes.length > 1
							? `Перемещение ${isDir ? 'папок' : 'файлов'} (${hashes.length}) в корзину...`
							: `Перемещение ${isDir ? 'папки' : 'файла'} в корзину...`
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Удаление завершено!',
						description: hashes.length > 1
							? isDir ? `Папки (${hashes.length}) перемещены в корзину.` : `Файлы (${hashes.length}) перемещены в корзину.`
							: isDir ? 'Папка перемещена в корзину.' : 'Файл перемещен в корзину.'
					});
					await refreshPage();
				} catch (error) {
					handleApiError(error, key);
				}
			}
		}),
		moveFile: build.mutation<any, { hashes: IMove[], isDir: boolean, destination: string }>({
			query: ({ hashes }) => ({
				url: '/files',
				method: 'PATCH',
				body: { hashes }
			}),
			async onQueryStarted({ hashes, isDir, destination }, { queryFulfilled }) {
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
						description: hashes.length > 1
							? isDir ? `Папки (${hashes.length}) перемещены в "${destination}".` : `Файлы (${hashes.length}) перемещены в "${destination}".`
							: isDir ? `Папка перемещена в "${destination}".` : `Файл перемещен в "${destination}".`
					});
					await refreshPage();
				} catch (error) {
					handleApiError(error, key);
				}
			}
		}),
		copyFile: build.mutation<any, { hashes: IMove[], isDir: boolean, destination: string }>({
			query: ({ hashes }) => ({
				url: '/files/copy',
				method: 'PATCH',
				body: { hashes }
			}),
			async onQueryStarted({ hashes, isDir, destination }, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Копирование...',
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Копирование завершено!',
						description: hashes.length > 1
							? isDir ? `Папки (${hashes.length}) скопированы в "${destination}".` : `Файлы (${hashes.length}) скопированы в "${destination}".`
							: isDir ? `Папка скопирована в "${destination}".` : `Файл скопирован в "${destination}".`
					});
					await refreshPage();
				} catch (error) {
					handleApiError(error, key);
				}
			}
		}),
		downloadFile: build.mutation<Blob, { name: string, hash: string }>({
			query: ({ hash }) => ({
				url: `/files/${hash}`,
				method: 'GET',
				responseHandler: ((response) => response.blob())
			}),
			async onQueryStarted({ name }, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					console.log(data);
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
		recoverFile: build.mutation<any, { hashes: string[], isDir: boolean }>({
			query: ({ hashes }) => ({
				url: '/trash',
				method: 'PUT',
				body: { hashes }
			}),
			async onQueryStarted({ hashes, isDir }, { queryFulfilled }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Восстановление...',
						description: hashes.length > 1
							? `Восстановление ${isDir ? 'папок' : 'файлов'} (${hashes.length}) в процессе...`
							: `Восстановление ${isDir ? 'папки' : 'файла'} в процессе...`
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Восстановление завершено!',
						description: hashes.length > 1
							? isDir ? `Папки (${hashes.length}) восстановлены.` : `Файлы (${hashes.length}) восстановлены.`
							: isDir ? `Папка восстановлена.` : `Файл восстановлен.`
					});
					await refreshPage();
				} catch (error) {
					console.log(error);
					handleApiError(error);
				}
			}
		}),
		createShareLink: build.mutation<{ url: string }, string>({
			query: hash => ({ url: `/share/${hash}`, method: 'POST' }),
			async onQueryStarted(hash, { queryFulfilled, dispatch, getState }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Создание ссылки...'
					});
					const { data } = await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Ссылка скопирована!'
					});
					copy(data.url);
					dispatch(setIsContextMenuOpen(false));
					dispatch(setIsFilesContextMenuOpen(false));
					// @ts-ignore
					const cloud = getState().cloudReducer;
					if (cloud.selected.length) {
						dispatch(shareFile(hash));
					} else {
						dispatch(setDirectory([true, cloud.directoryName]));
					}
				} catch (error) {
					console.log(error);
					handleApiError(error, key);
				}
			}
		}),
		getShareLink: build.mutation<{ url: string }, string>({
			query: hash => ({ url: `/share/${hash}`, method: 'GET' }),
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Получение ссылки...'
					});
					const { data } = await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Ссылка скопирована!'
					});
					copy(data.url);
					dispatch(setIsContextMenuOpen(false));
					dispatch(setIsFilesContextMenuOpen(false));
				} catch (error) {
					console.log(error);
					handleApiError(error, key);
				}
			}
		}),
		deleteShareLink: build.mutation<void, string>({
			query: hash => ({ url: `/share/${hash}`, method: 'DELETE' }),
			async onQueryStarted(hash, { queryFulfilled, dispatch, getState }) {
				const key = `${Date.now()}`;
				try {
					handleApiLoading({
						key,
						message: 'Удаление ссылки...'
					});
					await queryFulfilled;
					handleApiSuccess({
						key,
						message: 'Ссылка удалена!'
					});
					dispatch(setIsContextMenuOpen(false));
					dispatch(setIsFilesContextMenuOpen(false));
					// @ts-ignore
					const cloud = getState().cloudReducer;
					if (cloud.selected.length) {
						dispatch(unshareFile(hash));
					} else {
						dispatch(setDirectory([false, cloud.directoryName]));
					}
				} catch (error) {
					console.log(error);
					handleApiError(error, key);
				}
			}
		}),
	})
});