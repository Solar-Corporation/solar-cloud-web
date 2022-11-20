import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import jwt from 'jwt-decode';
import { IAuth, IToken } from '../models/IAuth';
import { setUser, UserState } from '../store/reducers/UserSlice';
import { apiUrl } from './config';

export const authAPI = createApi({
	reducerPath: 'authAPI',
	baseQuery: fetchBaseQuery({ baseUrl: `${apiUrl}/auth` }),
	endpoints: (build) => ({
		userLogin: build.mutation<IToken, IAuth>({
			query: (data) => ({
				url: '/email',
				method: 'POST',
				body: data
			}),
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					const user: UserState = {
						data: jwt(data.access),
						token: data.access
					};
					dispatch(setUser(user));
				} catch (error) {
					console.log(error);
				}
			}
		})
	})
});