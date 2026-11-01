@echo off
cd /d "%~dp0"
echo Starting Golf App...
echo.
start "Golf App" cmd /c npm run dev
timeout /t 3 /nobreak
start http://localhost:3000
echo.
echo Golf App is starting...
echo Open browser: http://localhost:3000
echo.
pause
