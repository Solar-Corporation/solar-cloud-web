CREATE OR REPLACE PROCEDURE file_data.add_favorite(user_id integer, path text)
	LANGUAGE plpgsql
AS
$$
DECLARE
	path_id int;
BEGIN
	IF NOT EXISTS(SELECT file_data.paths.path_id
	              FROM file_data.paths
	              WHERE path_system = path) THEN
		INSERT INTO file_data.paths (path_system)
		VALUES (path);
	END IF;

	SELECT file_data.paths.path_id
	FROM file_data.paths
	WHERE path_system = path
	INTO path_id;

	INSERT INTO table_links.favorite_user_paths (fk_user_id, fk_path_id)
	VALUES (user_id, path_id);
END
$$
