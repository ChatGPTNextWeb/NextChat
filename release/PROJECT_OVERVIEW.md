# ActorAIchat —— 项目梳理与发布说明

> 本文件由发布构建过程生成，记录项目结构、构建流水线，以及本次为「最小体积 / 最少安装 / 最少占盘」所做的优化决策。

## 1. 项目定位

ActorAIchat 基于开源项目 **NextChat (ChatGPT-Next-Web)** 二次开发，是一个跨平台的
大模型对话客户端。本仓库已在上游基础上做了如下定制（见近期提交）：

- **默认模型切换为 DeepSeek V4**：`deepseek-v4-flash` / `deepseek-v4-pro`
  （`SUMMARIZE_MODEL` 等也统一指向 `deepseek-v4-pro`）。
- **内置 Mask 改造为「Skill 角色」系统**：用 `app/skills/` 下的角色定义替换了
  上游的内置面具，包含 通用 / 运营 / 程序员 / 产品经理 / 销售 / 工程师 / 艺术家 /
  设计师 / 教师 共 9 个角色，默认角色为「通用」。
- **精简供应商**：移除了遗留的旧 provider，并删除了 Docker 相关产物，聚焦桌面端发布。
- **多语言精简为中/英两种**：`app/locales/` 仅保留 `cn` / `en`，删除了其余 18 种语言
  及繁体 `tw`；README、docs、masks 的多语言副本一并删除；去掉了仅为阿拉伯语服务的
  RTL 处理（`home.tsx` / `home.module.scss`）。

## 2. 架构总览

```
┌─────────────────────────────────────────────┐
│  前端 (Next.js 14, React 18, TypeScript)      │
│  app/  —— 组件 / 状态(zustand) / skills 角色   │
│         BUILD_MODE=export 静态导出 → out/      │
└───────────────────────┬─────────────────────┘
                        │  out/ 作为 distDir
┌───────────────────────▼─────────────────────┐
│  桌面壳 (Tauri 1.x, Rust)                      │
│  src-tauri/  —— 加载 out/ 静态资源，提供原生     │
│  能力(窗口/文件/剪贴板/HTTP/通知)，产出单个 .exe │
└─────────────────────────────────────────────┘
```

- **前端**：Next.js 静态导出，关闭 chunk 拆分（`LimitChunkCountPlugin`），
  导出模式下用 `app/mcp/actions.export-stub` 替换服务端 MCP action，避免
  `"use server"` 进入静态包。
- **桌面壳**：Tauri 读取 `../out` 作为前端资源（`tauri.conf.json > build.distDir`），
  Rust 侧依赖 `reqwest` / `tauri-plugin-window-state` 等，编译为原生可执行文件。

## 3. 构建流水线

```
yarn export                      # 1) 生成前端静态站点 → out/
  └─ yarn mask                   #    先编译内置 mask/skill
  └─ next build (BUILD_MODE=export)

tauri build --target <triple>    # 2) 编译 Rust，把 out/ 打进原生 exe
  └─ beforeBuildCommand 会再跑一次 yarn export

scripts/build-release.sh         # 一键封装：检测环境 → 前端 → exe → 拷到 release/
```

最终可执行文件：`release/ActorAIchat.exe`。

## 4. 本次发布优化（最小体积 / 最少安装 / 最少占盘）

### 4.1 缩小 exe 体积
在 `src-tauri/Cargo.toml` 增加体积优化的 release profile：

| 选项 | 作用 |
|------|------|
| `opt-level = "z"` | 以体积为目标而非速度 |
| `lto = "thin"` | 跨 crate 优化（取 fat-LTO 的大部分收益，但编译快得多） |
| `codegen-units = 16` | 并行编译，显著缩短编译时间 |
| `panic = "abort"` | 去掉异常展开表 |
| `strip = true` | 去除符号 |

> 备注：如需把体积再压榨约 10%，可改为 `lto = true` + `codegen-units = 1`，
> 代价是编译时间成倍增加。

