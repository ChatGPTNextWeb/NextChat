# ActorAIchat 一键编译说明（Windows）

本目录提供 **两步、全双击** 的编译方案：先装依赖，再编译出 exe + 安装包。
脚本均为 PowerShell + winget 实现，**无需手动配置环境变量**，可在全新的 Windows 机器上运行。

---

## 一、最快用法（两步）

1. **装依赖**：双击 `install-deps.cmd`
   （会弹 UAC 申请管理员权限，自动用 winget 安装所有缺失依赖；已装的会跳过）
2. **编译**：双击 `build-exe.cmd`
   （弹出交互菜单，选择要构建的产物 → 检查依赖 → 编译 → 拷到本目录）

**交互菜单：**
```
  [1] Build exe only (portable)
  [2] Build exe + setup.exe  (NSIS installer)
  [3] Build exe + .msi       (Windows Installer)
  [4] Build all (exe + setup.exe + .msi)
  [5] Check dependencies only
```

> 第一次编译会先 `yarn install` 并从零编译 Rust 依赖，约需几分钟；之后会快很多。

---

## 二、依赖环境清单

| 依赖 | 用途 | winget 包 ID |
|------|------|-------------|
| Node.js LTS + Yarn | 前端构建（Next.js 静态导出） | `OpenJS.NodeJS.LTS`（Yarn 经 corepack 启用） |
| Rust (rustup) + **GNU 工具链** | 编译原生 exe | `Rustlang.Rustup` + `rustup toolchain install stable-x86_64-pc-windows-gnu` |
| MinGW-w64 (WinLibs GCC) | 链接器（GNU 目标用 gcc 链接） | `BrechtSanders.WinLibs.POSIX.MSVCRT` |
| NSIS v3 | 生成 setup.exe 安装向导 | `NSIS.NSIS` |
| WiX Toolset v3 | 生成 .msi 安装包 | `WiXToolset.WiXToolset` |

**前提**：系统需有 `winget`（Win10 1809+ / Win11 自带；若缺失，从 Microsoft Store 装
“App Installer / 应用安装程序”）。

**运行 exe 的依赖（非编译依赖）**：Windows 自带的 **Edge WebView2 运行时**，
Win11 与较新 Win10 默认已安装；老系统可从微软官网装 “Evergreen WebView2 Runtime”。

---

## 三、为什么用 GNU/MinGW 而不是 MSVC

本项目刻意采用 **`x86_64-pc-windows-gnu` 目标 + 独立 MinGW**，而非 Visual Studio：

- **省磁盘 / 少安装**：MinGW 约 150–200MB，远小于 VS Build Tools 的数 GB。
- **绕开 git-bash 链接器冲突**：在 git-bash 下编译 MSVC 目标时，MSYS 的
  `/usr/bin/link.exe` 会顶替真正的链接器并报 `link: extra operand`；GNU 目标用
  `x86_64-w64-mingw32-gcc` 链接，天然规避。
- **host 也用 GNU**：交叉编译时 build script/proc-macro 仍按 *host* 编译，所以脚本用
  `RUSTUP_TOOLCHAIN=stable-x86_64-pc-windows-gnu` 把 host 一并切到 GNU，全程 gcc 链接。
- **自包含**：`src-tauri/.cargo/config.toml` 里 `-C link-args=-static` 把 MinGW 运行库
  静态链入，产物只依赖 Windows 系统 DLL + `WebView2Loader.dll`。

---

## 四、手动命令（等价于脚本，供排查用）

```powershell
# 1) 依赖（任选其一安装方式后）
winget install -e --id OpenJS.NodeJS.LTS
corepack enable; corepack prepare yarn@1.22.22 --activate
winget install -e --id Rustlang.Rustup
& "$env:USERPROFILE\.cargo\bin\rustup.exe" toolchain install stable-x86_64-pc-windows-gnu
winget install -e --id BrechtSanders.WinLibs.POSIX.MSVCRT

# 2) 编译（在仓库根目录）
$mingw = (Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse `
          -Filter x86_64-w64-mingw32-gcc.exe | Select-Object -First 1).DirectoryName
$env:Path = "$env:USERPROFILE\.cargo\bin;$mingw;$env:Path"
$env:RUSTUP_TOOLCHAIN = "stable-x86_64-pc-windows-gnu"
yarn install            # 首次
npx tauri build
copy src-tauri\target\release\actor-aichat.exe        release\ActorAIchat.exe
copy src-tauri\target\release\WebView2Loader.dll  release\WebView2Loader.dll

# 3) 生成安装包（可选）
winget install NSIS.NSIS                               # 仅首次
winget install -e --id WiXToolset.WiXToolset           # 仅首次，需管理员权限
powershell -File msi-install\build-setup.ps1           # → setup.exe
powershell -File msi-install\build-msi.ps1 -Lang zh-CN # → .msi
```

**git-bash / Linux 用户**：仓库另有等价的 Bash 脚本 `scripts/build-release.sh`
（同样自动探测 MinGW、设好 GNU 工具链、拷贝产物），运行 `bash scripts/build-release.sh` 即可。

---

## 五、脚本清单

| 文件 | 说明 |
|------|------|
| `install-deps.cmd` / `install-deps.ps1` | 一键安装依赖（自动提权、幂等、可重复运行） |
| `build-exe.cmd` / `build-exe.ps1` | 一键编译（交互菜单，选 [1]-[5]） |
| `msi-install/build-setup.ps1` | 独立生成 setup.exe（需 NSIS） |
| `msi-install/build-msi.ps1` | 独立生成 .msi（需 WiX） |
| `PROJECT_OVERVIEW.md` | 项目结构、构建流水线与优化决策梳理 |

---

## 六、常见问题

- **提示“未找到 winget”**：从 Microsoft Store 安装 “App Installer”，或更新系统后重试。
- **`build-exe` 提示缺依赖**：先双击 `install-deps.cmd`；装完**新开一个窗口**再编译
  （让 PATH 生效，脚本也会自动从注册表刷新 PATH）。
- **编译报 `link: extra operand` / `link.exe failed`**：说明误用了 MSVC 目标或被 MSYS
  的 link 顶替——本脚本已固定使用 GNU 工具链，正常不会出现；若手动编译请确保设置了
  `RUSTUP_TOOLCHAIN=stable-x86_64-pc-windows-gnu` 且 MinGW 的 bin 在 PATH 中。
- **exe 双击没反应/报缺组件**：安装 Edge WebView2 运行时后再试。
