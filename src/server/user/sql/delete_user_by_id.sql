CREATE OR REPLACE FUNCTION user_data.delete_user_by_id(delete_id int) RETURNS text
	LANGUAGE plpgsql
AS
$$
DECLARE
	delete_user_uuid text;
BEGIN
	DELETE
	FROM user_data.users
	WHERE user_id = delete_id
	RETURNING user_uuid INTO delete_user_uuid;
	RETURN delete_user_uuid;
END;
$$
