import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { IUser } from '../../models/IUser';

export interface UserState {
	data: IUser | null;
	accessToken: string;
	refreshToken: string;
}

const initialState: UserState = {
	data: null,
	accessToken: '',
	refreshToken: ''
};

export const UserSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<UserState>) {
			state.data = action.payload.data;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
		},
		clearUser(state) {
			state.data = initialState.data;
			state.accessToken = initialState.accessToken;
			state.refreshToken = initialState.refreshToken;
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
export const { setUser, clearUser } = UserSlice.actions;