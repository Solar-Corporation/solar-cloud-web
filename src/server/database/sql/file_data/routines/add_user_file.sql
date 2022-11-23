CREATE OR REPLACE FUNCTION add_user_file(file_data jsonb, user_id integer) RETURNS integer
	LANGUAGE plpgsql
AS
$$
DECLARE
	result_file_id integer;
BEGIN

	INSERT INTO file_data.files (file_path, file_size_actual, file_size_compressed, file_mime)
	VALUES (file_data ->> 'filePath', (file_data ->> 'sizeActual')::bigint,
	        (file_data ->> 'sizeCompressed')::bigint, file_data ->> 'fileMime')
	RETURNING file_id INTO result_file_id;

	INSERT INTO table_links.users_files (fk_user_id, fk_file_id)
	VALUES (user_id, result_file_id);

	RETURN result_file_id;
END
$$;
