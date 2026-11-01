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
    },
    {
      id: '2',
      userName: 'ユーザーB',
      selectedClub: 'ドライバー',
      content: 'ティーショットではドライバーの距離が活きる。',
      createdAt: '2026-10-06',
    },
  ]);

  // URLパラメータから値を取得
  const holeNumber = searchParams.get('hole') || '1';
  const par = parseInt(searchParams.get('par') || '4');
  const length = parseInt(searchParams.get('length') || '400');
  const shotType = (searchParams.get('shotType') || 'tee') as ShotType;
  const selectedClub = searchParams.get('selectedClub') || 'Unknown';
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

  // クラブ選択統計（ダミーデータ）
  const clubStats = [
    { name: 'ドライバー', count: 563, total: 1613 },
    { name: '5番アイアン', count: 548, total: 1613 },
    { name: selectedClub, count: 502, total: 1613 },
  ];

  const handleSaveComment = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: String(comments.length + 1),
        userName: '新垣宗一郎',
        selectedClub: selectedClub,
        content: comment,
        createdAt: new Date().toISOString().split('T')[0],
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

        {/* ホール情報 */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">🏌️ ホール情報</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 p-2 rounded text-center">
              <p className="text-xs text-gray-600 font-bold">ホール</p>
              <p className="text-lg font-bold text-green-700">{holeNumber}</p>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <p className="text-xs text-gray-600 font-bold">Par</p>
              <p className="text-lg font-bold text-blue-700">{par}</p>
            </div>
            <div className="bg-purple-50 p-2 rounded text-center">
              <p className="text-xs text-gray-600 font-bold">距離</p>
              <p className="text-lg font-bold text-purple-700">{length}y</p>
            </div>
            <div className="bg-yellow-50 p-2 rounded text-center">
              <p className="text-xs text-gray-600 font-bold">ショット</p>
              <p className="text-xs font-bold text-yellow-700">{getShotTypeLabel(shotType)}</p>
            </div>
          </div>
        </div>

        {/* ショット説明 */}
        <div className="bg-blue-50 rounded-lg p-4 shadow-lg mb-4 border-l-4 border-blue-500">
          <h2 className="text-sm font-semibold text-blue-800 mb-2">ℹ️ {getShotTypeLabel(shotType)}</h2>
          <p className="text-sm text-blue-700 leading-relaxed">
            {getShotTypeDescription(shotType)}
          </p>
        </div>

        {/* 選択したショット */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4 border-l-4 border-green-500">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">✅ あなたの選択</h2>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded">
            <p className="text-2xl font-bold text-green-700 mb-1">{selectedClub}</p>
            <p className="text-lg text-green-600 font-semibold">{yardage}ヤード</p>
            <p className="text-xs text-green-600 mt-2">
              このクラブで {yardage}ヤード進みます
            </p>
          </div>
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
