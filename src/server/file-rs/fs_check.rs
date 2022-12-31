use std::path::{Path, PathBuf};
use std::str;

use napi::bindgen_prelude::*;
use xattr::get;

pub struct FsCheck {}

impl FsCheck {
	pub async fn is_exist(file_path: &PathBuf) -> Result<bool> {
		let directory_path = Path::new(&file_path);
		let is_exist: bool = directory_path.exists();
		return Ok(is_exist);
	}

	pub async fn is_delete(data_path: &PathBuf) -> Result<bool> {
		const IS_DELETE: &str = "false";

		let metadata_vec_value = get(&data_path, "user.is_delete")
			.unwrap_or(Some(IS_DELETE.as_bytes().to_vec()))
			.unwrap_or(IS_DELETE.as_bytes().to_vec());
		let metadata_value = str::from_utf8(&metadata_vec_value).unwrap();

		return Ok(metadata_value != IS_DELETE);
	}

	pub async fn is_favorite(data_path: &PathBuf) -> Result<bool> {
		const IS_FAVORITE: &str = "false";

		let metadata_vec_value = get(&data_path, "user.is_favorite")
			.unwrap_or(Some(IS_FAVORITE.as_bytes().to_vec()))
			.unwrap_or(IS_FAVORITE.as_bytes().to_vec());
		let metadata_value = str::from_utf8(&metadata_vec_value).unwrap();

		return Ok(metadata_value != IS_FAVORITE);
	}
}
