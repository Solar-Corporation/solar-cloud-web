CREATE OR REPLACE FUNCTION check_file(path text) RETURNS boolean
	LANGUAGE plpgsql
AS
$$
BEGIN
	RETURN EXISTS(SELECT file_path FROM file_data.files WHERE file_path = path);
END
$$
