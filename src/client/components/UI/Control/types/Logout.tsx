import { LogoutOutlined } from '@ant-design/icons';
import { FC } from 'react';
import { authAPI } from '../../../../services/AuthService';
import { Control, ControlTypeProps } from '../index';

export const ControlLogout: FC<ControlTypeProps> = (props) => {
	const [logout, { isLoading }] = authAPI.useUserLogoutMutation();

	const handleClick = async () => {
		await logout();
	};

	return (
		<Control
			{...props}
			icon={<LogoutOutlined />}
			title="Выйти из аккаунта"
			onClick={handleClick}
			loading={isLoading}
		/>
	);
};