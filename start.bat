@echo off
chcp 65001 >nul
title SmartLinkAI - SDS Generator

echo ========================================
echo   SmartLinkAI SDS Generator
echo ========================================
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo [ERROR] Node.js not found. Please install from https://nodejs.org
  pause
  exit /b 1
)

:: Check ANTHROPIC_API_KEY
if "%ANTHROPIC_API_KEY%"=="" (
  echo [WARNING] ANTHROPIC_API_KEY is not set.
  echo Please set it before running:
  echo   set ANTHROPIC_API_KEY=your_key_here
  echo.
  set /p APIKEY="Enter your Anthropic API key: "
  set ANTHROPIC_API_KEY=%APIKEY%
)

:: Install backend deps
echo [1/3] Installing backend dependencies...
cd /d "%~dp0backend"
if not exist node_modules (
  call npm install
)

:: Install frontend deps
echo [2/3] Installing frontend dependencies...
cd /d "%~dp0frontend"
if not exist node_modules (
  call npm install
)

:: Check port 3001
echo [3/3] Checking ports...
netstat -ano | findstr ":3001 " >nul 2>&1
if %errorlevel% equ 0 (
  echo [WARNING] Port 3001 is in use.
  choice /c YN /m "Kill the process on port 3001?"
  if errorlevel 2 goto :skip_kill
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001 "') do (
    taskkill /PID %%a /F >nul 2>&1
  )
)
:skip_kill

:: Start backend
echo.
echo Starting backend on http://localhost:3001 ...
cd /d "%~dp0backend"
start "SmartLinkAI Backend" cmd /k "set ANTHROPIC_API_KEY=%ANTHROPIC_API_KEY% && node server.js"

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start frontend
echo Starting frontend on http://localhost:5173 ...
cd /d "%~dp0frontend"
start "SmartLinkAI Frontend" cmd /k "npm run dev"

:: Wait then open browser
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo   App running at http://localhost:5173
echo   Press any key to exit this window
echo ========================================
pause >nul
