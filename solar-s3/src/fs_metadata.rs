use std::ffi::OsStr;
use std::os::unix::fs::MetadataExt;
use std::path::{Path, PathBuf};
use std::str;

use byte_unit::Byte;
use chrono::Utc;
use mime_guess::mime;
use napi::bindgen_prelude::*;
use regex::Regex;
use tokio::fs;
use xattr::{get, remove, set};

use crate::file_service::{DeleteMarked, FsCheck, FsItem};

pub struct FsMetadata {}

impl FsMetadata {
	pub async fn set_delete(path: &PathBuf) -> Result<DeleteMarked> {
		const MILLISECOND: i64 = 1000;

		let delete_at = Utc::now();

		set(&path, "user.is_delete", "true".as_bytes());
		set(&path, "user.delete_time", delete_at.timestamp().to_string().as_bytes());

		return Ok(DeleteMarked {
			time: delete_at.timestamp() * MILLISECOND,
			path: path.to_str().unwrap().to_string(),
			is_dir: fs::metadata(&path).await?.is_dir(),
		})
	}

	pub async fn restore_delete(path: &PathBuf) -> Result<()> {
		remove(&path, "user.is_delete");
		remove(&path, "user.delete_time");
		return Ok(());
	}

	pub async fn get_delete_time(path: &PathBuf) -> Result<Option<i64>> {
		const MILLISECOND: i64 = 1000;
		const IS_DELETE: i64 = 0;

		let metadata_delete_value = get(&path, "user.delete_time")
			.unwrap_or(Some(IS_DELETE.to_string().as_bytes().to_vec()))
			.unwrap_or(IS_DELETE.to_string().as_bytes().to_vec());

		let metadata_value = str::from_utf8(&metadata_delete_value)
			.unwrap()
			.parse::<i64>()
			.unwrap();

		if metadata_value != 0 {
			return Ok(Some(metadata_value * MILLISECOND));
		}
		return Ok(None);
	}

	pub async fn set_favorite(path: &PathBuf, state: &bool) -> Result<()> {
		let test = set(&path, "user.is_favorite", &state.to_string().as_bytes()).err();
		return Ok(());
	}

	pub async fn info(path: &PathBuf) -> Result<FsItem> {
		const MILLISECOND: i64 = 1000;
		let store_path = option_env!("STORE_PATH_SECRET").unwrap();
		let uuid_regex = Regex::new(r"[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}").unwrap();
		let uuid = uuid_regex.captures(path.to_str().unwrap()).unwrap().get(0).unwrap().as_str();

		let base_path = format!("{}/{}", store_path, uuid);

		let metadata = fs::metadata(&path).await?;
		let byte = Byte::from_bytes(metadata.len() as u128);
		let size = byte.get_appropriate_unit(true);

		let ext = Path::new(&path)
			.extension()
			.unwrap_or(OsStr::new(""))
			.to_str()
			.unwrap_or("");

		let file_type = mime_guess::from_path(&path)
			.first()
			.unwrap_or(mime::TEXT_PLAIN)
			.to_string();

		let delete_at = FsMetadata::get_delete_time(&path).await?;
		return Ok(FsItem {
			name: path.file_name().unwrap().to_str().unwrap().to_string(),
			path: path.to_str().unwrap().replace(base_path.as_str(), ""),
			size: size.to_string(),
			file_type: ext.to_string(),
			mime_type: file_type,
			is_dir: metadata.is_dir(),
			is_favorite: FsCheck::is_favorite(&path).await?,
			see_time: metadata.atime() * MILLISECOND,
			delete_at,
		});
	}
}
