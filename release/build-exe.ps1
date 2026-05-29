<#
  ActorAIchat - 一键编译 exe (Windows)
  ====================================
  流程：先检查依赖环境 -> 全部就绪才编译 -> 把 exe + WebView2Loader.dll 拷到本目录。
  若依赖缺失，会提示先运行 install-deps.cmd。

  参数：
    -CheckOnly   只检查依赖环境，不编译
    -NoPause     结束后不等待回车（供自动化调用）
#>
[CmdletBinding()]
param([switch]$CheckOnly, [switch]$NoPause)

$ErrorActionPreference = 'Stop'

function Info($m) { Write-Host "[build] $m" -ForegroundColor Green }
function Warn($m) { Write-Host "[build] $m" -ForegroundColor Yellow }
function Fail($m) {
  Write-Host "[build] $m" -ForegroundColor Red
  if (-not $NoPause) { Read-Host "按回车关闭" }
  exit 1
}

$Root     = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$cargoBin = Join-Path $env:USERPROFILE '.cargo\bin'

# 从注册表刷新 PATH（依赖可能是在别的会话里装的）
$env:Path = @(
  [Environment]::GetEnvironmentVariable('Path', 'Machine')
  [Environment]::GetEnvironmentVariable('Path', 'User')
) -join ';'

# 定位 MinGW gcc
$pkgRoot = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
$gcc = $null
if (Test-Path $pkgRoot) {
  $gcc = Get-ChildItem $pkgRoot -Recurse -Filter 'x86_64-w64-mingw32-gcc.exe' `
           -ErrorAction SilentlyContinue | Select-Object -First 1
}

# ---- 依赖检查 ----
Info "检查依赖环境..."
$missing = @()
if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) { $missing += 'Node.js' }
if (-not ((Get-Command yarn.cmd -ErrorAction SilentlyContinue) -or
          (Get-Command yarn -ErrorAction SilentlyContinue)))    { $missing += 'Yarn' }
if (-not (Test-Path (Join-Path $cargoBin 'cargo.exe')))         { $missing += 'Rust' }

$gnuOk = $false
$rustup = Join-Path $cargoBin 'rustup.exe'
if (Test-Path $rustup) {
  $tc = & $rustup toolchain list 2>$null
  if ($tc -match 'x86_64-pc-windows-gnu') { $gnuOk = $true }
}
if (-not $gnuOk) { $missing += 'Rust GNU 工具链 (stable-x86_64-pc-windows-gnu)' }
if (-not $gcc)   { $missing += 'MinGW (WinLibs GCC)' }

if ($missing.Count -gt 0) {
  Warn ("缺少依赖: " + ($missing -join ', '))
  Fail "请先运行 install-deps.cmd 一键安装依赖环境，然后再试。"
}

Info "依赖齐全:"
Info "  Node   $(node -v)"
Info "  Cargo  $(& (Join-Path $cargoBin 'cargo.exe') --version)"
Info "  MinGW  $($gcc.FullName)"

if ($CheckOnly) {
  Info "依赖环境正常（仅检查模式）。"
  if (-not $NoPause) { Read-Host "按回车关闭" }
  exit 0
}

# ---- 编译 ----
# 用 GNU 工具链作为 host（app 与 build script 都用 MinGW gcc 链接）
$env:Path = "$cargoBin;$($gcc.DirectoryName);$env:Path"
$env:RUSTUP_TOOLCHAIN = 'stable-x86_64-pc-windows-gnu'
$env:RUSTUP_DISABLE_SELF_UPDATE = '1'

Push-Location $Root
try {
  if (-not (Test-Path (Join-Path $Root 'node_modules'))) {
    Info "首次运行：安装前端依赖 (yarn install)，可能需要几分钟..."
    & yarn install
    if ($LASTEXITCODE -ne 0) { Fail "yarn install 失败。" }
  }
  Info "开始编译（前端静态导出 + Rust/MinGW 编译）..."
  & npx tauri build
  if ($LASTEXITCODE -ne 0) { Fail "tauri build 失败。" }
}
finally { Pop-Location }

# ---- 拷贝产物到 release 目录 ----
$bin = Join-Path $Root 'src-tauri\target\release\nextchat.exe'
$dll = Join-Path $Root 'src-tauri\target\release\WebView2Loader.dll'
if (-not (Test-Path $bin)) { Fail "未找到编译产物: $bin" }

Copy-Item $bin (Join-Path $PSScriptRoot 'ActorAIchat.exe') -Force
if (Test-Path $dll) {
  Copy-Item $dll (Join-Path $PSScriptRoot 'WebView2Loader.dll') -Force
} else {
  Warn "未找到 WebView2Loader.dll，exe 可能无法启动。"
}

$exe = Join-Path $PSScriptRoot 'ActorAIchat.exe'
$sz  = [math]::Round((Get-Item $exe).Length / 1MB, 1)
Info "完成 -> $exe ($sz MB)"
Info "运行依赖：Windows 自带的 Edge WebView2 运行时（Win11/较新 Win10 默认已装）。"
if (-not $NoPause) { Read-Host "按回车关闭" }
