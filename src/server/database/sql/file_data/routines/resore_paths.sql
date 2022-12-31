CREATE OR REPLACE PROCEDURE file_data.restore_paths(path text, dir boolean)
	LANGUAGE plpgsql
AS
$$
DECLARE
BEGIN
	UPDATE file_data.paths
	SET delete_at     = NULL,
	    is_dir_delete = NULL
	WHERE path_system LIKE CONCAT('%', path, '%')
	  AND (is_dir_delete = dir OR (is_dir_delete IS NULL AND is_dir = TRUE))
	  AND delete_at IS NOT NULL;
END;
$$
