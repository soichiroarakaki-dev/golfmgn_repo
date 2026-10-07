'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [prefecture, setPrefecture] = useState('沖縄');
  const [course, setCourse] = useState('沖縄カントリークラブ');

  const courses: Record<string, string[]> = {
    '東京': ['東京GC', 'トウキョウGC'],
    '大阪': ['大阪GC', 'オオサカGC'],
    '福岡': ['福岡GC', 'フクオカGC'],
    '沖縄': ['沖縄カントリークラブ', 'サザンリンクスGC'],
  };

  const handlePrefectureChange = (newPref: string) => {
    setPrefecture(newPref);
    setCourse(courses[newPref]?.[0] || '');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-6 mt-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">⛳ なんくるナビさ</h1>
          <p className="text-gray-600 text-sm">ゴルフコース管理支援アプリ</p>
          <div className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold mt-2">
            ✓ タイトル修正
          </div>
        </div>

        {/* ユーザー情報 */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">👤 ユーザー</div>
              <div className="text-lg font-bold text-gray-800">新垣宗一郎</div>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">📊 HC</div>
              <div className="text-lg font-bold text-gray-800">9</div>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">🏌️ クラブ</div>
              <div className="text-lg font-bold text-gray-800">12本</div>
            </div>
          </div>
        </div>

        {/* メニュー */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">🎮 メニュー</h2>

          <button
            onClick={() => router.push('/profile')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm mb-3"
          >
            ⚙️ ユーザー設定
          </button>

          <div className="mb-3">
            <label className="block text-xs text-gray-600 font-medium mb-1">📍 都道府県</label>
            <select
              value={prefecture}
              onChange={(e) => handlePrefectureChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option>東京</option>
              <option>大阪</option>
              <option>福岡</option>
              <option>沖縄</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-xs text-gray-600 font-medium mb-1">⛳ ゴルフ場</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {courses[prefecture]?.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => router.push(`/game?prefecture=${prefecture}&course_id=okinawa_cc`)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
          >
            🏌️ {course}を選択
          </button>
        </div>

        {/* クイックスタート */}
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">🚀 クイックスタート</h2>
          <div className="text-xs text-gray-700 mb-3 leading-relaxed">
            <div>✅ ユーザー名とハンディキャップを設定</div>
            <div>✅ 自分のクラブセットを登録</div>
            <div>✅ ゴルフ場を選択してプレイ開始</div>
          </div>

          <button
            onClick={() => router.push('/game')}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm mb-2"
          >
            ⛳ プレイ開始
          </button>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
            📋 ルール確認
          </button>
        </div>
      </div>
    </main>
  );
}
