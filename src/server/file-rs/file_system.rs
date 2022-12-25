use std::ffi::OsStr;
use std::fs::Metadata;
use std::os::unix::fs::MetadataExt;
use std::path::{Path, PathBuf};
use std::str;

use async_recursion::async_recursion;
use byte_unit::Byte;
use chrono::{Duration, Timelike, Utc};
use mime_guess::mime;
use napi::bindgen_prelude::*;
use sysinfo::{DiskExt, System, SystemExt};
use tokio::{fs, io::AsyncWriteExt};
use xattr::{get, set};

use crate::file_service::{DeleteMarked, FileTree, UserFile};
use crate::file_service::FileSystemCheck;

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
                total_size += FileSystem::dir_size(&item.path()).await?;
                continue;
            }
            total_size += item.metadata().await?.len();
        }

        return Ok(total_size);
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
            see_time: Some(metadata.atime()),
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
        fs::create_dir_all(dir_path).await?;
        return Ok(());
    }

    #[async_recursion]
    pub async fn move_path(path_from: &PathBuf, path_to: &PathBuf) -> Result<()> {
        let mut dir = fs::read_dir(&path_from).await?;

        while let Some(item) = dir.next_entry().await? {
            let item_path_to = path_to.join(&item.file_name());

            if item.metadata().await?.is_dir() {
                fs::create_dir_all(&item_path_to).await?;
                FileSystem::move_path(&item.path(), &item_path_to).await?;
                continue;
            }
            fs::copy(&item.path(), &item_path_to).await?;
        }
        FileSystem::remove(&path_from).await?;
        return Ok(());
    }

    pub async fn remove(path: &PathBuf) -> Result<()> {
        let metadata = fs::metadata(&path).await?;

        if metadata.is_dir() {
            fs::remove_dir_all(&path).await?;
            return Ok(());
        }

        fs::remove_file(&path).await?;
        return Ok(());
    }

    /// Метод получает из свойств директории количество занимаемого места.
    pub async fn total_size(data_path: &PathBuf) -> Result<u64> {
        const NONE_MSG: &str = "none_space";

        let metadata_vec_value = get(&data_path, "usage_space")
          .unwrap_or(Some(NONE_MSG.as_bytes().to_vec()))
          .unwrap_or(NONE_MSG.as_bytes().to_vec());
        let metadata_value = str::from_utf8(&metadata_vec_value).unwrap();

        if metadata_value == NONE_MSG {
            let size = FileSystem::dir_size(&data_path).await?;
            set(&data_path, "usage_space", size.to_string().as_bytes());
            return Ok(size);
        }

        return Ok(metadata_value.parse::<u64>().unwrap());
    }

    pub async fn mark_as_delete(path: &PathBuf) -> Result<DeleteMarked> {
        const MILLISECOND: i64 = 1000;

        let dt = Utc::now() + Duration::days(30);

        set(&path, "is_delete", "true".as_bytes());
        set(&path, "delete_time", dt.timestamp().to_string().as_bytes());

        return Ok(DeleteMarked {
            time: dt.timestamp() * MILLISECOND,
            path: path.to_str().unwrap().to_string(),
            is_dir: fs::metadata(&path).await?.is_dir(),
        })
    }
    pub async fn file_tree(dir_path: &PathBuf, base_path: &PathBuf) -> Result<Vec<FileTree>> {
        let mut file_tree: Vec<FileTree> = Vec::new();
        let mut dir = fs::read_dir(dir_path).await?;
        if !fs::metadata(dir_path).await?.is_dir() {
            return Err(Error::new(Status::Cancelled, "This is not a directory".to_owned()));
        }

        while let Some(item) = dir.next_entry().await? {
            let path = &item.path();

            if FileSystemCheck::is_delete(&path).await? {
                continue;
            }

            let metadata = &item.metadata().await?;
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

            file_tree.push(FileTree {
                name: item.file_name().into_string().unwrap(),
                path: path.to_str().unwrap().replace(&base_path.to_str().unwrap(), ""),
                size: size.to_string(),
                file_type: ext.to_string(),
                mime_type: file_type,
                is_dir: metadata.is_dir(),
                is_favorite: FileSystemCheck::is_favorite(&item.path()).await?,
                see_time: metadata.atime() * 1000,
            });
        }

        return Ok(file_tree);
    }
}
