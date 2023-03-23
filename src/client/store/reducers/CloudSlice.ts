import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { IFile } from '../../models/IFile';

export interface ICloudContext {
	url: string;
	path: string;
}

export interface CloudState {
	current: IFile[];
	selected: IFile[];
	marked: string[];
	context: ICloudContext;
	isContextMenuOpen: boolean;
	isFilesContextMenuOpen: boolean;
	space: any;
}

const initialState: CloudState = {
	current: [],
	selected: [],
	marked: [],
	context: {
		url: '',
		path: '/'
	},
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
		unMarkFile(state, action: PayloadAction<string>) {
			state.marked = state.marked.filter(path => path !== action.payload);
		},
		setMarked(state, action: PayloadAction<string[]>) {
			state.marked = action.payload;
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
	unMarkFile,
	setMarked,
	setContext,
	setIsContextMenuOpen,
	setIsFilesContextMenuOpen
} = CloudSlice.actions;