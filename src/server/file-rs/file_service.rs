use std::path::{Path, PathBuf};
use std::time::SystemTime;

use napi::bindgen_prelude::*;
use napi_derive::napi;
use xattr::set;

use file_system::FileSystem;

mod file_system;

#[napi(object)]
pub struct UserDir {
	pub uuid: String,
	pub storage: i64,
}

#[napi(object)]
pub struct UserFile {
	pub buffer: Buffer,
	pub file_path: String,
	pub mime_type: Option<String>,
	pub see_time: Option<i64>,
	pub size: Option<i64>,
}

#[napi(object)]
pub struct FileTree {
	pub name: String,
	pub path: String,
	pub size: String,
	pub file_type: String,
	pub mime_type: String,
	pub is_dir: bool,
	pub is_favorite: bool,
	pub see_time: i64,
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
			return Err(Error::new(Status::Cancelled, "No free space".to_owned()));
		}

		let user_dir = Path::new(&base_path).join(user.uuid);
		file_system::FileSystem::create_dir(&user_dir).await?;
		set(&user_dir, "available_space", (user.storage as u64).to_string().as_bytes());

		return Ok(user_dir.into_os_string().into_string().unwrap());
	}

	/// Метод сохраняет файл в папку пользователя
	#[napi]
	pub async fn save_file(file: UserFile, uuid: String, base_path: String) -> Result<()> {
		let file_path = &PathBuf::from(&file.file_path);
		let is_exist = FileSystem::is_exist(file_path).await?;
		if is_exist {
			return Err(Error::new(Status::Cancelled, "File already exist!".to_owned()));
		}

		let user_dir = Path::new(&base_path).join(uuid);
		let available_size = FileSystem::available_size(&user_dir).await?;

		let total_size = FileSystem::total_size(&user_dir).await?;
		let file_size = file.buffer.len() as u64;
		if available_size - total_size < file_size {
			return Err(Error::new(Status::Cancelled, "No free space".to_owned()));
		}

		file_system::FileSystem::save_file(file.buffer, file_path).await?;

		let size = total_size + file_size;
		set(&user_dir, "usage_space", size.to_string().as_bytes());

		return Ok(());
	}

	/// Метод получения файла по пути
	#[napi]
	pub async fn get_file(path: String) -> Result<UserFile> {
		let file_path = &PathBuf::from(&path);

		let is_exist = FileSystem::is_exist(&file_path).await?;
		if !is_exist {
			return Err(Error::new(Status::Cancelled, "The file does not exist".to_owned()));
		}

		let is_delete = FileSystem::is_file_delete(&file_path).await?;
		if is_delete {
			return Err(Error::new(Status::Cancelled, "The file has been deleted!".to_owned()));
		}

		let user_file = FileSystem::get_file(&file_path).await?;
		return Ok(user_file);
	}

	/// Метод возвращает файлы, которые находятся в директории по заданному пути
	#[napi]
	pub async fn get_file_tree(path: String, base_path: String) -> Result<Vec<FileTree>> {
		let dir_path = &PathBuf::from(&path);

		let is_exist = FileSystem::is_exist(&dir_path).await?;
		if !is_exist {
			return Err(Error::new(Status::Cancelled, "The file does not exist".to_owned()));
		}
		let file_tree = FileSystem::file_tree(dir_path, &PathBuf::from(&base_path)).await?;
		return Ok(file_tree);
	}

	#[napi]
	pub async fn rename(path: String, new_path: String) -> Result<()> {
		let old_path = &PathBuf::from(&path);

		let is_exist = FileSystem::is_exist(&old_path).await?;
		if !is_exist {
			return Err(Error::new(Status::Cancelled, "The file does not exist".to_owned()));
		}

		FileSystem::rename(&old_path, &PathBuf::from(new_path)).await?;

		return Ok(());
	}
}
