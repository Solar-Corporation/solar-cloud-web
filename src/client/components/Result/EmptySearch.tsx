import { SearchOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { FC } from 'react';
import styles from '../../styles/components/Result.module.less';

interface ResultEmptySearchProps {
	search: string;
}

export const ResultEmptySearch: FC<ResultEmptySearchProps> = ({ search }) => {
	return (
		<div className={styles.container}>
			<Result
				icon={<SearchOutlined className={styles.icon__file} />}
				title="Нет результатов"
				subTitle={`По запросу "${search}" нет результатов`}
			/>
		</div>
	);
};