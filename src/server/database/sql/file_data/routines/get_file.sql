CREATE OR REPLACE FUNCTION file_data.get_file(path text) RETURNS jsonb
	LANGUAGE plpgsql
AS
$$
DECLARE
	file_json jsonb;
	file_row  file_data.files%rowtype;
BEGIN
	SELECT *
	FROM file_data.files
	WHERE file_path = path
	INTO file_row;

	SELECT JSONB_BUILD_OBJECT('filePath', file_row.file_path)
		       || JSONB_BUILD_OBJECT('sizeCompressed', file_row.file_size_compressed)
		       || JSONB_BUILD_OBJECT('sizeActual', file_row.file_size_actual)
		       || JSONB_BUILD_OBJECT('fileMeme', file_row.file_mime)
		       || JSONB_BUILD_OBJECT('createAt', file_row.create_at)
		       || JSONB_BUILD_OBJECT('updateAt', file_row.update_at)
	INTO file_json;
	RETURN file_json;
END
$$
