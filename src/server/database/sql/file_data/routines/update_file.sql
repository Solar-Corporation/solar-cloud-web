CREATE OR REPLACE PROCEDURE file_data.update_file(old_path text,
                                                  new_path text)
	LANGUAGE plpgsql
AS
$$

BEGIN
	UPDATE file_data.paths
	SET path_system = REPLACE(path_system, old_path, new_path);
END
$$
