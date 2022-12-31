CREATE OR REPLACE FUNCTION user_data.check_user_by_email(user_email text) RETURNS boolean
	LANGUAGE plpgsql
AS
$$
BEGIN
	RETURN EXISTS(SELECT email_vaule FROM user_data.user_emails WHERE (email_vaule = user_email));
END
$$;
