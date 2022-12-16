CREATE OR REPLACE FUNCTION user_data.is_email_verify(user_email TEXT) RETURNS boolean
	LANGUAGE plpgsql
AS
$$
BEGIN
	RETURN EXISTS(SELECT email_value FROM user_data.user_emails WHERE email_value = user_email AND is_verify = TRUE);
END
$$
