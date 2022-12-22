CREATE OR REPLACE PROCEDURE file_data.update_file(old_path text,
                                                  new_path text)
	LANGUAGE plpgsql
AS
$$

BEGIN
	IF EXISTS(SELECT * FROM file_data.paths WHERE path_system = old_path) THEN
		UPDATE file_data.paths
		SET path_system = REPLACE(path_system, old_path, new_path);
	END IF;
END
$$
