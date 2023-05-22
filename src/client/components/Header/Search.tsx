import { Input } from 'antd';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useCloudReducer } from '../../hooks/cloud';
import { RouteNames } from '../../router';
import styles from '../../styles/components/Header.module.less';

export const HeaderSearch: FC = () => {
	const { context } = useCloudReducer();
	const [value, setValue] = useState('');
	const router = useRouter();

	useEffect(() => {
		setValue(context.search);
	}, [context.search]);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	};

	const handleSearch = async () => {
		await router.push(value ? `${RouteNames.SEARCH}?name=${value}` : RouteNames.FILES);
	};

	return (
		<Input.Search
			className={styles.search}
			size="large"
			placeholder="Поиск"
			value={value}
			onChange={handleChange}
			onSearch={handleSearch}
			enterButton
		/>
	);
};