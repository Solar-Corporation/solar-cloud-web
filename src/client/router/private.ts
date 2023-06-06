import { GetServerSidePropsContext } from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { RouteNames } from './index';

export const privateRoute = (props: { [key: string]: any }, ctx: GetServerSidePropsContext, error: any, redirect?: string) => {
	if (error && error.status === 401) {
		destroyCookie(ctx, 'accessToken');
		destroyCookie(ctx, 'refreshToken');

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