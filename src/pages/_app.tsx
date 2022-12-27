import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { wrapper } from '../client/store';
import '../client/styles/globals.less';
import { themeCloud } from '../client/styles/theme';
import { Roboto } from '@next/font/google';

const roboto = Roboto({ subsets: ['latin', 'cyrillic'], weight: ['400', '500'] });

function App({ Component, ...rest }: AppProps) {
	const { store, props } = wrapper.useWrappedStore(rest);
	// const { userReducer: { token } } = store.getState();
	//
	// if (!token) {
	// 	store.dispatch(authAPI.endpoints.userRefresh.initiate(null));
	// }

	return (
		<Provider store={store}>
			<ConfigProvider theme={themeCloud}>
				<main className={roboto.className}>
					<Component {...props.pageProps} />
				</main>
			</ConfigProvider>
		</Provider>
	);
}

export default App;