use std::io::{self, Read};
use std::path::{Path, PathBuf};
use std::process::exit;

use napi::bindgen_prelude::*;
use napi_derive::napi;
use xattr::set;

mod file_system;

#[napi(object)]
pub struct UserDir {
	pub uuid: String,
	pub storage: i64,
}

#[napi]
struct FileService {}

#[napi]
impl FileService {
	/// Метод проверяет, хватает ли места на диске.
	/// Если места хватает, то создаёт папку пользователя.
	#[napi]
	pub async fn create_user_dir(user: UserDir, base_path: String) -> Result<String> {
		let disc_space = file_system::FileSystem::disk_size();

		let total_size = file_system::FileSystem::total_size(&PathBuf::from(&base_path)).await?;
		if disc_space - total_size < (user.storage as u64) {
			exit(1);
		}

		let user_dir = Path::new(&base_path).join(user.uuid);
		file_system::FileSystem::create_dir(&user_dir).await?;
		set(&user_dir, "available_space", (user.storage as u64).to_string().as_bytes())
			.expect("Cannot insert system value!");

		return Ok(user_dir.into_os_string().into_string().unwrap());
	}
}
