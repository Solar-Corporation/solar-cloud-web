CREATE OR REPLACE VIEW user_data.user_email
			(email_id, email_value, user_id, user_password, user_nickname, user_first_name, user_last_name,
			 user_middle_name, create_at, update_at, user_uuid)
AS
SELECT user_emails.email_id,
       user_emails.email_vaule,
       u.user_id,
       u.user_password,
       u.user_nickname,
       u.user_first_name,
       u.user_last_name,
       u.user_middle_name,
       u.create_at,
       u.update_at,
       u.user_uuid
FROM user_data.user_emails
	     JOIN user_data.users u ON user_emails.fk_user_id = u.user_id;

ALTER TABLE user_data.user_email
	OWNER TO postgres;

