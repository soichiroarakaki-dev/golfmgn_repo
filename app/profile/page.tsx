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
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubCode, setNewClubCode] = useState('');
  const [newClubYardage, setNewClubYardage] = useState('');
  const [newClubEnabled, setNewClubEnabled] = useState(true);
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

  const updateYardage = (id: string, newYardage: number) => {
    setClubs(clubs.map(c => c.id === id ? { ...c, yardage: newYardage } : c));
  };

  const updateClubName = (id: string, newName: string) => {
    setClubs(clubs.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  const updateClubCode = (id: string, newCode: string) => {
    setClubs(clubs.map(c => c.id === id ? { ...c, code: newCode.toUpperCase() } : c));
  };

  const moveClubUp = (id: string) => {
    const index = clubs.findIndex(c => c.id === id);
    if (index > 0) {
      const newClubs = [...clubs];
      [newClubs[index], newClubs[index - 1]] = [newClubs[index - 1], newClubs[index]];
      setClubs(newClubs);
    }
  };

  const moveClubDown = (id: string) => {
    const index = clubs.findIndex(c => c.id === id);
    if (index < clubs.length - 1) {
      const newClubs = [...clubs];
      [newClubs[index], newClubs[index + 1]] = [newClubs[index + 1], newClubs[index]];
      setClubs(newClubs);
    }
  };

  const deleteClub = (id: string) => {
    if (confirm('このクラブを削除してもよろしいですか？')) {
      setClubs(clubs.filter(c => c.id !== id));
      alert('✅ クラブを削除しました');
    }
  };

  const handleAddClub = () => {
    if (!newClubName.trim() || !newClubCode.trim() || !newClubYardage.trim()) {
      alert('⚠️ クラブ名、略称名、飛距離をすべて入力してください');
      return;
    }

    const newClub: Club = {
      id: Date.now().toString(),
      name: newClubName,
      code: newClubCode.toUpperCase(),
      yardage: Number(newClubYardage),
      enabled: newClubEnabled,
    };

    setClubs([...clubs, newClub]);
    setNewClubName('');
    setNewClubCode('');
    setNewClubYardage('');
    setNewClubEnabled(true);
    setShowAddModal(false);
    alert('✅ クラブを追加しました');
  };

  const handleSave = () => {
    alert('✅ ユーザー情報とクラブセットを保存しました');
    setIsEditing(false);
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

          {/* クラブテーブル */}
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-xs">
              <tbody>
                {clubs.map((club, index) => (
                  <tr key={club.id} className="border-b border-gray-200">
                    <td className="py-2 px-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={club.name}
                          onChange={(e) => updateClubName(club.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                      ) : (
                        <span className="font-medium text-gray-800">{club.name}</span>
                      )}
                    </td>
                    <td className="py-2 px-1 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={club.code}
                          onChange={(e) => updateClubCode(club.id, e.target.value)}
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-xs text-center"
                          maxLength="4"
                        />
                      ) : (
                        <span className="text-gray-600">({club.code})</span>
                      )}
                    </td>
                    <td className="py-2 px-1 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={club.yardage}
                          onChange={(e) => updateYardage(club.id, Number(e.target.value))}
                          className="w-14 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                      ) : (
                        <span>{club.yardage}y</span>
                      )}
                    </td>
                    <td className="py-2 px-1 text-center">
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
                    {isEditing && (
                      <>
                        <td className="py-2 px-1 text-center">
                          <button
                            onClick={() => moveClubUp(club.id)}
                            disabled={index === 0}
                            className="text-lg disabled:text-gray-300 hover:text-green-600"
                            title="上に移動"
                          >
                            ↑
                          </button>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <button
                            onClick={() => moveClubDown(club.id)}
                            disabled={index === clubs.length - 1}
                            className="text-lg disabled:text-gray-300 hover:text-green-600"
                            title="下に移動"
                          >
                            ↓
                          </button>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <button
                            onClick={() => deleteClub(club.id)}
                            className="text-red-600 hover:text-red-800 font-bold text-sm"
                            title="削除"
                          >
                            ✕
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-gray-500 mb-3">全{clubs.length}本中{clubs.length}本表示</div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
            >
              ➕ 追加
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg text-sm"
            >
              {isEditing ? '✓ 完了' : '✏️ 編集'}
            </button>
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm mt-2"
            >
              ✅ 保存
            </button>
          )}
        </div>

        {/* クラブ追加モーダル */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
              <h2 className="text-lg font-bold text-gray-800 mb-4">➕ クラブを追加</h2>

              <div className="mb-4">
                <label className="block text-xs text-gray-600 font-medium mb-1">クラブ名 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newClubName}
                  onChange={(e) => setNewClubName(e.target.value)}
                  placeholder="例: ロングアイアン"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-600 font-medium mb-1">略称名 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newClubCode}
                  onChange={(e) => setNewClubCode(e.target.value.toUpperCase().slice(0, 4))}
                  placeholder="例: LI"
                  maxLength="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm uppercase"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs text-gray-600 font-medium mb-1">飛距離（ヤード） <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={newClubYardage}
                  onChange={(e) => setNewClubYardage(e.target.value)}
                  placeholder="例: 175"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs text-gray-600 font-medium mb-2">使用可能 (ON/OFF)</label>
                <button
                  onClick={() => setNewClubEnabled(!newClubEnabled)}
                  className={`w-14 h-7 rounded-full transition-all ${
                    newClubEnabled ? 'bg-green-600' : 'bg-gray-400'
                  } relative inline-block`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all ${
                      newClubEnabled ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
                <span className="ml-2 text-sm text-gray-600">{newClubEnabled ? 'ON' : 'OFF'}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewClubName('');
                    setNewClubCode('');
                    setNewClubYardage('');
                    setNewClubEnabled(true);
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg text-sm"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAddClub}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
                >
                  ✅ 追加
                </button>
              </div>
            </div>
          </div>
        )}

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
