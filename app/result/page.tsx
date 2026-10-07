'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResultScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedScore, setSelectedScore] = useState('バーディー');
  const [selectedShot, setSelectedShot] = useState('ドライバー');
  const [courseData] = useState({
    courseName: '東京GC',
    hole: 9,
    par: 4,
    wind: '西2m'
  });

  useEffect(() => {
    const score = searchParams.get('score');
    const shot = searchParams.get('shot');
    if (score) setSelectedScore(score);
    if (shot) setSelectedShot(shot);
  }, [searchParams]);

  const scores = [
    { label: 'イーグル', color: 'text-red-600', bgColor: 'bg-red-50' },
    { label: 'バーディー', color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'パー', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'ボギー', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { label: 'ダブルボギー', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  ];

  const handleNextHole = () => {
    router.push('/game');
  };

  const handleHome = () => {
    router.push('/home');
  };

  const handleBack = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-700">📊 ホール結果</h1>
          <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">← 戻る</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{courseData.courseName} - ホール {courseData.hole}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Par</p>
              <p className="text-2xl font-bold text-blue-700">{courseData.par}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">選択ショット</p>
              <p className="text-lg font-bold text-green-700">{selectedShot}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-gray-600">風</p>
              <p className="text-lg font-bold text-purple-700">{courseData.wind}</p>
            </div>
            <div className="bg-pink-50 p-4 rounded">
              <p className="text-sm text-gray-600">結果</p>
              <p className="text-xl font-bold text-pink-700">{selectedScore}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">スコア結果</h3>
          
          <div className={`${scores.find(s => s.label === selectedScore)?.bgColor} rounded-lg p-12 mb-8 border-4 border-gray-200`}>
            <p className={`text-6xl font-bold text-center ${scores.find(s => s.label === selectedScore)?.color}`}>
              {selectedScore}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h4 className="font-bold text-gray-800 mb-3">📝 評価</h4>
            <p className="text-gray-700 mb-4">
              {selectedScore === 'イーグル' && 'パーより2打少ない素晴らしいスコア！'}
              {selectedScore === 'バーディー' && 'パーより1打少ない素晴らしいスコア！'}
              {selectedScore === 'パー' && 'パーと同じスコア。平均的な結果です。'}
              {selectedScore === 'ボギー' && 'パーより1打多いスコア。'}
              {selectedScore === 'ダブルボギー' && 'パーより2打多いスコア。'}
            </p>
          </div>

          <div className="mb-8">
            <h4 className="font-bold text-gray-800 mb-4">🎯 他のスコアを見る</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {scores.map((score) => (
                <button
                  key={score.label}
                  onClick={() => setSelectedScore(score.label)}
                  className={`p-4 rounded-lg border-2 transition-all text-center font-bold ${
                    selectedScore === score.label
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  {score.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">次のアクション</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={handleNextHole} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
              ➡️ 次のホール
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
              📊 スコア履歴
            </button>
            <button onClick={handleHome} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all">
              🏠 ホームに戻る
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💬 このホールについてコメント</h3>
          <textarea
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={4}
            placeholder="このホールの感想や戦略をコメントしてください..."
          />
          <button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg transition-all">
            コメントを保存
          </button>
        </div>
      </main>
    </div>
  );
}