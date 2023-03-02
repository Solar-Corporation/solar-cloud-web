import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface IModal {
	createDirectory?: boolean;
	renameFile?: boolean;
	deleteFile?: boolean;
	moveFile?: boolean;
}

export interface ModalState {
	modal: IModal;
}

const initialState: ModalState = {
	modal: {
		createDirectory: false,
		renameFile: false,
		deleteFile: false,
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