use std::io::{self, Read};
use std::path::{Path, PathBuf};
use std::process::exit;

use napi::bindgen_prelude::*;
use napi_derive::napi;

// #[path = "./file_system.rs"]
mod file_system;
// use file_system;

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
		let app_size = file_system::FileSystem::dir_size(PathBuf::from(&base_path)).await?;
		if disc_space - app_size < (user.storage as u64) {
			exit(1);
		}
		let user_dir = Path::new(&base_path).join(user.uuid);
		file_system::FileSystem::create_dir(&user_dir).await?;
		return Ok(user_dir.into_os_string().into_string().unwrap());
	}
}
