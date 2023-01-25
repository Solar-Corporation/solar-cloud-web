// @ts-ignore
import * as palette from '!!../utils/lessVarLoader!./variables.less';
import { theme } from 'antd';
import { pxToNumber } from '../utils';

export const variables = palette;
const { darkAlgorithm } = theme;

export const themeCloud = {
	algorithm: darkAlgorithm,
	token: {
		colorPrimary: variables['@base'],
		colorBgSpotlight: variables['@dark'],
		colorLink: variables['@magenta-primary'],
		colorLinkHover: variables['@magenta-secondary'],
		colorLinkActive: variables['@magenta-secondary'],
		borderRadius: pxToNumber(variables['@border-radius'])
	},
	components: {
		Button: {
			colorPrimary: variables['@magenta-primary'],
			colorPrimaryHover: variables['@magenta-secondary'],
			colorPrimaryActive: variables['@magenta-secondary']
		},
		Input: {
			colorPrimary: variables['@secondary'],
			colorPrimaryHover: variables['@secondary'],
			colorBgContainer: variables['@secondary'],
			colorBorder: variables['@secondary']
		}
	}
};