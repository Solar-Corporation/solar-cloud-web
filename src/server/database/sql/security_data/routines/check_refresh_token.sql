CREATE OR REPLACE FUNCTION check_refresh_token(refresh_token text) RETURNS boolean
	LANGUAGE plpgsql
AS
$$
BEGIN
	RETURN EXISTS(SELECT auth_jwt FROM security_data.auth_token WHERE (auth_jwt = refresh_token));
END
$$;

ALTER FUNCTION check_refresh_token(text) OWNER TO postgres;

