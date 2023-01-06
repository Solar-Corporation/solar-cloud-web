CREATE OR REPLACE FUNCTION security_data.check_refresh_token(refresh_token text) RETURNS boolean
	LANGUAGE plpgsql
AS
$$
BEGIN
	RETURN EXISTS(SELECT auth_jwt FROM security_data.auth_token WHERE (auth_jwt = refresh_token));
END
$$;
