import type { AppProps } from 'next/app';
// import '../client/styles/globals.css';
import '../client/styles/globals.less';

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
