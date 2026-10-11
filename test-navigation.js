// ナビゲーションテスト用スクリプト
// node test-navigation.js で実行

const fs = require('fs');
const path = require('path');

console.log("✅ ホーム画面ナビゲーションテスト");
console.log("==================================\n");

// ファイル確認
const homeFile = path.join(__dirname, 'app/home/page.tsx');
const gameFile = path.join(__dirname, 'app/game/page.tsx');

console.log("📂 ファイル確認:");
console.log(`  ホーム画面: ${fs.existsSync(homeFile) ? '✅ 存在' : '❌ 未検出'}`);
console.log(`  ゲーム画面: ${fs.existsSync(gameFile) ? '✅ 存在' : '❌ 未検出'}\n`);

// ホーム画面のコード確認
const homeContent = fs.readFileSync(homeFile, 'utf8');

console.log("🔍 ホーム画面の onClick ハンドラー確認:");
if (homeContent.includes("onClick={() => router.push('/game")) {
  console.log("  ✅ ゲーム画面へのナビゲーションコードが実装されています\n");
} else {
  console.log("  ❌ ナビゲーションコードが見つかりません\n");
}

// プレイ開始ボタン確認
console.log("🎮 プレイ開始ボタン確認:");
const playButtonMatch = homeContent.match(/⛳\s*プレイ開始/);
if (playButtonMatch) {
  console.log("  ✅ プレイ開始ボタンが実装されています\n");
  
  // ボタンの前後を抽出
  const buttonIndex = homeContent.indexOf(playButtonMatch[0]);
  const buttonContext = homeContent.substring(
    Math.max(0, buttonIndex - 200),
    Math.min(homeContent.length, buttonIndex + 200)
  );
  
  console.log("📝 ボタン周辺のコード:");
  console.log(buttonContext.substring(0, 100) + "...");
} else {
  console.log("  ❌ プレイ開始ボタンが見つかりません\n");
}

console.log("\n✅ テスト完了");
