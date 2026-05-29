# ActorAIchat 一键编译说明（Windows）

本目录提供 **两步、全双击** 的编译方案：先装依赖，再编译出 exe。
脚本均为 PowerShell + winget 实现，**无需手动配置环境变量**，可在全新的 Windows 机器上运行。

---

## 一、最快用法（两步）

1. **装依赖**：双击 `install-deps.cmd`
   （会弹 UAC 申请管理员权限，自动用 winget 安装所有缺失依赖；已装的会跳过）
2. **编译**：双击 `build-exe.cmd`
   （先检查依赖是否齐全 → 齐全才编译 → 把 `ActorAIchat.exe` + `WebView2Loader.dll`
   拷到本目录；依赖缺失则提示你先运行第 1 步）

> 第一次编译会先 `yarn install` 并从零编译 Rust 依赖，约需几分钟；之后会快很多。

---

## 二、依赖环境清单

| 依赖 | 用途 | winget 包 ID |
|------|------|-------------|
| Node.js LTS + Yarn | 前端构建（Next.js 静态导出） | `OpenJS.NodeJS.LTS`（Yarn 经 corepack 启用） |
| Rust (rustup) + **GNU 工具链** | 编译原生 exe | `Rustlang.Rustup` + `rustup toolchain install stable-x86_64-pc-windows-gnu` |
| MinGW-w64 (WinLibs GCC) | 链接器（GNU 目标用 gcc 链接） | `BrechtSanders.WinLibs.POSIX.MSVCRT` |

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
copy src-tauri\target\release\nextchat.exe        release\ActorAIchat.exe
copy src-tauri\target\release\WebView2Loader.dll  release\WebView2Loader.dll
```

**git-bash / Linux 用户**：仓库另有等价的 Bash 脚本 `scripts/build-release.sh`
（同样自动探测 MinGW、设好 GNU 工具链、拷贝产物），运行 `bash scripts/build-release.sh` 即可。

---

## 五、脚本清单

| 文件 | 说明 |
|------|------|
| `install-deps.cmd` / `install-deps.ps1` | 一键安装依赖（自动提权、幂等、可重复运行） |
| `build-exe.cmd` / `build-exe.ps1` | 一键编译（先查依赖再编译）。支持 `-CheckOnly`（只检查）、`-NoPause`（不等回车） |
| `PROJECT_OVERVIEW.md` | 项目结构、构建流水线与优化决策梳理 |

仅检查依赖是否就绪（不编译）：

```bat
build-exe.cmd -CheckOnly
```

---

## 六、常见问题

- **提示“未找到 winget”**：从 Microsoft Store 安装 “App Installer”，或更新系统后重试。
- **`build-exe` 提示缺依赖**：先双击 `install-deps.cmd`；装完**新开一个窗口**再编译
  （让 PATH 生效，脚本也会自动从注册表刷新 PATH）。
- **编译报 `link: extra operand` / `link.exe failed`**：说明误用了 MSVC 目标或被 MSYS
  的 link 顶替——本脚本已固定使用 GNU 工具链，正常不会出现；若手动编译请确保设置了
  `RUSTUP_TOOLCHAIN=stable-x86_64-pc-windows-gnu` 且 MinGW 的 bin 在 PATH 中。
- **exe 双击没反应/报缺组件**：安装 Edge WebView2 运行时后再试。
