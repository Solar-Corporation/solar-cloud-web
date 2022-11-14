CREATE OR REPLACE FUNCTION check_user_by_email(email text) RETURNS boolean
	LANGUAGE plpgsql
AS
$$
BEGIN
	RETURN EXISTS(SELECT email_value FROM user_data.user_emails WHERE (email_value = email));
END
$$;

ALTER FUNCTION check_user_by_email(text) OWNER TO postgres;

