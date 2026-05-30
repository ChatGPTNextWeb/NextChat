<#
  ActorAIchat - NSIS setup.exe Builder
  ====================================
  Compiles setup.nsi into setup.exe using locally installed NSIS.
  Prerequisites: winget install NSIS.NSIS
#>
[CmdletBinding()]
param(
  [string]$ExePath, [string]$DllPath, [string]$Version, [string]$OutputDir,
  [switch]$NoPause, [switch]$CheckOnly
)

function Info($m) { Write-Host "[nsis] $m" -ForegroundColor Green }
function Warn($m) { Write-Host "[nsis] $m" -ForegroundColor Yellow }
function Fail($m) {
  Write-Host "[nsis] $m" -ForegroundColor Red
  if (-not $NoPause) { Read-Host "Press Enter" }; exit 1
}

$ScriptDir  = $PSScriptRoot
$ProjectDir = Resolve-Path (Join-Path $ScriptDir '..')
$ReleaseDir = Join-Path $ProjectDir 'release'
if (-not $ExePath)   { $ExePath   = Join-Path $ReleaseDir 'ActorAIchat.exe' }
if (-not $DllPath)   { $DllPath   = Join-Path $ReleaseDir 'WebView2Loader.dll' }
if (-not $OutputDir) { $OutputDir = $ReleaseDir }
if (-not $Version) {
  $p = Join-Path $ProjectDir 'package.json'
  if (Test-Path $p) { $Version = (Get-Content $p -Raw | ConvertFrom-Json).version }
  if (-not $Version) { $Version = '0.1.0' }
}
$ExePath   = (Resolve-Path $ExePath -ErrorAction SilentlyContinue).Path
$DllPath   = (Resolve-Path $DllPath -ErrorAction SilentlyContinue).Path
if (-not (Test-Path $OutputDir)) { New-Item $OutputDir -ItemType Directory -Force | Out-Null }
$OutputDir = (Resolve-Path $OutputDir).Path
$NsiFile   = Join-Path $ScriptDir 'setup.nsi'
$IconFile  = Join-Path $ProjectDir 'src-tauri\icons\icon.ico'

# Find makensis.exe
$makensis = (Get-Command makensis.exe -ErrorAction SilentlyContinue).Source
if (-not $makensis) {
  foreach ($d in @("${env:ProgramFiles(x86)}\NSIS\Bin", "${env:ProgramFiles(x86)}\NSIS")) {
    $t = Join-Path $d 'makensis.exe'
    if (Test-Path $t) { $makensis = $t; break }
  }
}
if (-not $makensis) {
  Warn 'NSIS not found. Install: winget install NSIS.NSIS'
  if (-not $CheckOnly) { Fail 'makensis.exe not found.' }
} else { Info "makensis: $makensis" }
if (-not $ExePath) { Warn 'ActorAIchat.exe not found' }
else               { Info "exe: $ExePath" }
if (Test-Path $DllPath) { Info "dll: $DllPath" }
if ($CheckOnly) { Info 'OK (check-only).'; if (-not $NoPause) { Read-Host 'Press Enter' }; exit 0 }
if (-not $ExePath) { Fail 'ActorAIchat.exe not found. Run build-exe.cmd first.' }

# Compile
$outName = "ActorAIchat_$Version`_x64-setup.exe"
$outPath = Join-Path $OutputDir $outName
Info "Building $outName ..."
& $makensis "/DVersion=$Version" "/DExeSource=$ExePath" "/DDllSource=$DllPath" "/DIconSource=$IconFile" "/DOutFile=$outPath" $NsiFile
if ($LASTEXITCODE -ne 0) { Fail 'makensis.exe failed.' }
$sz = [math]::Round((Get-Item $outPath).Length / 1MB, 1)
Info "Done -> $outPath ($sz MB)"
if (-not $NoPause) { Read-Host 'Press Enter' }
