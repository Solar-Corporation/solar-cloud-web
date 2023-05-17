import { LoadingOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { ArgsProps, NotificationPlacement } from 'antd/es/notification/interface';

const notificationConfig: { placement: NotificationPlacement, duration: number } = {
	placement: 'bottomRight',
	duration: 2.5
}

export const handleApiSuccess = (config: ArgsProps) => {
	notification.success({
		...notificationConfig,
		...config
	});
}

export const handleApiLoading = (config: ArgsProps) => {
	notification.open({
		...notificationConfig,
		...config,
		icon: <LoadingOutlined />,
		duration: 0
	});
};

export const handleApiError = async (error: any, key?: string) => {
	if (error.error.status !== 401) {
		notification.error({
			...notificationConfig,
			key,
			message: 'Произошла ошибка!',
			description: `${error.error.error || error.error.data?.message || error.error.data?.error || error.meta.response.statusText}`
		});
	}
};
