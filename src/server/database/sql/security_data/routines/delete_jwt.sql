CREATE OR REPLACE PROCEDURE security_data.delete_jwt(refresh_token text)
	LANGUAGE plpgsql
AS
$$
BEGIN
	DELETE
	FROM security_data.auth_token
	WHERE auth_jwt = refresh_token;
END
$$;
