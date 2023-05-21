import Router from 'next/router';
import { handleApiError, handleApiLoading, handleApiSuccess } from '../components/Notifications';
import { IUpload } from '../models/IFile';
import { RouteNames } from '../router';
import { apiUrl } from '../services/config';
import { refreshPage } from '../utils';

const getFormData = ({ files, hash, dir }: IUpload) => {
	const formData = new FormData();
	if (hash) formData.append('hash', hash);
	if (dir) formData.append('dir', dir);

	files.forEach((file) => {
		formData.append('files[]', file, file.name);
	});

	return formData;
};

export function useUploadFile() {
	return async (data: IUpload, token: string) => {
		const key = `${Date.now()}`;
		const { files } = data;
		const xhr = new XMLHttpRequest();

		xhr.onloadstart = () => {
			handleApiLoading({
				key,
				message: files.length > 1 ? 'Загрузка файлов...' : 'Загрузка файла...',
				description: `Загрузка ${files.length > 1 ? `файлов (${files.length})` : 'файла'} в процессе...`
			});
		};
		xhr.onreadystatechange = async () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 201) {
					handleApiSuccess({
						key,
						message: 'Загрузка завершена!',
						description: files.length > 1 ? `Файлы (${files.length}) успешно загружены.` : 'Файл успешно загружен.'
					});
				} else {
					const error = {
						error: {
							status: xhr.status,
							error: JSON.parse(xhr.response).message || 'Произошла непредвиденная ошибка'
						}
					};
					handleApiError(error, key);
				}

				if (Router.pathname === RouteNames.FILES || Router.pathname === RouteNames.DIRECTORY) {
					await refreshPage();
				} else {
					await Router.push(RouteNames.FILES);
				}
			}
		};

		xhr.open('POST', `${apiUrl}/files`, true);
		xhr.setRequestHeader('Authorization', `Bearer ${token}`);
		await xhr.send(getFormData(data));
	}
}