use tauri::{Builder, Menu, MenuItem, Submenu, Wry, AboutMetadata, CustomMenuItem};

pub fn apply_menu(builder: Builder<Wry>) -> Builder<Wry> {
  let app_menu = Menu::new()
    .add_native_item(MenuItem::About("Vess".to_string(), AboutMetadata::default()))
    .add_native_item(MenuItem::Services)
    .add_native_item(MenuItem::Hide)
    .add_native_item(MenuItem::Quit);
  let edit_menu = Menu::new()
    .add_native_item(MenuItem::Undo)
    .add_native_item(MenuItem::Redo)
    .add_native_item(MenuItem::Copy)
    .add_native_item(MenuItem::Cut)
    .add_native_item(MenuItem::Paste)
    .add_native_item(MenuItem::SelectAll)
    .add_item(CustomMenuItem::new("opendevtools", "Open Devtools"))
    .add_native_item(MenuItem::Quit);
  let menu = Menu::new()
    .add_submenu(Submenu::new("Vess", app_menu))
    .add_submenu(Submenu::new("Edit", edit_menu));
  builder.menu(menu).on_menu_event(|evt| {
    match evt.menu_item_id() {
      "opendevtools" => {
        evt.window().open_devtools();
      },
      _ => {}
    }
  })
}
