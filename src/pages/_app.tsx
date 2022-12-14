import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { authAPI } from '../client/services/AuthService';
import { wrapper } from '../client/store';
import '../client/styles/globals.less';
import { themeCloud } from '../client/styles/theme';

function App({ Component, ...rest }: AppProps) {
	const { store, props } = wrapper.useWrappedStore(rest);
	const { userReducer: { token } } = store.getState();

	if (!token) {
		store.dispatch(authAPI.endpoints.userRefresh.initiate(null));
	}

	return (
		<Provider store={store}>
			<ConfigProvider theme={themeCloud}>
				<Component {...props.pageProps} />
			</ConfigProvider>
		</Provider>
	);
}

export default App;