import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies';
import { RouteNames } from './index';

export const privateRoute = (props: { [key: string]: any }, error: any, redirect?: string) => {
	if (error && error.status === 401) {
		return {
			redirect: {
				permanent: true,
				destination: redirect ? `${RouteNames.LOGIN}?return_to=${RouteNames.MARKED}` : RouteNames.LOGIN
			}
		};
	}

	return { props };
};

export const authRoute = (ctx: GetServerSidePropsContext) => {
	const { refreshToken: token } = parseCookies(ctx);

	if (token) {
		return {
			redirect: {
				permanent: true,
				destination: RouteNames.FILES
			}
		};
	}

	return { props: {} };
};