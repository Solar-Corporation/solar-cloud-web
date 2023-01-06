CREATE OR REPLACE PROCEDURE file_data.restore_paths(delete_paths text[])
	LANGUAGE plpgsql
AS
$$
DECLARE
	dp          text;
	path_delete file_data.paths%rowtype;
BEGIN
	FOREACH dp IN ARRAY delete_paths
		LOOP
			SELECT *
			FROM file_data.paths
			WHERE path_system = dp
			INTO path_delete;

			IF (path_delete.is_dir_delete = FALSE) THEN
				RAISE EXCEPTION 'Can not restore path in delete dir';
			END IF;

			IF (path_delete.is_dir) THEN
				UPDATE file_data.paths
				SET delete_at = NULL
				WHERE path_system LIKE CONCAT('%', dp, '%')
				  AND ((is_dir_delete = TRUE OR is_dir_delete IS NULL) OR is_dir = TRUE)
				  AND delete_at IS NOT NULL;
			ELSE
				UPDATE file_data.paths
				SET delete_at = NULL
				WHERE path_system = dp;
			END IF;

			UPDATE file_data.paths
			SET is_dir_delete = NULL
			WHERE path_system LIKE CONCAT('%', dp, '%');
		END LOOP;
END;
$$
