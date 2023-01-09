import { Roboto } from '@next/font/google';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { wrapper } from '../client/store';
import '../client/styles/globals.less';
import { themeCloud } from '../client/styles/theme';

const roboto = Roboto({ subsets: ['latin', 'cyrillic'], weight: ['400', '500'] });

function App({ Component, ...rest }: AppProps) {
	const { store, props } = wrapper.useWrappedStore(rest);

	return (
		<Provider store={store}>
			<Head>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ConfigProvider theme={themeCloud}>
				<main className={roboto.className}>
					<Component {...props.pageProps} />
				</main>
			</ConfigProvider>
		</Provider>
	);
}

export default App;