CREATE OR REPLACE FUNCTION user_data.get_users() RETURNS jsonb
	LANGUAGE plpgsql
AS
$$
DECLARE
	users_jsonb jsonb;
BEGIN
	SELECT JSONB_AGG(
			       JSONB_BUILD_OBJECT(
					       'id', u.user_id,
					       'email', email_vaule,
					       'nickname', u.user_nickname,
					       'uuid', u.user_uuid,
					       'fullName', JSONB_BUILD_OBJECT('firstName', u.user_first_name,
					                                      'middleName', u.user_middle_name,
					                                      'lastName', u.user_last_name),
					       'createAt', u.create_at,
					       'updateAt', u.update_at,
					       'isVerify', is_verify
				       )
		       )
	FROM user_data.users u
		     JOIN user_data.user_emails ue ON u.user_id = ue.fk_user_id
	INTO users_jsonb;
	RETURN users_jsonb;
END;
$$
