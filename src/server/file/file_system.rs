use napi::bindgen_prelude::*;
use napi_derive::napi;
use tokio::fs;
use tokio::io::AsyncWriteExt;

#[napi]
struct FileSystem {}

#[napi]
impl FileSystem {
    #[napi]
    pub async fn save_file(file_data: Buffer, file_path: String) -> Result<()> {
        let mut file = fs::File::create(file_path).await?;
        let buf: Vec<u8> = file_data.into();
        file.write_all(&buf).await?;
        return Ok(());
    }

    #[napi]
    pub async fn get_file(file_path: String) -> Result<Buffer> {
        let file = fs::read(file_path).await?;
        return Ok(file.into());
    }

    #[napi]
    pub async fn delete_file(file_path: String) -> Result<()> {
        fs::remove_file(file_path).await?;
        return Ok(());
    }

    #[napi]
    pub async fn rename(old_path: String, new_path: String) -> Result<()> {
        fs::rename(old_path, new_path).await?;
        return Ok(());
    }

    #[napi]
    pub async fn create_dir(dir_path: String) -> Result<()> {
        fs::create_dir(dir_path).await?;
        return Ok(());
    }

    #[napi]
    pub async fn remove_dir(dir_path: String) -> Result<()> {
        fs::remove_dir_all(dir_path).await?;
        return Ok(());
    }
}
