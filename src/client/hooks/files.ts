import { useState } from 'react';
import { apiUrl } from '../services/config';
import { useAppSelector } from './redux';

export function usePreviewFile() {
	const [uri, setUri] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(0);
	const { accessToken, refreshToken } = useAppSelector(state => state.userReducer);

	const previewFile = (hash: string) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';

		xhr.onloadstart = () => {
			setUri('');
			setError(0);
			setIsLoading(true);
		};
		xhr.onreadystatechange = async () => {
			if (xhr.readyState === 4) {
				setIsLoading(false);
				if (xhr.status === 200) {
					setUri(window.URL.createObjectURL(xhr.response));
				} else {
					setError(xhr.status);
				}
			}
		};

		xhr.open('GET', `${apiUrl}/files/${hash}/stream`, true);
		if (accessToken) xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
		if (refreshToken) xhr.setRequestHeader('Cookie', `refreshToken=${refreshToken}`);

		xhr.send();
	};

	return { previewFile, uri, isLoading, error };
}