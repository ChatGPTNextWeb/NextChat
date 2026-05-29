<#
  ActorAIchat - 一键安装编译依赖环境 (Windows)
  ============================================
  自动安装（已存在则跳过，可重复运行）：
    1. Node.js LTS  + Yarn
    2. Rust (rustup) + GNU 工具链 stable-x86_64-pc-windows-gnu
    3. MinGW-w64 (WinLibs GCC, MSVCRT)   —— 链接器

  依赖通过 winget 安装；需要管理员权限（脚本会自动申请）。
  装完后即可运行 build-exe.cmd 一键编译。
#>
[CmdletBinding()]
param([switch]$NoPause)

$ErrorActionPreference = 'Stop'

function Info($m) { Write-Host "[deps] $m" -ForegroundColor Green }
function Warn($m) { Write-Host "[deps] $m" -ForegroundColor Yellow }
function Fail($m) {
  Write-Host "[deps] $m" -ForegroundColor Red
  if (-not $NoPause) { Read-Host "按回车关闭" }
  exit 1
}

# ---- 自动提权（机器级安装需要管理员）----
$principal = New-Object Security.Principal.WindowsPrincipal(
  [Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)) {
  Info "正在申请管理员权限..."
  Start-Process powershell.exe -Verb RunAs `
    -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
  return
}

# ---- 从注册表刷新 PATH（让本会话看到刚装好的工具）----
function Update-EnvPath {
  $env:Path = @(
    [Environment]::GetEnvironmentVariable('Path', 'Machine')
    [Environment]::GetEnvironmentVariable('Path', 'User')
  ) -join ';'
}

if (-not (Get-Command winget.exe -ErrorAction SilentlyContinue)) {
  Fail "未找到 winget。请先从 Microsoft Store 安装 ‘App Installer’（应用安装程序），然后重试。"
}

function Install-WingetPackage($id, $name) {
  Info "正在安装 $name ($id) ..."
  winget install -e --id $id `
    --accept-package-agreements --accept-source-agreements --disable-interactivity
  Update-EnvPath
}

Info "===== 开始检查 / 安装编译依赖 ====="

# 1) Node.js + Yarn
Update-EnvPath
if (Get-Command node.exe -ErrorAction SilentlyContinue) {
  Info "Node.js 已安装: $(node -v)"
} else {
  Install-WingetPackage 'OpenJS.NodeJS.LTS' 'Node.js LTS'
}

Update-EnvPath
if ((Get-Command yarn.cmd -ErrorAction SilentlyContinue) -or
    (Get-Command yarn -ErrorAction SilentlyContinue)) {
  Info "Yarn 已安装"
} else {
  Info "通过 corepack 启用 Yarn ..."
  try {
    corepack enable
    corepack prepare yarn@1.22.22 --activate
  } catch {
    Warn "corepack 启用失败，改用 npm 全局安装 yarn"
    npm install -g yarn
  }
  Update-EnvPath
}

# 2) Rust + GNU 工具链
$cargoBin = Join-Path $env:USERPROFILE '.cargo\bin'
if (Test-Path (Join-Path $cargoBin 'cargo.exe')) {
  Info "Rust 已安装"
} else {
  Install-WingetPackage 'Rustlang.Rustup' 'Rust (rustup)'
}
$rustup = Join-Path $cargoBin 'rustup.exe'
if (-not (Test-Path $rustup)) { Fail "未找到 rustup，Rust 安装可能失败。" }
Info "确保 GNU 工具链 stable-x86_64-pc-windows-gnu ..."
$env:RUSTUP_DISABLE_SELF_UPDATE = '1'
& $rustup toolchain install stable-x86_64-pc-windows-gnu

# 3) MinGW-w64 (WinLibs GCC)
$pkgRoot = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
$gcc = $null
if (Test-Path $pkgRoot) {
  $gcc = Get-ChildItem $pkgRoot -Recurse -Filter 'x86_64-w64-mingw32-gcc.exe' `
           -ErrorAction SilentlyContinue | Select-Object -First 1
}
if ($gcc) {
  Info "MinGW 已安装: $($gcc.FullName)"
} else {
  Install-WingetPackage 'BrechtSanders.WinLibs.POSIX.MSVCRT' 'MinGW-w64 (WinLibs GCC)'
}

Info "===== 依赖环境安装完成 ====="
Info "现在可以运行 build-exe.cmd 一键编译 exe。"
if (-not $NoPause) { Read-Host "按回车关闭" }
