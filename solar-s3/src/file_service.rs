use std::path::{Path, PathBuf};

use napi::bindgen_prelude::*;
use napi_derive::napi;
use xattr::set;

use file_system::FileSystem;
use fs_check::FsCheck;
use fs_metadata::FsMetadata;
use fs_size::FsSize;

mod fs_check;
mod file_system;
mod fs_size;
mod fs_metadata;

#[napi(object)]
pub struct UserDir {
	pub uuid: String,
	pub storage: i64,
}

#[napi(object)]
pub struct UserFile {
	pub buffer: Option<Buffer>,
	pub file_path: String,
	pub mime_type: Option<String>,
	pub see_time: Option<i64>,
	pub size: Option<i64>,
}

#[napi(object)]
pub struct DeleteMarked {
	#[napi(ts_type = "Date")]
	pub time: i64,
	pub path: String,
	pub is_dir: bool,
}

#[napi(object)]
pub struct FsItem {
	pub name: String,
	pub path: String,
	pub size: String,
	pub file_type: String,
	pub mime_type: String,
	pub is_dir: bool,
	pub is_favorite: bool,
	pub see_time: i64,
	pub delete_at: Option<i64>,
}

#[napi]
struct FileService {}

#[napi]
impl FileService {
	/// Метод проверяет, хватает ли места на диске.
	/// Если места хватает, то создаёт папку пользователя.
	#[napi]
	pub async fn create_user_dir(user: UserDir, base_path: String) -> Result<String> {
		let disc_space = FsSize::disk_size();

		let total_size = FsSize::total_size(&PathBuf::from(&base_path)).await?;
		if disc_space - total_size < (user.storage as u64) {
			return Err(Error::new(Status::Cancelled, "No free space".to_owned()));
		}

		let user_dir = Path::new(&base_path).join(user.uuid);
		FileSystem::create_dir(&user_dir).await?;
		set(&user_dir, "user.available_space", (user.storage as u64).to_string().as_bytes());

		return Ok(user_dir.into_os_string().into_string().unwrap());
	}

	/// Метод сохраняет файл в папку пользователя
	#[napi]
	pub async fn save_file(file: UserFile, uuid: String, base_path: String) -> Result<()> {
		let file_path = PathBuf::from(&file.file_path);
		let is_exist = FsCheck::is_exist(&file_path).await?;
		if is_exist {
			return Err(Error::new(Status::Cancelled, "File already exist!".to_owned()));
		}

		let user_dir = Path::new(&base_path).join(uuid);
		let available_size = FsSize::available_size(&user_dir).await?;

		let total_size = FsSize::total_size(&user_dir).await?;
		let buffer = file.buffer.expect("");
		let file_size = buffer.len() as u64;
		if available_size - total_size < file_size {
			return Err(Error::new(Status::Cancelled, "No free space".to_owned()));
		}

		FileSystem::save_file(&buffer.into(), &file_path).await?;

		let size = total_size + file_size;
		set(&user_dir, "user.usage_space", size.to_string().as_bytes());

		return Ok(());
	}

	/// Метод получения файла по пути
	#[napi]
	pub async fn get_file(path: String) -> Result<UserFile> {
		let file_path = PathBuf::from(&path);

		let is_exist = FsCheck::is_exist(&file_path).await?;
		if !is_exist {
			return Err(Error::new(Status::Cancelled, "The file does not exist".to_owned()));
		}

		let is_delete = FsCheck::is_delete(&file_path).await?;
		if is_delete {
			return Err(Error::new(Status::Cancelled, "The file has been deleted!".to_owned()));
		}

		let user_file = FileSystem::get_file(&file_path).await?;
		return Ok(user_file);
	}

	/// Метод возвращает файлы, которые находятся в директории по заданному пути
	#[napi]
	pub async fn get_dir_items(path: String) -> Result<Vec<FsItem>> {
		let dir_path = PathBuf::from(&path);

		let is_exist = FsCheck::is_exist(&dir_path).await?;
		if !is_exist {
			return Err(Error::new(Status::Cancelled, "The file does not exist".to_owned()));
		}

		let is_delete = FsCheck::is_delete(&dir_path).await?;
		if is_delete {
			return Err(Error::new(Status::Cancelled, "The file has been deleted!".to_owned()));
		}

		let file_tree = FileSystem::dir_items(&dir_path).await?;
		return Ok(file_tree);
	}

