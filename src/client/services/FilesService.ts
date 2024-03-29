import { BaseQueryFn, createApi, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';
import copy from 'copy-to-clipboard';
import Router from 'next/router';
import { handleApiError, handleApiLoading, handleApiSuccess } from '../components/Notifications';
import { IDirectory, IFile, IMove, IStorageSpace, IUpload } from '../models/IFile';
import { RouteNames } from '../router';
import {
	markFile,
	setCurrent,
	setDirectory,
	setIsContextMenuOpen,
	setIsFilesContextMenuOpen,
	setMarked,
	setShared,
	shareFile,
	unmarkFile,
	unshareFile
} from '../store/reducers/CloudSlice';
import { clearUser } from '../store/reducers/UserSlice';
import { refreshPage } from '../utils';
import { setUserOnQueryFulfilled } from './AuthService';
import { baseQuery } from './config';

const getFormData = ({ files, hash, dir }: IUpload) => {
	const formData = new FormData();
	if (hash) formData.append('hash', hash);
	if (dir) formData.append('dir', dir);

	files.forEach((file) => {
		formData.append('files[]', file, encodeURIComponent(file.name));
	});

	return formData;
};

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

export const filesAPI = createApi({
	reducerPath: 'filesAPI',
	baseQuery: baseQueryWithRefresh,
	endpoints: (build) => ({
		getSpace: build.query<IStorageSpace, void>({
			query: () => ({ url: '/space' }),
			async onQueryStarted(args, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (error) {
					console.log(error);
				}
			}
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
			}
		}),
		getFolders: build.mutation<IFile[], { hash: string | undefined, filesPath: string[] }>({
			query: ({ hash }) => ({
				url: '/files',
				method: 'GET',
				params: { hash }
			}),
			transformResponse(response: IFile[], meta, { filesPath }) {
				return response.filter((file) => file.isDir && !filesPath.find(path => path === file.path));
			},
			async onQueryStarted(args, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (error) {
					handleApiError(error);
				}
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
			}
		}),
		getSearchFiles: build.query<IFile[], string>({
			query: (name) => ({
				url: '/search',
				params: { name }
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
		previewFile: build.mutation<{ url: string }, string>({
			query: (hash) => ({
				url: `/files/${hash}/download`,
				method: 'GET'
			})
		}),
		downloadFile: build.mutation<{ url: string }, string>({
			query: (hash) => ({
				url: `/files/${hash}/download`,
				method: 'GET'
			}),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					const link = document.createElement('a');
					link.href = data.url;
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
