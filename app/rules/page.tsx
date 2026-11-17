'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// SpeechRecognition 型定義
interface Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function RulesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // メッセージエリアの自動スクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 音声認識の初期化
  useEffect(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.lang = 'ja-JP';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputValue((prev) => prev + transcript);
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // メッセージ送信
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/dify-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          conversationId: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // アシスタントのメッセージを追加
      const assistantMessage: Message = {
        id: data.messageId || `msg_${Date.now()}`,
        type: 'assistant',
        content: data.answer || 'レスポンスを取得できませんでした。',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConversationId(data.conversationId);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: `msg_${Date.now()}`,
        type: 'assistant',
        content: 'エラーが発生しました。もう一度お試しください。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 音声入力開始
  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // キーボード送信
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-4 mt-4">
          <h1 className="text-3xl font-bold text-green-700 mb-2">📋 ルール確認</h1>
          <p className="text-gray-600 text-sm">ゴルフルールについてご質問ください</p>
        </div>

        {/* チャットメッセージエリア */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4 h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-center">
                💬 ゴルフのルールについて質問してください。<br />
                手入力または音声入力でお答えします。
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {msg.timestamp.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                    <p className="text-sm">入力中... ⏳</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 入力エリア */}
        <div className="bg-white rounded-lg p-4 shadow-lg mb-4">
          <div className="flex gap-2 mb-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ゴルフのルールについて質問してください..."
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* ボタン */}
          <div className="flex gap-2">
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              📤 送信
            </button>

            <button
              onClick={handleStartListening}
              disabled={isLoading || isListening}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400'
              }`}
            >
              {isListening ? '🎤 記録中...' : '🎤 音声'}
            </button>

            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
            >
              🏠 戻る
            </button>
          </div>
        </div>

        {/* 会話ID表示（デバッグ用） */}
        {conversationId && (
          <div className="text-xs text-gray-500 text-center">
            会話ID: {conversationId.substring(0, 20)}...
          </div>
        )}
      </div>
    </main>
  );
}
