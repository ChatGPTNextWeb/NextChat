# ActorAIchat - Windows Installer Build Tools

## Quick Start

```powershell
# First time: install all build deps
.\release\install-deps.cmd

# Double-click to build (interactive menu)
.\release\build-exe.cmd
```

The build menu lets you choose:

```
  [1] Build exe only (portable)
  [2] Build exe + setup.exe  (NSIS installer)
  [3] Build exe + .msi       (Windows Installer)
  [4] Build all (exe + setup.exe + .msi)
  [5] Check dependencies only
```

Output in `release/`:

| File | Type |
|------|------|
| `ActorAIchat.exe` | Portable |
| `ActorAIchat_*_x64-setup.exe` | NSIS installer wizard |
| `ActorAIchat_*_x64_zh-CN.msi` | Windows Installer package |

## Files

```
msi-install/
├── setup.nsi           # NSIS installer script
├── build-setup.ps1     # setup.exe builder (calls makensis.exe)
├── main.wxs            # WiX installer template
├── zh-CN.wxl           # Chinese UI strings
├── en-US.wxl           # English UI strings
├── build-msi.ps1       # .msi builder (calls candle.exe + light.exe)
├── license.txt         # MIT license (referenced by setup.nsi)
└── README.md
```

## Prerequisites

All installed by `release\install-deps.cmd` via winget:

| Tool | winget package | Purpose |
|------|---------------|---------|
| NSIS v3 | `NSIS.NSIS` | Build setup.exe |
| WiX Toolset v3 | `WiXToolset.WiXToolset` | Build .msi |

## Installer Features

Both setup.exe and .msi provide:

- Start Menu shortcuts + uninstall entry
- Desktop shortcut
- WebView2 runtime detection
- Control Panel uninstall registration
- Chinese / English UI

## Standalone Build (without Tauri)

```powershell
# Already have ActorAIchat.exe?
powershell -File msi-install\build-setup.ps1            # wrap into setup.exe
powershell -File msi-install\build-msi.ps1 -Lang zh-CN  # wrap into .msi
```
