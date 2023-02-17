import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { IFile } from '../../models/IFile';

interface ICloudContext {
	url: string;
	path: string;
}

export interface CloudState {
	selected: IFile[];
	context: ICloudContext;
	space: any;
}

const initialState: CloudState = {
	selected: [],
	context: {
		url: '',
		path: '/'
	},
	space: null
};

export const CloudSlice = createSlice({
	name: 'cloud',
	initialState,
	reducers: {
		selectFile(state, action: PayloadAction<IFile>) {
			state.selected.push(action.payload);
		},
		unselectFile(state, action: PayloadAction<IFile>) {
			state.selected = state.selected.filter(file => file.path !== action.payload.path);
		},
		clearSelected(state) {
			state.selected = initialState.selected;
		},
		setContext(state, action: PayloadAction<ICloudContext>) {
			state.context = action.payload;
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
export const { selectFile, unselectFile, clearSelected, setContext } = CloudSlice.actions;