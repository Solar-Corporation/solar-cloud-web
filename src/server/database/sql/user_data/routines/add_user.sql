CREATE OR REPLACE FUNCTION user_data.add_user(user_data jsonb) RETURNS jsonb
	LANGUAGE plpgsql
AS
$$
DECLARE
	temp_user   user_data.users%rowtype;
	result_user jsonb;
BEGIN


	INSERT INTO user_data.users (user_password, user_first_name, user_last_name,
	                             user_middle_name)
	VALUES (user_data ->> 'password', user_data -> 'fullName' ->> 'firstName',
	        user_data -> 'fullName' ->> 'lastName', user_data -> 'fullName' ->> 'middleName')
	RETURNING * INTO temp_user;

	INSERT INTO user_data.user_emails (email_vaule, fk_user_id)
	VALUES (user_data ->> 'email', temp_user.user_id);

	SELECT user_data
		       - 'password'
		       || JSONB_BUILD_OBJECT('id', temp_user.user_id)
		       || JSONB_BUILD_OBJECT('uuid', temp_user.user_uuid)
		       || JSONB_BUILD_OBJECT('createAt', temp_user.create_at)
		       || JSONB_BUILD_OBJECT('updateAt', temp_user.update_at)
	INTO result_user;

	RETURN result_user;
END
$$;
