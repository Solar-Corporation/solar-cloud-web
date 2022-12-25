CREATE OR REPLACE FUNCTION file_data.delete_path() RETURNS text[]
	LANGUAGE plpgsql
AS
$$
DECLARE
	paths text[];
BEGIN
	SELECT ARRAY_AGG(path_system)
	FROM file_data.paths
	WHERE delete_at < NOW()
	  AND (is_dir_delete IS NULL OR is_dir = TRUE)
	INTO paths;
	DELETE FROM file_data.paths WHERE delete_at < NOW();
	RETURN paths;
END
$$
