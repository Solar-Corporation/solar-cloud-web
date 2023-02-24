import { Modal } from 'antd';
import { FC, ReactNode } from 'react';
import styles from '../../styles/components/Modal.module.less';

interface AppModalProps {
	title?: string;
	okText?: string;
	cancelText?: string;
	open?: boolean;
	confirmLoading?: boolean;
	afterClose: () => void;
	onOk: () => void;
	onCancel: () => void;
	children: ReactNode;
}

export const AppModal: FC<AppModalProps> = ({ title, okText, cancelText, open, confirmLoading, afterClose, onOk, onCancel, children }) => {
	return (
		<Modal
			title={title}
			width={400}
			open={open}
			okText={okText}
			cancelText={cancelText}
			cancelButtonProps={{ type: 'ghost' }}
			confirmLoading={confirmLoading}
			afterClose={afterClose}
			onCancel={onCancel}
			onOk={onOk}
		>
			<div className={styles.container}>
				{children}
			</div>
		</Modal>
	);
};