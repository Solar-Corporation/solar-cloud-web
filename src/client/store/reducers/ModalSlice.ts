import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface IModal {
	acceptUser?: boolean;
	createDirectory?: boolean;
	renameFile?: boolean;
	declineUser?: boolean;
	deleteFile?: boolean;
	deleteUser?: boolean;
	clearTrash?: boolean;
	moveFile?: boolean;
}

export interface ModalState {
	modal: IModal;
}

const initialState: ModalState = {
	modal: {
		acceptUser: false,
		createDirectory: false,
		renameFile: false,
		declineUser: false,
		deleteFile: false,
		deleteUser: false,
		clearTrash: false,
		moveFile: false
	}
};

export const ModalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		setIsModalOpen(state, action: PayloadAction<IModal>) {
			state.modal = { ...state.modal, ...action.payload };
		}
	},
	extraReducers: {
		[HYDRATE]: (state, action) => {
			return {
				...state,
				...action.payload.modalReducer
			};
		}
	}
});

export default ModalSlice.reducer;

export const { setIsModalOpen } = ModalSlice.actions;