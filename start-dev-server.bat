@echo off
chcp 65001 > nul
echo ⛳ なんくるナビ - 開発サーバー起動
echo ================================
echo.

cd /d "%~dp0"

REM ポート確認
netstat -ano | findstr :3000 > nul
if %errorlevel% equ 0 (
  echo ⚠️  ポート 3000 は既に使用されています
  echo 別のプロセスを終了するか、ポートを変更してください
  exit /b 1
)

echo 📦 依存パッケージをインストール中...
call npm install

echo.
echo 🚀 Next.js 開発サーバー起動中...
echo ⏳ 初回起動は数秒かかります...
echo.
echo 📍 ブラウザで開く: http://localhost:3000
echo.

call npm run dev

pause
