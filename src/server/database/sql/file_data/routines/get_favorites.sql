CREATE OR REPLACE FUNCTION file_data.get_favorites(user_id integer) RETURNS text[]
	LANGUAGE plpgsql
AS
$$
DECLARE
	paths text[];
BEGIN
	SELECT ARRAY(SELECT path_system
	             FROM file_data.paths
		                  INNER JOIN table_links.favorite_user_paths fup ON fup.fk_path_id = paths.path_id
	             WHERE fup.fk_user_id = user_id
		           AND delete_at IS NULL
		       )
	INTO paths;
	RETURN paths;
END;
$$
