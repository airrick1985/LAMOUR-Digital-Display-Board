@echo off
chcp 65001 >nul
cd /d "%~dp0\.."
title 重新打包富宇樂慕

echo.
echo [1/2] 清理舊文件...
rmdir /s /q dist >nul 2>&1

echo [2/2] 重新打包 EXE...
call npm run electron-build-win

echo.
echo ✓ 完成！EXE 在 dist\ 文件夾中
echo.
pause
