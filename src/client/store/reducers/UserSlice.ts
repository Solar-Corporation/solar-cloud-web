import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwt from 'jwt-decode';
import { GetServerSidePropsContext } from 'next';
import { HYDRATE } from 'next-redux-wrapper';
import { parseCookies } from 'nookies';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { IUser } from '../../models/IUser';

export interface UserState {
	data: IUser | null;
	token: string;
}

const initialState: UserState = {
	data: null,
	token: ''
};

export const UserSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<UserState>) {
			state.data = action.payload.data;
			state.token = action.payload.token;
		}
	},
	extraReducers: {
		[HYDRATE]: (state, action) => {
			return {
				...state,
				...action.payload.userReducer
			};
		}
	}
});

export default UserSlice.reducer;
export const { setUser } = UserSlice.actions;
export const setInitialUserData = (ctx: GetServerSidePropsContext, dispatch: ThunkDispatch<any, any, AnyAction>) => {
	const { accessToken: token } = parseCookies(ctx);
	if (token) {
		const user: UserState = {
			data: jwt(token),
			token
		};
		dispatch(setUser(user));
	}
};