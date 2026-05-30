<#
  ActorAIchat - Build Script (called by build-exe.cmd)
  ====================================================
  Run build-exe.cmd for an interactive menu.
  Direct PS1 usage: -All | -BuildSetup | -BuildMsi | -CheckOnly | -NoPause
#>
[CmdletBinding()]
param(
  [switch]$BuildMsi,
  [switch]$BuildSetup,
  [switch]$All,
  [switch]$CheckOnly,
  [switch]$NoPause
)

$ErrorActionPreference = 'Continue'

function Info($m)  { Write-Host "[build] $m" -ForegroundColor Green }
function Warn($m)  { Write-Host "[build] $m" -ForegroundColor Yellow }
function Fail($m)  {
  Write-Host "[build] $m" -ForegroundColor Red
  if (-not $NoPause) { Read-Host "Press Enter" }; exit 1
}

if ($All) { $BuildMsi = $true; $BuildSetup = $true }

$Root     = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$cargoBin = Join-Path $env:USERPROFILE '.cargo\bin'

# Refresh PATH
$env:Path = @(
  [Environment]::GetEnvironmentVariable('Path', 'Machine')
  [Environment]::GetEnvironmentVariable('Path', 'User')
) -join ';'

# Locate MinGW gcc
$gcc = $null
$pkgRoot = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
if (Test-Path $pkgRoot) {
  $gcc = Get-ChildItem $pkgRoot -Recurse -Filter 'x86_64-w64-mingw32-gcc.exe' `
           -ErrorAction SilentlyContinue | Select-Object -First 1
}

# ---- Check deps ----
Info "Checking build dependencies..."
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
if (-not $gnuOk) { $missing += 'Rust GNU toolchain (stable-x86_64-pc-windows-gnu)' }
if (-not $gcc)   { $missing += 'MinGW (WinLibs GCC)' }

if ($BuildMsi) {
  $msiOk = (Get-Command candle.exe -ErrorAction SilentlyContinue) -or
           (Test-Path "${env:ProgramFiles(x86)}\WiX Toolset v3.14\bin\candle.exe")
  if (-not $msiOk) { Warn 'WiX Toolset not found - .msi will be skipped (winget install WiXToolset.WiXToolset)' }
}
if ($BuildSetup) {
  $nsisOk = (Get-Command makensis.exe -ErrorAction SilentlyContinue) -or
            (Test-Path "${env:ProgramFiles(x86)}\NSIS\Bin\makensis.exe")
  if (-not $nsisOk) { Warn 'NSIS not found - setup.exe will be skipped (winget install NSIS.NSIS)' }
}

if ($missing.Count -gt 0) {
  Warn ("Missing: " + ($missing -join ', '))
  Fail "Run install-deps.cmd first."
}

Info "Deps OK:"
Info "  Node   $(node -v)"
Info "  Cargo  $(& (Join-Path $cargoBin 'cargo.exe') --version)"
Info "  MinGW  $($gcc.FullName)"

if ($CheckOnly) {
  Info 'Check-only mode: all dependencies ready.'
  if (-not $NoPause) { Read-Host 'Press Enter' }; exit 0
}

# ---- Build exe ----
$env:Path = "$cargoBin;$($gcc.DirectoryName);$env:Path"
$env:RUSTUP_TOOLCHAIN = 'stable-x86_64-pc-windows-gnu'
$env:RUSTUP_DISABLE_SELF_UPDATE = '1'

Push-Location $Root
try {
  if (-not (Test-Path (Join-Path $Root 'node_modules'))) {
    Info "First run: installing frontend deps (yarn install)..."
    & yarn install
    if ($LASTEXITCODE -ne 0) { Fail 'yarn install failed.' }
  }
  Info "Building (frontend export + Rust/MinGW compile)..."
  & npx tauri build
  if ($LASTEXITCODE -ne 0) { Fail 'tauri build failed.' }
}
finally { Pop-Location }

# ---- Copy exe + dll ----
$bin = Join-Path $Root 'src-tauri\target\release\actor-aichat.exe'
$dll = Join-Path $Root 'src-tauri\target\release\WebView2Loader.dll'
if (-not (Test-Path $bin)) { Fail "Binary not found: $bin" }

Copy-Item $bin (Join-Path $PSScriptRoot 'ActorAIchat.exe') -Force
if (Test-Path $dll) {
  Copy-Item $dll (Join-Path $PSScriptRoot 'WebView2Loader.dll') -Force
} else {
  Warn 'WebView2Loader.dll not found - exe may not start.'
}

$exe = Join-Path $PSScriptRoot 'ActorAIchat.exe'
$sz  = [math]::Round((Get-Item $exe).Length / 1MB, 1)
Info "exe: $exe ($sz MB)"

# ---- Optional: setup.exe (NSIS) ----
if ($BuildSetup) {
  $setupPs1 = Join-Path $Root 'msi-install\build-setup.ps1'
  if (Test-Path $setupPs1) {
    Info "Building NSIS setup.exe ..."
    & powershell -NoProfile -ExecutionPolicy Bypass -File $setupPs1 -NoPause
    if ($LASTEXITCODE -ne 0) { Warn 'setup.exe build failed (NSIS may not be installed).' }
  }
}

# ---- Optional: .msi (WiX) ----
if ($BuildMsi) {
  $msiPs1 = Join-Path $Root 'msi-install\build-msi.ps1'
  if (Test-Path $msiPs1) {
    Info "Building .msi (WiX)..."
    & powershell -NoProfile -ExecutionPolicy Bypass -File $msiPs1 -NoPause
    if ($LASTEXITCODE -ne 0) { Warn '.msi build failed (WiX may not be installed).' }
  }
}

# ---- Summary ----
Info '===== Build complete ====='
Get-ChildItem $PSScriptRoot -Filter 'ActorAIchat*' | ForEach-Object {
  $s = if ($_.Length -gt 1MB) { "$([math]::Round($_.Length/1MB,1)) MB" } else { "$($_.Length) B" }
  Info "  $($_.Name) ($s)"
}
Info ''
Info 'Runtime dep: Edge WebView2 (built into Win11 / recent Win10).'
if (-not $NoPause) { Read-Host 'Press Enter' }
