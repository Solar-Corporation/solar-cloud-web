use std::os::unix::fs::MetadataExt;
use std::path::PathBuf;

use async_recursion::async_recursion;
use mime_guess::mime;
use napi::bindgen_prelude::*;
use tokio::{fs, io::AsyncWriteExt};

use crate::file_service::{FsCheck, FsItem, FsMetadata, UserFile};

pub struct FileSystem {}

impl FileSystem {
    pub async fn save_file(buf: &Vec<u8>, file_path: &PathBuf) -> Result<()> {
        if !file_path.exists() {
            let parent = file_path.parent().unwrap();
            fs::create_dir_all(&parent).await?;
        }

        let mut file = fs::File::create(&file_path).await?;

        file.write_all(&buf).await?;

        return Ok(());
    }

    pub async fn get_file(file_path: &PathBuf) -> Result<UserFile> {
        let str_file_path = file_path.to_str().unwrap();
        let file = fs::read(&file_path).await?;
        let mime_type = mime_guess::from_path(&str_file_path);
        let metadata = fs::metadata(&file_path).await?;

        let user_file = UserFile {
            buffer: Some(file.into()),
            file_path: str_file_path.to_string(),
            mime_type: Some(mime_type.first().unwrap_or(mime::TEXT_PLAIN).to_string()),
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
    pub async fn move_dir(path_from: &PathBuf, path_to: &PathBuf) -> Result<()> {
        let mut dir = fs::read_dir(&path_from).await?;

        while let Some(item) = dir.next_entry().await? {
            let item_path_to = path_to.join(&item.file_name());
            if item.metadata().await?.is_dir() {
                fs::create_dir_all(&item_path_to).await?;
                FileSystem::move_dir(&item.path(), &item_path_to).await?;
                continue;
            }
            fs::copy(&item.path(), &item_path_to).await?;
        }
        return Ok(());
    }

    pub async fn move_path(path_from: &PathBuf, path_to: &PathBuf) -> Result<()> {
        fs::create_dir_all(&path_to).await?;
        if fs::metadata(&path_from).await?.is_dir() {
            FileSystem::move_dir(&path_from, &path_to).await?;
        } else {
            let item_path_to = path_to.join(&path_from.file_name().unwrap());
            fs::copy(&path_from, &item_path_to).await?;
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

    pub async fn dir_items(dir_path: &PathBuf) -> Result<Vec<FsItem>> {
        const MILLISECOND: i64 = 1000;

        let mut dir_items: Vec<FsItem> = Vec::new();
        let mut dir = fs::read_dir(dir_path).await?;
        if !fs::metadata(dir_path).await?.is_dir() {
            return Err(Error::new(Status::Cancelled, "This is not a directory".to_owned()));
        }

        while let Some(item) = dir.next_entry().await? {
            let path = &item.path();

            if FsCheck::is_delete(&path).await? {
                continue;
            }

            let item_info = FsMetadata::info(&path).await?;
            dir_items.push(item_info)
        }

        return Ok(dir_items);
    }
}
