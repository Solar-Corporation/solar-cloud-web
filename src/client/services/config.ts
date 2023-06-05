import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { AppState } from '../store';

export const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export const apiUrl = `${baseUrl}/v1`;

export const baseQuery = fetchBaseQuery({
	baseUrl: apiUrl,
	prepareHeaders: (headers, { getState }) => {
		const accessToken = (getState() as AppState).userReducer.accessToken;
		const refreshToken = (getState() as AppState).userReducer.accessToken;
		if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
		if (refreshToken) headers.set('Cookie', `refreshToken=${refreshToken}`);
		return headers;
	}
});