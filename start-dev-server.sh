#!/bin/bash

echo "⛳ なんくるナビ - 開発サーバー起動"
echo "================================"

cd "$(dirname "$0")"

# ポート確認
PORT=3000
if lsof -i :$PORT > /dev/null 2>&1; then
  echo "⚠️  ポート $PORT は既に使用されています"
  echo "別のプロセスを終了するか、ポートを変更してください"
  exit 1
fi

echo "📦 依存パッケージをインストール中..."
npm install 2>&1 | tail -5

echo ""
echo "🚀 Next.js 開発サーバー起動中..."
echo "⏳ 初回起動は数秒かかります..."
echo ""

npm run dev

