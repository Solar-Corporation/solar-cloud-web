// use napi_derive::napi;
//
// #[napi]
// async fn print_async(str: String) {
//     println!("{str} test")
// }
// #![allow(dead_code)]
// #![allow(unreachable_code)]
// #![allow(clippy::disallowed_names)]

// use napi_derive::napi;
//
// #[napi]
// /// This is a const
// pub const DEFAULT_COST: u32 = 12;
//
// #[napi(skip_typescript)]
// pub const TYPE_SKIPPED_CONST: u32 = 12;
//
// #[path = "server/js_mod.rs"]
// mod js_mod;
