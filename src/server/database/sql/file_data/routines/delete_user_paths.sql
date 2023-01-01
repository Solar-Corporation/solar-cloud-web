CREATE OR REPLACE FUNCTION file_data.delete_user_paths(uuid TEXT) RETURNS text[]
	LANGUAGE plpgsql
AS
$$
DECLARE
	paths text[];
BEGIN
	SELECT ARRAY_AGG(path_system)
	FROM file_data.paths
	WHERE path_system LIKE CONCAT('%', uuid, '%')
	  AND (is_dir_delete IS NULL OR is_dir = TRUE)
	  AND delete_at IS NOT NULL
	INTO paths;

	DELETE
	FROM file_data.paths
	WHERE path_system LIKE CONCAT('%', uuid, '%')
	  AND delete_at IS NOT NULL;
	RETURN paths;
END
$$
