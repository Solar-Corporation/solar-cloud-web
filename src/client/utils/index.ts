import { GetServerSideProps } from 'next';
import { authAPI } from '../services/AuthService';
import { wrapper } from '../store';

export const tooltipShowDelay = 0.4;

export async function hash(string: string) {
	const utf8 = new TextEncoder().encode(string);
	const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray
		.map((bytes) => bytes.toString(16).padStart(2, '0'))
		.join('');
}

export const getServerSideRefresh: GetServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async (ctx) => {
			await store.dispatch(authAPI.endpoints.userRefresh.initiate(null));
			return { props: {} };
		}
);