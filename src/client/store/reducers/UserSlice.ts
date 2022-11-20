import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
	}
});

export default UserSlice.reducer;
export const { setUser } = UserSlice.actions;