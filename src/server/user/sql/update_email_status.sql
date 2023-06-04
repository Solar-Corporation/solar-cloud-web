CREATE OR REPLACE PROCEDURE user_data.update_email_status(update_id int)
	LANGUAGE plpgsql
AS
$$
BEGIN
	UPDATE user_data.user_emails ue
	SET is_verify = NOT is_verify
	WHERE fk_user_id = update_id;
END;
$$
