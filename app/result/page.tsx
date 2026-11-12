'use client';

export const dynamic = 'force-dynamic';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

type ShotType = 'tee' | 'second' | 'approach';

interface Comment {
  id: string;
  userName: string;
  selectedClub: string;
  content: string;
  createdAt: string;
  holeNumber?: string;
  handicap?: number;
  wind?: string;
}

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userName: 'ユーザーA',
      selectedClub: 'ドライバー',
      content: 'このホールはドライバーが最適。350人以上が選択している。',
      createdAt: '2026-10-07',
      holeNumber: '12',
      handicap: 3,
      wind: '南東',
    },
    {
      id: '2',
      userName: 'ユーザーB',
      selectedClub: 'ドライバー',
      content: 'ティーショットではドライバーの距離が活きる。',
      createdAt: '2026-10-06',
      holeNumber: '12',
      handicap: 3,
      wind: '南東',
    },
  ]);

  // clubId から club 名を取得するマッピング
  const clubMap: { [key: string]: string } = {
    '1w': 'ドライバー',
    '3w': '3番ウッド',
    '5w': '5番ウッド',
    '5ut': '5番ユーティリティ',
    '5i': '5番アイアン',
    '6i': '6番アイアン',
    '7i': '7番アイアン',
    '8i': '8番アイアン',
    '9i': '9番アイアン',
    'pw': 'ピッチングウェッジ',
    'sw': 'サンドウェッジ',
    'pt': 'パター',
  };

  // URLパラメータから値を取得
  const holeNumber = searchParams.get('hole') || '1';
  const par = parseInt(searchParams.get('par') || '4');
  const length = parseInt(searchParams.get('length') || '400');
  const shotType = (searchParams.get('shotType') || 'tee') as ShotType;
  const clubId = searchParams.get('clubId') || 'unknown';
  const selectedClub = clubMap[clubId] || searchParams.get('selectedClub') || 'Unknown';
  const yardage = parseInt(searchParams.get('yardage') || '0');

  // ショットタイプラベル
  const getShotTypeLabel = (type: ShotType): string => {
    const labels: Record<ShotType, string> = {
      tee: 'ティーショット',
      second: 'セカンドショット',
      approach: 'アプローチショット',
    };
    return labels[type];
  };

  // ショットタイプの説明
  const getShotTypeDescription = (type: ShotType): string => {
    const descriptions: Record<ShotType, string> = {
      tee: 'ティーボックスから打つ1打目。飛距離が重要です。',
      second: 'グリーンに向かって打つ2打目以降。正確さと距離のバランスが大切。',
      approach: 'グリーン周辺からの短いショット。ピンに寄せることが目標。',
    };
    return descriptions[type];
  };

  // クラブ選択統計（selectedClub に応じて他のクラブを表示）
  // ユーザークラブセット（game/page.tsx と同一）
  interface UserClub {
    id: string;
    name: string;
    code: string;
    yardage: number;
    enabled: boolean;
    shotTypes: ShotType[];
  }

  const userClubs: UserClub[] = [
    { id: '1w', name: 'ドライバー', code: '1W', yardage: 230, enabled: true, shotTypes: ['tee'] },
    { id: '3w', name: '3番ウッド', code: '3W', yardage: 200, enabled: true, shotTypes: ['tee'] },
    { id: '5w', name: '5番ウッド', code: '5W', yardage: 195, enabled: true, shotTypes: ['tee'] },
    { id: '5ut', name: '5番ユーティリティ', code: '5UT', yardage: 170, enabled: true, shotTypes: ['tee', 'second'] },
    { id: '5i', name: '5番アイアン', code: '5I', yardage: 160, enabled: true, shotTypes: ['tee', 'second'] },
    { id: '6i', name: '6番アイアン', code: '6I', yardage: 150, enabled: true, shotTypes: ['second'] },
    { id: '7i', name: '7番アイアン', code: '7I', yardage: 140, enabled: true, shotTypes: ['second'] },
    { id: '8i', name: '8番アイアン', code: '8I', yardage: 130, enabled: true, shotTypes: ['second'] },
    { id: '9i', name: '9番アイアン', code: '9I', yardage: 120, enabled: true, shotTypes: ['second', 'approach'] },
    { id: 'pw', name: 'ピッチングウェッジ', code: 'PW', yardage: 105, enabled: false, shotTypes: ['second', 'approach'] },
    { id: 'sw', name: 'サンドウェッジ', code: 'SW', yardage: 80, enabled: true, shotTypes: ['approach'] },
    { id: 'pt', name: 'パター', code: 'PT', yardage: 0, enabled: true, shotTypes: ['approach'] },
  ];

  // クラブ選択統計（shotType に応じてゲーム画面と同じクラブを表示）
  const getOtherClubs = () => {
    const filteredClubs = userClubs
      .filter(c => c.enabled && c.shotTypes.includes(shotType))
      .slice(0, 3);
    return filteredClubs.filter(c => c.name !== selectedClub).slice(0, 2);
  };
  
  const otherClubs = getOtherClubs();
  const clubStats = [
    { name: selectedClub || 'Unknown', count: 502, total: 1613 },
    ...otherClubs.map((c, idx) => ({ 
      name: c.name, 
      count: 300 - (idx * 50),  // ダミーカウント
      total: 1613 
    })),
  ];

  const handleSaveComment = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: String(comments.length + 1),
        userName: '新垣宗一郎',
        selectedClub: selectedClub,
        content: comment,
        createdAt: new Date().toISOString().split('T')[0],
        holeNumber: holeNumber,
        handicap: par,
        wind: '南西',  // ダミーデータ（実装時は実際の風向きを使用）
      };
      setComments([newComment, ...comments]);
      setComment('');
      alert('✅ コメントを保存しました');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-6 mt-4">
          <h1 className="text-3xl font-bold text-green-700 mb-2">📊 クラブ選択結果</h1>
          <p className="text-gray-600 text-sm">ホール {holeNumber} の分析</p>
        </div>



        {/* クラブ選択結果 */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">📈 クラブ選択統計</h2>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
            総選択数: {clubStats[0].total.toLocaleString()}人
          </div>

          {clubStats.map((stat) => (
            <div key={stat.name} style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '100px', fontWeight: '500' }}>{stat.name}</div>
                <div style={{ fontSize: '11px', color: '#999', minWidth: '50px' }}>
                  {stat.count.toLocaleString()}人
                </div>
              </div>
              <div style={{ flex: 1, height: '20px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    height: '100%',
                    background: selectedClub === stat.name ? '#16a34a' : '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '600',
                    width: `${(stat.count / stat.total) * 100}%`,
                    minWidth: '40px',
                  }}
                >
                  {Math.round((stat.count / stat.total) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* コメント入力枠 */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">💬 コメント入力</h2>
          <div className="mb-3">
            <label className="block text-xs text-gray-600 font-medium mb-1">感想を入力</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="このショットについてのコメントを入力..."
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                resize: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            onClick={handleSaveComment}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm mb-2"
          >
            💾 保存
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
          >
            📜 {showComments ? 'コメント非表示' : 'コメント一覧'}
          </button>
        </div>

        {/* コメント一覧表示 */}
        {showComments && (
          <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">💬 コメント一覧</h2>
            {comments.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
                コメントがまだありません
              </div>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: '#f9fafb',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong>{c.userName}</strong>
                    <span style={{ color: '#999', fontSize: '10px' }}>{c.createdAt}</span>
                  </div>
                  <div style={{ color: '#666', marginBottom: '4px' }}>
                  <div style={{ color: '#666', marginBottom: '4px', fontSize: '11px' }}>
                    🏌️ ホール {c.holeNumber} | HC {c.handicap} | 風: {c.wind}
                  </div>
                    選択: <strong>{c.selectedClub}</strong>
                  </div>
                  <div style={{ color: '#333', lineHeight: '1.5' }}>{c.content}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ナビゲーション */}
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <button
            onClick={() => router.push('/game')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm mb-2"
          >
            🔄 別のホールをプレイ
          </button>
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
