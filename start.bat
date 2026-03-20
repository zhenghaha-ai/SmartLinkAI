@echo off
chcp 65001 >nul
title SDS Generator - SmartLinkAI

echo.
echo ====================================
echo   SDS Generator - SmartLinkAI
echo ====================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo [ERROR] 未检测到 Node.js，请安装 Node.js 18+
  pause & exit /b 1
)

echo [1/4] 检查后端依赖...
cd /d "%~dp0backend"
if not exist node_modules (
  echo       安装中...
  call npm install
  if %errorlevel% neq 0 ( echo [ERROR] 后端依赖安装失败 & pause & exit /b 1 )
) else ( echo       已就绪 )

echo [2/4] 检查前端依赖...
cd /d "%~dp0frontend"
if not exist node_modules (
  echo       安装中...
  call npm install
  if %errorlevel% neq 0 ( echo [ERROR] 前端依赖安装失败 & pause & exit /b 1 )
) else ( echo       已就绪 )

echo [3/4] 启动后端代理 (port 3001)...
start "SDS-Backend" /d "%~dp0backend" cmd /k "node server.js"
timeout /t 2 /nobreak >nul

echo [4/4] 启动前端 (port 5173)...
start "SDS-Frontend" /d "%~dp0frontend" cmd /k "npx vite"

echo       等待服务就绪...
:wait
timeout /t 1 /nobreak >nul
netstat -ano | findstr ":5173 " | findstr "LISTENING" >nul 2>&1
if %errorlevel% neq 0 goto wait

echo.
echo ====================================
echo   启动成功！
echo   访问: http://localhost:5173
echo ====================================
echo.
set CHROME=
for %%p in (
  "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
  "%LocalAppData%\Google\Chrome\Application\chrome.exe"
) do (
  if exist %%p set CHROME=%%p
)
if defined CHROME (
  start "" %CHROME% http://localhost:5173
) else (
  start http://localhost:5173
)
pause
