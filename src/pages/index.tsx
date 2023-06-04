import { GetStaticProps } from 'next';
import { RouteNames } from '../client/router';

export default function Index() {
	return null;
}

export const getStaticProps: GetStaticProps = async () => {
	return {
		redirect: {
			permanent: true,
			destination: RouteNames.LOGIN
		}
	};
};