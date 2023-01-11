import { FileUnknownFilled } from '@ant-design/icons';
import { FC } from 'react';
import { IFile } from '../../models/IFile';
import styles from '../../styles/components/FileTable.module.less';

interface FileTableRowProps {
	file: IFile;
}

export const FileTableRow: FC<FileTableRowProps> = ({ file }) => {
	let icon = <FileUnknownFilled className={styles.iconUnknown} />;

	return (
		<tr>
			<td>
				<div className={styles.icon}>
					{icon}
				</div>

			</td>
		</tr>
	);
};