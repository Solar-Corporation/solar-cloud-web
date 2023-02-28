import { useAppDispatch, useAppSelector } from './redux';


export function useCloudReducer() {
	const states = useAppSelector(state => state.cloudReducer);
	const dispatch = useAppDispatch();

	return { ...states, dispatch };
}