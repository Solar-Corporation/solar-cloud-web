import { Input } from 'antd';
import { FC, useState } from 'react';
import styles from '../../styles/components/Header.module.css';

export const HeaderSearch: FC = () => {
  const [value, setValue] = useState('');

  const handleSearch = () => {
    console.log(value);
    setValue('');
  };

  return (
    <Input.Search
      className={styles.search}
      size="large"
      placeholder="Поиск"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onSearch={handleSearch}
    />
  );
};
