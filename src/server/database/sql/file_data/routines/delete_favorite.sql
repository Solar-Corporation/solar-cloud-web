CREATE OR REPLACE PROCEDURE file_data.delete_favorite(user_id integer, path text)
	LANGUAGE plpgsql
AS
$$
DECLARE
	path_id integer;
BEGIN
	SELECT file_data.paths.path_id
	FROM file_data.paths
	WHERE path_system = path
	INTO path_id;

	DELETE FROM table_links.favorite_user_paths WHERE fk_path_id = path_id AND fk_user_id = user_id;
END;
$$
