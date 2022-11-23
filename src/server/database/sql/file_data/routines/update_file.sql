CREATE OR REPLACE PROCEDURE file_data.update_file(old_path text, new_path text)
	LANGUAGE plpgsql
AS
$$

BEGIN

	UPDATE file_data.files
	SET file_path = REPLACE(file_path, old_path, new_path),
	    update_at = NOW();
END
$$
