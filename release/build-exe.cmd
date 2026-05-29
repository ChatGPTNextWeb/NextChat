@echo off
REM 一键编译 exe（双击运行）：先检查依赖，齐全则编译，否则提示先装依赖
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build-exe.ps1" %*
