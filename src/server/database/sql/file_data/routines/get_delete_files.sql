CREATE OR REPLACE FUNCTION file_data.get_delete_files(uuid text) RETURNS text[]
	LANGUAGE plpgsql
AS
$$
DECLARE
	paths text[];
BEGIN
	SELECT ARRAY_AGG(path_system)
	FROM file_data.paths
	WHERE path_system LIKE '%' || uuid || '%'
	  AND (is_dir_delete = FALSE OR is_dir = TRUE OR delete_at IS NOT NULL)
	INTO paths;
	RETURN paths;
END;
$$
