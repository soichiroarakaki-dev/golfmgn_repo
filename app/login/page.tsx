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
      router.push('/');
    } else if (email && password) {
      setError('メールアドレスまたはパスワードが正しくありません');
    } else {
      setError('メールアドレスとパスワードを入力してください');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6 mt-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">⛳ なんくるナビさ</h1>
          <p className="text-gray-600 text-sm">コース管理支援アプリへようこそ</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg mb-4">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-1">
                📧 メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-2">
              <label className="block text-gray-600 text-sm font-medium mb-1">
                🔐 パスワード（10文字まで）
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.slice(0, 10))}
                placeholder="••••••••••"
                maxLength={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="text-xs text-gray-500 mb-4">{password.length}/10文字</div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition"
            >
              🔓 ログイン
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <div className="text-sm text-gray-800">
            <strong>📌 デモアカウント:</strong>
            <div className="mt-2 text-gray-600">
              メール: demo@example.com<br />
              パスワード: password
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <button disabled className="w-full bg-gray-400 text-white font-bold py-2 px-4 rounded-lg text-sm mb-2 cursor-not-allowed">
            📧 Gmailでログイン（近日）
          </button>
          <button disabled className="w-full bg-gray-400 text-white font-bold py-2 px-4 rounded-lg text-sm cursor-not-allowed">
            💚 LINEでログイン（近日）
          </button>
        </div>

        <div className="text-center text-sm text-gray-600 mt-6">
          このアプリは開発中です。<br />
          <button
            onClick={() => router.push('/')}
            className="text-green-600 font-semibold hover:underline"
          >
            スキップしてホームへ →
          </button>
        </div>
      </div>
    </main>
  );
}
