CREATE OR REPLACE FUNCTION user_data.get_user_by_id(id integer) RETURNS jsonb
	LANGUAGE plpgsql
AS
$$
DECLARE
	result_user jsonb;
	user_row    user_data.user_email;
BEGIN
	SELECT *
	FROM user_data.user_email
	WHERE (user_id = id)
	INTO user_row;

	SELECT JSONB_BUILD_OBJECT('id', user_row.user_id)
		       || JSONB_BUILD_OBJECT('email', user_row.email_value)
		       || JSONB_BUILD_OBJECT('nickname', user_row.user_nickname)
		       || JSONB_BUILD_OBJECT('uuid', user_row.user_uuid)
		       || JSONB_BUILD_OBJECT('fullName', JSONB_BUILD_OBJECT('firstName', user_row.user_first_name,
		                                                            'middleName', user_row.user_middle_name,
		                                                            'lastName', user_row.user_last_name))
		       || JSONB_BUILD_OBJECT('createAt', user_row.create_at)
		       || JSONB_BUILD_OBJECT('updateAt', user_row.update_at)
	INTO result_user;
	RETURN result_user;
END
$$;
