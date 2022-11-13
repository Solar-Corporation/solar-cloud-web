CREATE FUNCTION check_user_by_email(email text) RETURNS boolean
	LANGUAGE plpgsql
AS
$$
DECLARE
	is_exist boolean = FALSE;
BEGIN
	IF EXISTS(SELECT * FROM user_data.user_emails WHERE (email_value = email)) THEN
		is_exist = TRUE;
	END IF;
	RETURN is_exist;
END
$$;

ALTER FUNCTION check_user_by_email(text) OWNER TO postgres;

