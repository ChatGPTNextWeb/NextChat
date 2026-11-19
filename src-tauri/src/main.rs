// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod stream;
mod fetch;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      stream::stream_fetch,
      fetch::http_fetch,
      fetch::http_fetch_text,
      fetch::http_fetch_json
    ])
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
