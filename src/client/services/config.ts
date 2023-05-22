import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { AppState } from '../store';

export const baseUrl = 'http://10.99.97.9:8080';
export const apiUrl = `${baseUrl}/v1`;

export const baseQuery = fetchBaseQuery({
	baseUrl: apiUrl,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as AppState).userReducer.token;
		if (token) headers.set('Authorization', `Bearer ${token}`);
		return headers;
	}
});