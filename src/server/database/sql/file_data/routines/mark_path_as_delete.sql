CREATE OR REPLACE PROCEDURE file_data.mark_path_as_delete(path text, delete_time text, dir boolean)
	LANGUAGE plpgsql
AS
$$
BEGIN
	UPDATE file_data.paths
	SET delete_at     = delete_time::timestamp,
	    is_dir_delete = dir
	WHERE path_system LIKE CONCAT('%', path, '%')
	  AND delete_at IS NULL;

	UPDATE file_data.paths
	SET is_dir_delete = FALSE
	WHERE path_system LIKE CONCAT('%', path, '%')
	  AND path_system <> path
	  AND is_dir_delete IS NULL;

	IF NOT EXISTS(SELECT path_system FROM file_data.paths WHERE path_system = path) THEN
		INSERT INTO file_data.paths (path_system, is_dir, delete_at, is_dir_delete)
		VALUES (path::text, dir, delete_time::timestamp);
	END IF;
END;
$$
