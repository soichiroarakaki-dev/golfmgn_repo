'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

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

  const holeNumber = searchParams.get('hole') || '3';
  const selectedClub = searchParams.get('club') || 'ドライバー';

  const clubStats = [
    { name: 'ドライバー', count: 350, total: 1613 },
    { name: '3W', count: 411, total: 1613 },
    { name: '5W', count: 852, total: 1613 },
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
          <p className="text-gray-600 text-sm">ホール分析とコメント</p>
        </div>

        {/* ホール情報 */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">🏌️ ホール情報</h2>
          <div style={{ fontSize: '12px', textAlign: 'center', color: '#666' }}>
            <strong>Par 4 / 385y / HC 9 / 北3m</strong>
          </div>
        </div>

        {/* 選択したショット */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">選択したショット</h2>
          <div style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
            {selectedClub} (270y)
          </div>
        </div>

        {/* クラブ選択結果 */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">📈 クラブ選択結果</h2>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
            総選択数: 1,613人
          </div>

          {clubStats.map((stat) => (
            <div key={stat.name} style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '80px', fontWeight: '500' }}>{stat.name}</div>
                <div style={{ flex: 1, height: '20px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '600',
                      width: `${(stat.count / stat.total) * 100}%`,
                    }}
                  >
                    {Math.round((stat.count / stat.total) * 100)}%
                  </div>
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
