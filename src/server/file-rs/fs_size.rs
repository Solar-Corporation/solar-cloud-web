use std::path::PathBuf;
use std::str;

use async_recursion::async_recursion;
use napi::bindgen_prelude::*;
use tokio::fs;
use xattr::{get, set};

pub struct FsSize {}

impl FsSize {
	pub fn disk_size() -> u64 {
		// let mut sys = System::new_all();
		// sys.refresh_all();
		// return sys.disks()[0].available_space();
		return 1099511627776;
	}

	pub async fn available_size(data_path: &PathBuf) -> Result<u64> {
		const BASE_SIZE: &str = "5368709120";

		let metadata_vec_value = get(&data_path, "available_space")
			.unwrap_or(Some(BASE_SIZE.as_bytes().to_vec()))
			.unwrap_or(BASE_SIZE.as_bytes().to_vec());
		let metadata_value = str::from_utf8(&metadata_vec_value).unwrap();

		return Ok(metadata_value.parse::<u64>().unwrap());
	}

	#[async_recursion]
	pub async fn dir_size(dir_path: &PathBuf) -> Result<u64> {
		let mut total_size = 0;
		let mut dir = fs::read_dir(dir_path).await?;

		while let Some(item) = dir.next_entry().await? {
			if item.metadata().await?.is_dir() {
				total_size += FsSize::dir_size(&item.path()).await?;
				continue;
			}
			total_size += item.metadata().await?.len();
		}

		return Ok(total_size);
	}

	/// Метод получает из свойств директории количество занимаемого места.
	pub async fn total_size(data_path: &PathBuf) -> Result<u64> {
		const NONE_MSG: &str = "none_space";

		let metadata_vec_value = get(&data_path, "usage_space")
			.unwrap_or(Some(NONE_MSG.as_bytes().to_vec()))
			.unwrap_or(NONE_MSG.as_bytes().to_vec());
		let metadata_value = str::from_utf8(&metadata_vec_value).unwrap();

		if metadata_value == NONE_MSG {
			let size = FsSize::dir_size(&data_path).await?;
			set(&data_path, "usage_space", size.to_string().as_bytes());
			return Ok(size);
		}

		return Ok(metadata_value.parse::<u64>().unwrap());
	}
}
