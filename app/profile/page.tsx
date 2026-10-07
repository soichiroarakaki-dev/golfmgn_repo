'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Club {
  id: string;
  name: string;
  code: string;
  yardage: number;
  enabled: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('新垣宗一郎');
  const [handicap, setHandicap] = useState(9);
  const [clubs, setClubs] = useState<Club[]>([
    { id: '1w', name: 'ドライバー', code: '1W', yardage: 230, enabled: true },
    { id: '3w', name: '3番ウッド', code: '3W', yardage: 200, enabled: true },
    { id: '5w', name: '5番ウッド', code: '5W', yardage: 195, enabled: true },
    { id: '5ut', name: '5番ユーティリティ', code: '5UT', yardage: 170, enabled: true },
    { id: '5i', name: '5番アイアン', code: '5I', yardage: 160, enabled: true },
    { id: '6i', name: '6番アイアン', code: '6I', yardage: 150, enabled: true },
    { id: '7i', name: '7番アイアン', code: '7I', yardage: 140, enabled: true },
    { id: '8i', name: '8番アイアン', code: '8I', yardage: 130, enabled: true },
    { id: '9i', name: '9番アイアン', code: '9I', yardage: 120, enabled: true },
    { id: 'pw', name: 'ピッチングウェッジ', code: 'PW', yardage: 105, enabled: false },
    { id: 'sw', name: 'サンドウェッジ', code: 'SW', yardage: 80, enabled: true },
    { id: 'pt', name: 'パター', code: 'PT', yardage: 0, enabled: true },
  ]);

  const toggleClub = (id: string) => {
    setClubs(clubs.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const handleSave = () => {
    alert('✅ ユーザー情報を保存しました');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-6 mt-4">
          <h1 className="text-3xl font-bold text-green-700 mb-2">⚙️ ユーザー設定</h1>
        </div>

        {/* ユーザー情報 */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">ユーザー情報</h2>
          
          <div className="mb-3">
            <label className="block text-xs text-gray-600 font-medium mb-1">ユーザー名</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-600 font-medium mb-1">ハンディキャップ</label>
            <input
              type="number"
              value={handicap}
              onChange={(e) => setHandicap(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
          >
            ✅ 保存
          </button>
        </div>

        {/* マイクラブセット */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">🏌️ マイクラブセット</h2>
          <div className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold mb-3">
            ✓ トグルスイッチUI
          </div>

          {/* クラブテーブル */}
          <table className="w-full text-xs mb-3">
            <tbody>
              {clubs.map((club) => (
                <tr key={club.id} className="border-b border-gray-200">
                  <td className="py-2 font-medium text-gray-800">{club.name} ({club.code})</td>
                  <td className="py-2 text-right text-gray-600">{club.yardage}y</td>
                  <td className="py-2 text-center">
                    <button
                      onClick={() => toggleClub(club.id)}
                      className={`w-10 h-6 rounded-full transition-all ${
                        club.enabled ? 'bg-green-600' : 'bg-gray-400'
                      } relative inline-block`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                          club.enabled ? 'right-0.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-xs text-gray-500 mb-3">全12本中12本表示</div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm mb-2">
            ➕ クラブを追加
          </button>
          <button className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg text-sm">
            ✏️ 編集
          </button>
        </div>

        {/* ナビゲーション */}
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <button
            onClick={() => router.push('/home')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
          >
            🏠 ホームに戻る
          </button>
        </div>
      </div>
    </main>
  );
}
