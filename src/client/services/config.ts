import { message } from 'antd';

export const baseUrl = 'http://10.99.97.9:8080';
export const apiUrl = `${baseUrl}/v1`;

export const handleApiError = async (error: any, key?: string) => {
	await message.open({
		key: key,
		type: 'error',
		content: `${error.error.error || error.error.data.message || error.error.data.error}`
	});
}