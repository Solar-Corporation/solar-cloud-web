CREATE OR REPLACE PROCEDURE delete_jwt(refresh_token text)
	LANGUAGE plpgsql
AS
$$
DECLARE
	delete_device_id integer;
BEGIN
	DELETE
	FROM security_data.auth_token
	WHERE auth_jwt = refresh_token
	RETURNING fk_device_id INTO delete_device_id;

	DELETE
	FROM security_data.auth_device
	WHERE device_id = delete_device_id;
END
$$;

ALTER PROCEDURE delete_jwt(text) OWNER TO postgres;

