import { FC } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { useAppSelector } from '../../hooks/redux';
import { setIsModalOpen } from '../../store/reducers/ModalSlice';
import { AppModal } from './index';

export const ModalDeleteUser: FC = () => {
	const { userSelected, dispatch } = useCloudReducer();
	const { deleteUser: isOpen } = useAppSelector(state => state.modalReducer.modal);

	const handleClose = () => {
		dispatch(setIsModalOpen({ deleteUser: false }));
	};

	const handleSubmit = () => {

	};

	return (
		<AppModal
			title={`Удалить ${userSelected.length > 1 ? 'пользователей' : 'пользователя'}`}
			okText="Удалить"
			open={isOpen}
			onOk={handleSubmit}
			onCancel={handleClose}
		>
			<p>Вы уверены что хотите удалить {
				userSelected.length > 1
					? `пользователей (${userSelected.length})`
					: userSelected.length && `пользователя "${userSelected[0].email}"`
			}?</p>
		</AppModal>
	);
};