import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { wrapper } from '../client/store';
import '../client/styles/globals.less';

function App({ Component, ...rest }: AppProps) {
	const { store, props } = wrapper.useWrappedStore(rest);

	return (
		<Provider store={store}>
			<Component {...props.pageProps} />
		</Provider>
	);
}

export default App;