### 4.2 不打安装包，只产出绿色单文件
`tauri.conf.json` 中将 `bundle.active` 置为 **false**：

- 不再生成 MSI / NSIS 安装器，也就不会去下载 WiX / NSIS 工具，**省下安装内容与磁盘**。
- 直接产出可绿色运行的单个 `.exe`，无需安装、无残留。

### 4.3 用轻量 GNU(MinGW) 工具链替代 MSVC
本机此前已删除 Visual Studio / Windows SDK（无 MSVC 链接器），为避免重新安装数 GB 的
VS Build Tools，改用 **GNU 目标 `x86_64-pc-windows-gnu` + 独立 MinGW(WinLibs/GCC)**
编译，体量远小于 VS。

为保证产物**自包含、不需附带 DLL**，在 `src-tauri/.cargo/config.toml` 中对该目标加了
`-C link-args=-static`，把 MinGW 运行库（libwinpthread / libgcc）静态链入 exe
（`msvcrt.dll` 为 Windows 系统组件，始终存在）。

### 4.4 清理无用占盘
- 删除了 `dist/`（约 62MB，上游 Next.js standalone server 产物，Tauri 并不使用）。
- 构建结束后清理 `src-tauri/target/` 中间产物，仅保留最终 `release/ActorAIchat.exe`。

## 5. 如何重新构建

最简单：直接跑发布脚本（已封装好工具链探测、PATH、拷贝）：

```bash
bash scripts/build-release.sh
```

手动等价步骤：

```bash
# 1) 需要 cargo 与独立 MinGW(WinLibs) gcc
export PATH="$HOME/.cargo/bin:<WinLibs>/mingw64/bin:$PATH"

# 2) 用 GNU 工具链作为 host（app 与 build script 都用 gcc 链接）
#    用环境变量而非 `rustup override`，可避开 rustup 自更新检查导致的卡顿
export RUSTUP_TOOLCHAIN=stable-x86_64-pc-windows-gnu
export RUSTUP_DISABLE_SELF_UPDATE=1

cd <repo>
npx tauri build                                   # host=gnu，产物在 target/release/
cp src-tauri/target/release/nextchat.exe        release/ActorAIchat.exe
cp src-tauri/target/release/WebView2Loader.dll  release/WebView2Loader.dll
```

### 踩坑记录（务必注意）

1. **MSVC 链接器缺失**：本机无 Visual Studio / Windows SDK，无法编译 MSVC 目标。
   故全程使用 GNU 目标 + 独立 MinGW。
2. **`/usr/bin/link.exe` 顶替**：在 git-bash 下编译 *MSVC* 目标时，MSYS 的 GNU
   coreutils `link` 会被 rustc 当成链接器调用，报 “link: extra operand”。改用 GNU
   目标后链接器是 `x86_64-w64-mingw32-gcc`，天然规避。
3. **build script 走 host 工具链**：交叉编译到 gnu 目标时，build script/proc-macro
   仍按 *host* 编译。若 host 还是 msvc 会再次撞上缺链接器的问题，所以必须把 **host
   也切成 gnu**（`RUSTUP_TOOLCHAIN=stable-x86_64-pc-windows-gnu`）。
4. **自包含**：`-C link-args=-static`（见 `src-tauri/.cargo/config.toml`）把 MinGW
   运行库静态链入，产物只依赖 Windows 系统 DLL + `WebView2Loader.dll`，无需附带
   libwinpthread/libgcc 等。

## 6. 发布产物与体积

| 文件 | 体积 | 说明 |
|------|------|------|
| `release/ActorAIchat.exe` | ~7.8 MB | 主程序（旧 MSVC 构建为 ~53MB，缩小约 85%） |
| `release/WebView2Loader.dll` | ~154 KB | WebView2 引导（运行时必需，无法在 MinGW 下静态链接） |

运行依赖：Windows 自带的 Edge **WebView2 运行时**（Win11 及较新 Win10 默认已装）。
无需安装器、无残留、绿色运行。
