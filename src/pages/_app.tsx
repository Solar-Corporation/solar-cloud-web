import { Roboto } from '@next/font/google';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import ProgressBar from 'nextjs-progressbar';
import { Provider } from 'react-redux';
import { ModalList } from '../client/components/Modal/List';
import { wrapper } from '../client/store';
import '../client/styles/globals.less';
import { themeCloud, variables } from '../client/styles/theme';

export const fontRoboto = Roboto({ subsets: ['latin', 'cyrillic'], weight: ['400', '500'] });

function App({ Component, ...rest }: AppProps) {
	const { store, props } = wrapper.useWrappedStore(rest);

	return (
		<Provider store={store}>
			<Head>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ConfigProvider theme={themeCloud}>
				<div className={fontRoboto.className}>
					<ProgressBar color={variables['@magenta-primary']} options={{ showSpinner: false }} />
					<Component {...props.pageProps} />
				</div>
				<ModalList />
			</ConfigProvider>
		</Provider>
	);
}

export default App;