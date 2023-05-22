import { FC } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { useAppSelector } from '../../hooks/redux';
import { userAPI } from '../../services/UserService';
import { setIsModalOpen } from '../../store/reducers/ModalSlice';
import { AppModal } from './index';

export const ModalAcceptUser: FC = () => {
	const { userSelected, dispatch } = useCloudReducer();
	const { acceptUser: isOpen } = useAppSelector(state => state.modalReducer.modal);
	const [acceptUser] = userAPI.useAcceptUserMutation();

	const handleClose = () => {
		dispatch(setIsModalOpen({ acceptUser: false }));
	};

	const handleSubmit = async () => {
		handleClose();

		for (const user of userSelected) {
			await acceptUser(user.id);
		}
	};

	return (
		<AppModal
			title={`Принять ${userSelected.length > 1 ? 'заявки' : 'заявку'}`}
			okText="Принять"
			open={isOpen}
			onOk={handleSubmit}
			onCancel={handleClose}
		>
			<p>Вы уверены что хотите принять {
				userSelected.length > 1
					? `заявки от пользователей (${userSelected.length})`
					: userSelected.length && `заявку от пользователя "${userSelected[0].email}"`
			}?</p>
		</AppModal>
	);
};