import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { authAPI } from '../client/services/AuthService';
import { wrapper } from '../client/store';
import '../client/styles/globals.less';

function App({ Component, ...rest }: AppProps) {
	const { store, props } = wrapper.useWrappedStore(rest);
	const { userReducer: { token } } = store.getState();

	if (!token) {
		store.dispatch(authAPI.endpoints.userRefresh.initiate(null));
	}

	return (
		<Provider store={store}>
			<Component {...props.pageProps} />
		</Provider>
	);
}

export default App;