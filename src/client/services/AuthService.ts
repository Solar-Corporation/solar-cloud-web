import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { IAuth, IToken } from '../models/IAuth';
import { apiUrl } from './config';

export const authAPI = createApi({
	reducerPath: 'authAPI',
	baseQuery: fetchBaseQuery({baseUrl: `${apiUrl}/auth`}),
	endpoints: (build) => ({
		userLogin: build.mutation<IToken, IAuth>({
			query: (user) => ({
				url: '/email',
				method: 'POST',
				body: user
			})
		})
	})
});