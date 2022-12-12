use std::path::{Path, PathBuf};

use async_recursion::async_recursion;
use napi::bindgen_prelude::*;
use sysinfo::{DiskExt, System, SystemExt};
use tokio::{fs, io::AsyncWriteExt};

pub struct FileSystem {}


impl FileSystem {
    pub async fn save_file(file_data: Buffer, file_path: String) -> Result<()> {
        let directory_path = Path::new(&file_path);
        if !directory_path.exists() {
            let parent = directory_path.parent().unwrap();
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

    #[async_recursion]
    pub async fn dir_size(dir_path: PathBuf) -> Result<u64> {
        let mut total_size = 0;
        let mut dir = fs::read_dir(dir_path).await?;

        while let Some(item) = dir.next_entry().await? {
            if item.metadata().await?.is_dir() {
                total_size += FileSystem::dir_size(item.path()).await?;
                continue;
            }
            total_size += item.metadata().await?.len();
        }

        return Ok(total_size);
    }

    pub async fn is_file_exist(file_path: String) -> Result<bool> {
        let directory_path = Path::new(&file_path);
        let is_exist: bool = directory_path.exists();
        return Ok(is_exist);
    }

    pub async fn get_file(file_path: String) -> Result<Buffer> {
        let file = fs::read(file_path).await?;
        return Ok(file.into());
    }

    pub async fn delete_file(file_path: String) -> Result<()> {
        fs::remove_file(file_path).await?;
        return Ok(());
    }

    pub async fn rename(old_path: String, new_path: String) -> Result<()> {
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
}
