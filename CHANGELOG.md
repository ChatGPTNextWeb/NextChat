# Changelog

## v1.0.1 (2026-05-30)

### Added
- Windows MSI installer (`.msi`) via WiX Toolset
- Windows NSIS setup wizard (`setup.exe`)
- Interactive build menu (`build-exe.cmd` with [1]-[5] selection)
- Installer features: Start Menu shortcuts, desktop shortcut, Control Panel uninstall, WebView2 detection
- Chinese (zh-CN) and English (en-US) installer UI localization
- `msi-install/` build toolchain with standalone WiX/NSIS scripts
- `VERSION` and `CHANGELOG.md` for release tracking

### Changed
- `tauri.conf.json`: disable built-in bundler (avoids GitHub download timeout in China)
- `install-deps.ps1`: now installs NSIS + WiX Toolset via winget
- `build-exe.ps1`: integrated installer generation as build options
- `release/PROJECT_OVERVIEW.md`: added MSI/setup.exe build documentation
- `release/BUILD.md`: updated with interactive menu and installer docs

### Fixed
- Tauri bundler network timeout when downloading NSIS/WiX from GitHub (use winget instead)

---

## v1.0.0 (2026-05-29)

### Initial Release
- ActorAIchat fork based on NextChat (ChatGPT-Next-Web)
- Default model: DeepSeek V4 Pro
- Skill role system replacing built-in masks (9 roles)
- Slimmed i18n to Chinese + English only
- Tauri 1.x desktop shell with MinGW/GNU toolchain (static linking)
- Portable `.exe` output (~7.8 MB, 85% smaller than MSVC build)
- WebView2-based runtime (no embedded browser)
- Multi-provider support: DeepSeek, OpenAI, Claude, Gemini, etc.
- MCP (Model Context Protocol) support
