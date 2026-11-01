'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // デモアカウント検証
    if (email === 'demo@example.com' && password === 'password') {
      router.push('/home');
    } else if (email && password) {
      setError('メールアドレスまたはパスワードが正しくありません');
    }
  };

  const skipToHome = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">⛳</h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">なんくるナビさ</h2>
          <p className="text-gray-600 mt-1">Golf Course Management</p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* ログインフォーム */}
        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition"
          >
            ログイン
          </button>
        </form>

        {/* デモアカウント情報 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
          <p className="font-semibold text-blue-900 mb-2">🔑 デモアカウント</p>
          <p className="text-blue-800">
            メール: <code className="bg-white px-2 py-1 rounded">demo@example.com</code>
          </p>
          <p className="text-blue-800">
            パス: <code className="bg-white px-2 py-1 rounded">password</code>
          </p>
        </div>

        {/* スキップボタン */}
        <button
          onClick={skipToHome}
          className="w-full bg-gray-100 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-200 transition"
        >
          スキップしてホームへ
        </button>
      </div>
    </div>
  );
}
