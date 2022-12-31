CREATE OR REPLACE FUNCTION security_data.add_jwt(jwt_data jsonb) RETURNS integer
	LANGUAGE plpgsql
AS
$$
DECLARE
	token_id integer;
BEGIN

	INSERT INTO security_data.auth_token (auth_jwt, fk_user_id, auth_expired)
	VALUES (jwt_data ->> 'refreshToken', (jwt_data ->> 'userId')::integer,
	        (jwt_data ->> 'dateExpired')::timestamp)
	RETURNING auth_id INTO token_id;

	INSERT INTO security_data.auth_device (device_ip, device_ua, fk_token_id)
	VALUES (jwt_data ->> 'deviceIp', jwt_data ->> 'deviceUa', token_id);

	RETURN token_id;
END
$$;
