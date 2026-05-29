@echo off
REM 一键安装编译依赖环境（双击运行；会自动申请管理员权限）
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-deps.ps1"
