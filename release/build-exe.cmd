@echo off
REM ================================================
REM  ActorAIchat - One-Click Build (Interactive)
REM ================================================
echo.
echo   ======================================
echo     ActorAIchat - Build Menu
echo   ======================================
echo.
echo     [1] Build exe only (portable)
echo     [2] Build exe + setup.exe  (NSIS installer)
echo     [3] Build exe + .msi       (Windows Installer)
echo     [4] Build all (exe + setup.exe + .msi)
echo     [5] Check dependencies only
echo     [Q] Quit
echo.
choice /C 12345Q /N /M "  Choose [1-5,Q]: "

if errorlevel 6 goto :quit
if errorlevel 5 set ARGS=-CheckOnly && goto :run
if errorlevel 4 set ARGS=-All && goto :run
if errorlevel 3 set ARGS=-BuildMsi && goto :run
if errorlevel 2 set ARGS=-BuildSetup && goto :run
if errorlevel 1 set ARGS= && goto :run

:run
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-exe.ps1" %ARGS%
goto :end

:quit
echo   Cancelled.

:end
pause
