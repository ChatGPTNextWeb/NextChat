<#
  ActorAIchat - MSI Builder (WiX Toolset v3)
  Prerequisites: winget install -e --id WiXToolset.WiXToolset
#>
[CmdletBinding()]
param(
  [string]$ExePath, [string]$DllPath, [string]$Version, [string]$OutputDir,
  [ValidateSet('zh-CN', 'en-US')][string]$Lang = 'zh-CN',
  [switch]$FullBuild, [switch]$NoPause, [switch]$CheckOnly
)
$ErrorActionPreference = 'Continue'
function Info($m) { Write-Host "[msi] $m" -ForegroundColor Green }
function Warn($m) { Write-Host "[msi] $m" -ForegroundColor Yellow }
function Fail($m) {
  Write-Host "[msi] $m" -ForegroundColor Red
  if (-not $NoPause) { Read-Host "Press Enter" }; exit 1
}

$ScriptDir  = $PSScriptRoot
$ProjectDir = Resolve-Path (Join-Path $ScriptDir '..')
$ReleaseDir = Join-Path $ProjectDir 'release'
if (-not $ExePath)   { $ExePath   = Join-Path $ReleaseDir 'ActorAIchat.exe' }
if (-not $DllPath)   { $DllPath   = Join-Path $ReleaseDir 'WebView2Loader.dll' }
if (-not $OutputDir) { $OutputDir = $ReleaseDir }
if (-not $Version) {
  $v = Join-Path $ProjectDir 'VERSION'
  if (Test-Path $v) { $Version = (Get-Content $v -Raw).Trim() }
  if (-not $Version) {
    $p = Join-Path $ProjectDir 'package.json'
    if (Test-Path $p) { $Version = (Get-Content $p -Raw | ConvertFrom-Json).version }
  }
  if (-not $Version) { $Version = '0.1.0' }
}
$ExePath  = (Resolve-Path $ExePath -ErrorAction SilentlyContinue).Path
$DllPath  = (Resolve-Path $DllPath -ErrorAction SilentlyContinue).Path
if (-not (Test-Path $OutputDir)) { New-Item $OutputDir -ItemType Directory -Force | Out-Null }
$OutputDir = (Resolve-Path $OutputDir).Path
$WxsFile   = Join-Path $ScriptDir 'main.wxs'
$WxlFile   = Join-Path $ScriptDir "$Lang.wxl"
$IconFile  = Join-Path $ProjectDir 'src-tauri\icons\icon.ico'

# Find WiX tools
function Find-Tool($n) {
  $c = (Get-Command $n -ErrorAction SilentlyContinue).Source
  if ($c) { return $c }
  foreach ($d in @("${env:ProgramFiles(x86)}\WiX Toolset v3.14\bin", "${env:ProgramFiles(x86)}\WiX Toolset v3.11\bin")) {
    $t = Join-Path $d $n
    if (Test-Path $t) { return $t }
  }
  $r = Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
  if (Test-Path $r) {
    $f = Get-ChildItem $r -Recurse -Filter $n -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($f) { return $f.FullName }
  }
  return $null
}

$candle = Find-Tool 'candle.exe'
$light  = Find-Tool 'light.exe'
if (-not $candle -or -not $light) {
  Warn 'WiX Toolset v3 not found.'
  Warn 'Install: winget install -e --id WiXToolset.WiXToolset'
  if (-not $CheckOnly) { Fail 'WiX not installed.' }
}
if ($candle) { Info "candle: $candle" }
if ($light)  { Info "light:  $light" }

# Find WixUIExtension
$extDir = Join-Path (Split-Path $candle -Parent) '..\SDK'
$wixUI = Get-ChildItem $extDir -Filter 'WixUIExtension.dll' -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $wixUI) {
  $wixUI = Get-ChildItem (Split-Path (Split-Path $candle -Parent) -Parent) -Recurse -Filter 'WixUIExtension.dll' -ErrorAction SilentlyContinue | Select-Object -First 1
}
if (-not $wixUI) { Fail 'WixUIExtension.dll not found. WiX install may be incomplete.' }
Info "wixui:  $($wixUI.FullName)"

# Validate inputs
if (-not $ExePath) { Fail "ActorAIchat.exe not found. Run build-exe.cmd first." }
if (-not $DllPath) { Warn "WebView2Loader.dll not found (optional)" }
if (-not (Test-Path $WxsFile)) { Fail "main.wxs not found: $WxsFile" }
if (-not (Test-Path $WxlFile)) { Fail "Localization not found: $WxlFile (lang=$Lang)" }
Info "exe:  $ExePath"
if ($DllPath) { Info "dll:  $DllPath" }
Info "lang: $Lang"
Info "ver:  $Version"

if ($CheckOnly) { Info 'All OK (check-only).'; if (-not $NoPause) { Read-Host 'Press Enter' }; exit 0 }

# Optional full build
if ($FullBuild) {
  Info 'Running full build first...'
  $bs = Join-Path $ReleaseDir 'build-exe.ps1'
  if (Test-Path $bs) {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $bs -NoPause
    if ($LASTEXITCODE -ne 0) { Fail 'Full build failed.' }
    $ExePath = (Resolve-Path (Join-Path $ReleaseDir 'ActorAIchat.exe')).Path
    $DllPath = (Resolve-Path (Join-Path $ReleaseDir 'WebView2Loader.dll') -ErrorAction SilentlyContinue).Path
  } else { Fail "Not found: $bs" }
}

# Build MSI
$tmp = Join-Path $ScriptDir '_wixobj'
New-Item $tmp -ItemType Directory -Force | Out-Null

$wixVer = $Version -replace '[^0-9.]', ''
$parts = $wixVer.Split('.')
if ($parts.Length -gt 4) { $wixVer = ($parts[0..3] -join '.') }
if ($wixVer -notmatch '^\d+\.\d+\.\d+') { $wixVer = "$wixVer.0" }

$wixobj = Join-Path $tmp 'main.wixobj'
Info 'Step 1/2: Compile (candle.exe)...'
& $candle -arch x64 "-dVersion=$wixVer" "-dProductName=ActorAIchat" "-dManufacturer=ActorAI" "-dExeSource=$ExePath" "-dDllSource=$DllPath" "-dIconSource=$IconFile" -out $wixobj $WxsFile
if ($LASTEXITCODE -ne 0) { Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue; Fail 'candle.exe failed.' }

$msiName = "ActorAIchat_$wixVer`_x64_$Lang.msi"
$msiOut  = Join-Path $tmp $msiName
Info 'Step 2/2: Link (light.exe)...'
& $light -out $msiOut -ext $wixUI.FullName -loc $WxlFile -sice:ICE38 $wixobj
if ($LASTEXITCODE -ne 0) { Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue; Fail 'light.exe failed.' }

$final = Join-Path $OutputDir $msiName
Copy-Item $msiOut $final -Force
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
$sz = [math]::Round((Get-Item $final).Length / 1MB, 1)
Info "Done: $final ($sz MB)"
if (-not $NoPause) { Read-Host 'Press Enter' }
