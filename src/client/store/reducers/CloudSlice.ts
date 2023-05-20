import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { IFile } from '../../models/IFile';
import { IUser } from '../../models/IUser';

export interface ICloudContext {
	url: string;
	hash: string | null;
}

export interface CloudState {
	current: IFile[];
	selected: IFile[];
	marked: string[];
	shared: string[];
	userSelected: IUser[];
	directoryShared: boolean;
	directoryName: string;
	context: ICloudContext;
	isContextMenuOpen: boolean;
	isFilesContextMenuOpen: boolean;
	space: any;
}

const initialState: CloudState = {
	current: [],
	selected: [],
	marked: [],
	shared: [],
	userSelected: [],
	context: {
		url: '',
		hash: null,
	},
	directoryShared: false,
	directoryName: '',
	isContextMenuOpen: false,
	isFilesContextMenuOpen: false,
	space: null
};

export const CloudSlice = createSlice({
	name: 'cloud',
	initialState,
	reducers: {
		setCurrent(state, action: PayloadAction<IFile[]>) {
			state.current = action.payload;
		},
		selectFile(state, action: PayloadAction<IFile>) {
			state.selected.push(action.payload);
		},
		unselectFile(state, action: PayloadAction<IFile>) {
			state.selected = state.selected.filter(file => file.path !== action.payload.path);
		},
		selectAll(state) {
			state.selected = state.current;
		},
		clearSelected(state) {
			state.selected = initialState.selected;
		},
		markFile(state, action: PayloadAction<string>) {
			state.marked.push(action.payload);
		},
		unmarkFile(state, action: PayloadAction<string>) {
			state.marked = state.marked.filter(path => path !== action.payload);
		},
		setMarked(state, action: PayloadAction<string[]>) {
			state.marked = action.payload;
		},
		shareFile(state, action: PayloadAction<string>) {
			state.shared.push(action.payload);
		},
		unshareFile(state, action: PayloadAction<string>) {
			state.shared = state.shared.filter(path => path !== action.payload);
		},
		setShared(state, action: PayloadAction<string[]>) {
			state.shared = action.payload;
		},
		setDirectory(state, action: PayloadAction<[boolean, string]>) {
			state.directoryShared = action.payload[0];
			state.directoryName = action.payload[1];
		},
		selectUser(state, action: PayloadAction<any>) {
			state.userSelected.push(action.payload);
		},
		unselectUser(state, action: PayloadAction<any>) {
			state.userSelected = state.userSelected.filter(user => user.id !== action.payload.id);
		},
		clearUserSelected(state) {
			state.userSelected = initialState.userSelected;
		},
		setContext(state, action: PayloadAction<ICloudContext>) {
			state.context = action.payload;
		},
		setIsContextMenuOpen(state, action: PayloadAction<boolean>) {
			state.isContextMenuOpen = action.payload;
		},
		setIsFilesContextMenuOpen(state, action: PayloadAction<boolean>) {
			state.isFilesContextMenuOpen = action.payload;
		}
	},
	extraReducers: {
		[HYDRATE]: (state, action) => {
			return {
				...state,
				...action.payload.cloudReducer
			};
		}
	}
});

export default CloudSlice.reducer;
export const {
	setCurrent,
	selectFile,
	unselectFile,
	selectAll,
	clearSelected,
	markFile,
	unmarkFile,
	setMarked,
	shareFile,
	unshareFile,
	setShared,
	setDirectory,
	selectUser,
	unselectUser,
	clearUserSelected,
	setContext,
	setIsContextMenuOpen,
	setIsFilesContextMenuOpen
} = CloudSlice.actions;