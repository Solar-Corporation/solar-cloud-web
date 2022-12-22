use std::os::macos::fs::MetadataExt;
use std::path::{Path, PathBuf};
use std::process::exit;
use std::str;

use async_recursion::async_recursion;
use byte_unit::Byte;
use mime_guess::mime;
use napi::bindgen_prelude::*;
use sysinfo::{DiskExt, System, SystemExt};
use tokio::{fs, io::AsyncWriteExt};
use xattr::{get, set};

use crate::file_service::{FileTree, UserFile};

pub struct FileSystem {}

impl FileSystem {
    pub async fn save_file(file_data: Buffer, file_path: &PathBuf) -> Result<()> {
        if !file_path.exists() {
            let parent = file_path.parent().unwrap();
            fs::create_dir_all(&parent).await?;
        }

        let mut file = fs::File::create(&file_path).await?;
        let buf: Vec<u8> = file_data.into();
        file.write_all(&buf).await?;
        return Ok(());
    }

    pub fn disk_size() -> u64 {
        let mut sys = System::new_all();
        sys.refresh_all();
        return sys.disks()[0].available_space();
    }

    pub async fn available_size(data_path: &PathBuf) -> Result<u64> {
        const BASE_SIZE: &str = "5368709120";
        let metadata_vec_value = get(&data_path, "available_space").unwrap().unwrap_or(BASE_SIZE.as_bytes().to_vec());
        let metadata_value = str::from_utf8(&metadata_vec_value).unwrap();

        return Ok(metadata_value.parse::<u64>().unwrap());
    }

    #[async_recursion]
    pub async fn dir_size(dir_path: &PathBuf) -> Result<u64> {
        let mut total_size = 0;
        let mut dir = fs::read_dir(dir_path).await?;

        while let Some(item) = dir.next_entry().await? {
            if item.metadata().await?.is_dir() {
                total_size += FileSystem::dir_size(&item.path()).await?;
                continue;
            }
            total_size += item.metadata().await?.len();
        }

        return Ok(total_size);
    }

    pub async fn is_exist(file_path: &PathBuf) -> Result<bool> {
        let directory_path = Path::new(&file_path);
        let is_exist: bool = directory_path.exists();
        return Ok(is_exist);
    }

    pub async fn is_file_delete(data_path: &PathBuf) -> Result<bool> {
        const IS_DELETE: &str = "false";

        let metadata_vec_value = get(&data_path, "is_delete").unwrap().unwrap_or(IS_DELETE.as_bytes().to_vec());
        let metadata_value = str::from_utf8(&metadata_vec_value).unwrap();
        return Ok(metadata_value != IS_DELETE);
    }

    pub async fn get_file(file_path: &PathBuf) -> Result<UserFile> {
        let str_file_path = file_path.to_str().unwrap();
        let file = fs::read(&file_path).await?;
        let mime_type = mime_guess::from_path(&str_file_path);
        let metadata = fs::metadata(&file_path).await?;

        let user_file = UserFile {
            buffer: file.into(),
            file_path: str_file_path.to_string(),
            mime_type: Some(mime_type.first().unwrap().to_string()),
            see_time: Some(metadata.st_atime()),
            size: Some(metadata.len() as i64),
        };
        return Ok(user_file);
    }

    pub async fn delete_file(file_path: String) -> Result<()> {
        fs::remove_file(file_path).await?;
        return Ok(());
    }

    pub async fn rename(old_path: &PathBuf, new_path: &PathBuf) -> Result<()> {
        fs::rename(old_path, new_path).await?;
        return Ok(());
    }

    pub async fn create_dir(dir_path: &PathBuf) -> Result<()> {
        fs::create_dir(dir_path).await?;
        return Ok(());
    }

    pub async fn remove_dir(dir_path: String) -> Result<()> {
        fs::remove_dir_all(dir_path).await?;
        return Ok(());
    }

    /// Метод получает из свойств директории количество занимаемого места.
    pub async fn total_size(data_path: &PathBuf) -> Result<u64> {
        const NONE_MSG: &str = "none_space";

        let metadata_vec_value = get(&data_path, "usage_space").unwrap().unwrap_or(NONE_MSG.as_bytes().to_vec());
        let metadata_value = str::from_utf8(&metadata_vec_value).unwrap();

        if metadata_value == NONE_MSG {
            let size = FileSystem::dir_size(&data_path).await?;
            set(&data_path, "usage_space", size.to_string().as_bytes());
            return Ok(size);
        }

        return Ok(metadata_value.parse::<u64>().unwrap());
    }

    pub async fn is_favorite(data_path: &PathBuf) -> Result<bool> {
        const IS_DELETE: &str = "false";

        let metadata_vec_value = get(&data_path, "is_favorite").unwrap().unwrap_or(IS_DELETE.as_bytes().to_vec());
        let metadata_value = str::from_utf8(&metadata_vec_value).unwrap();
        return Ok(metadata_value != IS_DELETE);
    }

    pub async fn file_tree(dir_path: &PathBuf, base_path: &PathBuf) -> Result<Vec<FileTree>> {
        let mut file_tree: Vec<FileTree> = Vec::new();
        let mut dir = fs::read_dir(dir_path).await?;
        if !fs::metadata(dir_path).await?.is_dir() {
            return Err(Error::new(Status::Cancelled, "This is not a directory".to_owned()));
        }

        while let Some(item) = dir.next_entry().await? {
            let metadata = &item.metadata().await?;
            let byte = Byte::from_bytes(metadata.len() as u128);
            let path = &item.path();
            let size = byte.get_appropriate_unit(true);
            let mut ext = "";
            let mime_type = mime_guess::from_path(&path);
            let mut file_type = String::from("");

            if !metadata.is_dir() {
                ext = Path::new(&path).extension().unwrap_or(Path::new("null").as_os_str()).to_str().unwrap_or("");
                file_type = mime_type.first().unwrap_or(mime::TEXT_PLAIN).to_string();
            }

            file_tree.push(FileTree {
                name: item.file_name().into_string().unwrap(),
                path: path.to_str().unwrap().replace(&base_path.to_str().unwrap(), ""),
                size: size.to_string(),
                file_type: ext.to_string(),
                mime_type: file_type,
                is_dir: metadata.is_dir(),
                is_favorite: FileSystem::is_favorite(&item.path()).await?,
                see_time: metadata.st_atime() * 1000,
            });
        }

        return Ok(file_tree);
    }
}
