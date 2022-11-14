CREATE FUNCTION add_jwt(jwt_data jsonb) RETURNS integer
	LANGUAGE plpgsql
AS
$$
DECLARE
	user_device_id integer;
	token_id       integer;
BEGIN

	INSERT INTO security_data.auth_device (device_ip, device_ua)
	VALUES (jwt_data ->> 'deviceIp', jwt_data ->> 'deviceUa')
	RETURNING device_id INTO user_device_id;

	INSERT INTO security_data.auth_token (auth_jwt, fk_user_id, fk_device_id, auth_expired)
	VALUES (jwt_data ->> 'refreshToken', (jwt_data ->> 'userId')::integer, user_device_id,
	        (jwt_data ->> 'dateExpired')::timestamp)
	RETURNING token_id INTO token_id;

	RETURN token_id;
END
$$;

ALTER FUNCTION add_jwt(jsonb) OWNER TO postgres;

