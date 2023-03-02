import { Button, Modal } from 'antd';
import { FC, ReactNode } from 'react';
import styles from '../../styles/components/Modal.module.less';

interface AppModalProps {
	title?: string;
	width?: number;
	okText?: string;
	cancelText?: string;
	open?: boolean;
	confirmLoading?: boolean;
	confirmDisabled?: boolean;
	afterClose?: () => void;
	onOk: () => void;
	onCancel: () => void;
	onContainerClick?: () => void;
	children: ReactNode;
}

export const AppModal: FC<AppModalProps> = ({
	                                            title,
																							width,
	                                            okText,
	                                            cancelText,
	                                            open,
	                                            confirmLoading,
																							confirmDisabled,
	                                            afterClose,
	                                            onOk,
	                                            onCancel,
																							onContainerClick,
	                                            children
                                            }) => {
	return (
		<Modal
			title={title}
			width={width || 430}
			open={open}
			footer={[
				<Button
					key="cancel"
					type="ghost"
					onClick={onCancel}
				>
					{cancelText || 'Отменить'}
				</Button>,
				<Button
					key="ok"
					type="primary"
					onClick={onOk}
					loading={confirmLoading}
					disabled={confirmDisabled}
				>
					{okText || 'Ок'}
				</Button>
			]}
			afterClose={afterClose}
			onCancel={onCancel}
		>
			<div className={styles.container} onClick={onContainerClick}>
				{children}
			</div>
		</Modal>
	);
};