import { Button, Result } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/Result.module.less';

export const ResultError: FC = () => {
	const handleClick = () => {
		window.location.reload();
	}

	return (
		<div className={styles.container}>
			<Result
				status="error"
				title="500: Произошла непредвиденная ошибка"
				subTitle="Попробуйте перезагрузить страницу"
				extra={<Button type="ghost" onClick={handleClick}>Перезагрузить</Button>}
			/>
		</div>
	);
};