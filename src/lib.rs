use napi_derive::napi;

#[napi]
async fn print_async(str: String) {
    println!("{str} test")
}
