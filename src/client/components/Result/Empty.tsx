import { FileAddFilled } from '@ant-design/icons';
import { Result } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/Result.module.less';

interface ResultEmptyProps {
	folderName?: string;
}

export const ResultEmpty: FC<ResultEmptyProps> = ({ folderName }) => {
	return (
		<div className={styles.container}>
			<Result
				icon={<FileAddFilled className={styles.icon} />}
				title="Нет файлов"
				subTitle={`Нажмите на кнопку "Загрузить", чтобы загрузить файлы в папку "${folderName || 'Все файлы'}"`}
			/>
		</div>
	);
};