	/// Метод переименовывает название директории или файла
	#[napi]
	pub async fn rename(path: String, new_path: String) -> Result<()> {
		let old_path = PathBuf::from(&path);

		let is_exist = FsCheck::is_exist(&old_path).await?;
		if !is_exist {
			return Err(Error::new(Status::Cancelled, "The file does not exist".to_owned()));
		}

		FileSystem::rename(&old_path, &PathBuf::from(new_path)).await?;

		return Ok(());
	}

	/// Метод помечает директорию или файл как удалённую
	#[napi]
	pub async fn mark_as_delete(path: String) -> Result<DeleteMarked> {
		let delete_path = PathBuf::from(&path);

		let is_exist = FsCheck::is_exist(&delete_path).await?;
		if !is_exist {
			return Err(Error::new(Status::Cancelled, "The file does not exist".to_owned()));
		}

		let delete_marked = FsMetadata::set_delete(&delete_path).await?;
		return Ok(delete_marked);
	}

	/// Метод создаёт директорию по заданному пути
	#[napi]
	pub async fn create_dir(dir_path: String) -> Result<()> {
		let create_path = PathBuf::from(&dir_path);

		let is_exist = FsCheck::is_exist(&create_path).await?;
		if is_exist {
			return Err(Error::new(Status::Cancelled, "The dir already exist!".to_owned()));
		}

		FileSystem::create_dir(&create_path).await?;

		return Ok(());
	}

	/// Метод переносит файлы по заданному пути
	#[napi]
	pub async fn move_path(path_from: String, path_to: String) -> Result<()> {
		let path_from = PathBuf::from(&path_from);
		let path_to = PathBuf::from(&path_to);

		let is_exist_from = FsCheck::is_exist(&path_from).await?;
		let is_exist_to = FsCheck::is_exist(&path_to).await?;
		if !is_exist_from && !is_exist_to {
			return Err(Error::new(Status::Cancelled, "The dir or file does not exist".to_owned()));
		}

		let is_delete = FsCheck::is_delete(&path_from).await?;
		if is_delete {
			return Err(Error::new(Status::Cancelled, "The dir or file been deleted!".to_owned()));
		}

		FileSystem::move_path(&path_from, &path_to).await?;

		return Ok(());
	}

	/// Метод устанавливает статус директории
	#[napi]
	pub async fn set_favorite(path: String, state: bool) -> Result<()> {
		let path_from = PathBuf::from(&path);
		let is_exist = FsCheck::is_exist(&path_from).await?;
		if !is_exist {
			return Err(Error::new(Status::Cancelled, "The dir or file does not exist".to_owned()));
		}

		let is_delete = FsCheck::is_delete(&path_from).await?;
		if is_delete {
			return Err(Error::new(Status::Cancelled, "The dir or file been deleted!".to_owned()));
		}

		FsMetadata::set_favorite(&path_from, &state).await?;

		return Ok(());
	}

	/// Метод получает метаданные директории или файла
	#[napi]
	pub async fn get_files_metadata(paths: Vec<String>, get_delete: bool) -> Result<Vec<FsItem>> {
		let mut files: Vec<FsItem> = Vec::new();

		for path in paths.into_iter() {
			let path_buf = PathBuf::from(&path);

			let is_exist = FsCheck::is_exist(&path_buf).await?;
			if !is_exist {
				return Err(Error::new(Status::Cancelled, "The dir or file does not exist".to_owned()));
			}

			let is_delete = FsCheck::is_delete(&path_buf).await?;
			if is_delete && !get_delete {
				return Err(Error::new(Status::Cancelled, "The dir or file been deleted!".to_owned()));
			}

			files.push(FsMetadata::info(&path_buf).await?);
		}

		return Ok(files);
	}

	/// Метод удаляет метаданные связанные с информацией об удалении файла.
	#[napi]
	pub async fn restore_delete_paths(paths: Vec<String>) -> Result<()> {
		for path in paths.into_iter() {
			let restore_path = PathBuf::from(path);
			FsMetadata::restore_delete(&restore_path).await?;
		}
		return Ok(());
	}

	/// Метод удаляет все переданные пути
	#[napi]
	pub async fn delete_paths(paths: Vec<String>) -> Result<()> {
		for path in paths.into_iter() {
			let delete_path = PathBuf::from(path);
			FileSystem::remove(&delete_path).await?;
		}
		return Ok(());
	}
}
