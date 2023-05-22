import { LoadingOutlined } from '@ant-design/icons';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { Button, Modal, Result } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { usePreviewFile } from '../../hooks/files';
import { useAppSelector } from '../../hooks/redux';
import { setIsModalOpen } from '../../store/reducers/ModalSlice';
import styles from '../../styles/components/Modal.module.less';

export const ModalPreviewFile: FC = () => {
	const { selected, dispatch } = useCloudReducer();
	const { previewFile: isOpen } = useAppSelector(state => state.modalReducer.modal);
	// const [previewFile, { data, isLoading }] = filesAPI.usePreviewFileMutation();
	const { previewFile, uri, isLoading, error } = usePreviewFile();
	const [isConverted, setIsConverted] = useState(false);

	const handleClose = () => {
		dispatch(setIsModalOpen({ previewFile: false }));
	};

	const handleUpdate = () => {
		setIsConverted(false);
	};

	const handleConvert = () => {
		setIsConverted(true);
	};

	useEffect(() => {
		if (isOpen && selected.length) {
			previewFile(selected[0].hash);
		}
	}, [isOpen, selected]);

	return (
		<Modal
			title={selected.length ? selected[0].name : ''}
			open={isOpen}
			footer={null}
			width="90vw"
			onCancel={handleClose}
			afterClose={handleUpdate}
			centered
		>
			<div className={styles.preview}>
				{isLoading
					? <div className={styles.preview__loading}><LoadingOutlined/></div>
					: error
						? (
							<div className={styles.preview__empty}>
								<Result
									status="error"
									title={error === 413 ? 'Не поддерживается' : `${error}: Произошла непредвиденная ошибка`}
									subTitle={error === 413 ? 'Файл слишком большой для предварительного просмотра' : 'Попробуйте перезагрузить страницу'}
								/>
							</div>
						) : (
							<DocViewer
								documents={[{
									uri,
									fileName: selected.length ? selected[0].name : '',
									fileType: isConverted ? 'text/plain' : undefined
								}]}
								pluginRenderers={DocViewerRenderers}
								config={{
									header: { disableHeader: true },
									pdfVerticalScrollByDefault: true,
									noRenderer: {
										overrideComponent: () => (
											<div className={styles.preview__empty}>
												<Result
													status="error"
													title="Не поддерживается"
													subTitle="Предварительный просмотр не доступен для данного расширения"
													extra={
														<Button
															type="ghost"
															onClick={handleConvert}
														>
															Открыть в виде текстового документа
														</Button>
													}
												/>
											</div>
										)
									}
								}}
							/>
						)}
			</div>
		</Modal>
	);
};