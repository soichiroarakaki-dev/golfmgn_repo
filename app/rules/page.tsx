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
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('/api/dify-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          conversationId: conversationId,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // アシスタントのメッセージを追加
      const assistantMessage: Message = {
        id: data.messageId || `msg_${Date.now()}`,
        type: 'assistant',
        content: data.answer || 'レスポンスを取得できませんでした',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // conversationId を保存（次のターンで使用）
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
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
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Enter キーでメッセージ送信
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-t-3xl text-center mb-0">
          <h1 className="text-2xl font-bold text-white mb-0">🎯 ルール確認チャット</h1>
          <p className="text-white text-sm">ゴルフルールや戦略について質問できます</p>
        </div>

        {/* チャット履歴 */}
        <div className="bg-white/95 rounded-b-3xl shadow-2xl p-4 mb-4 h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>🤖 こんにちは！ゴルフルールや戦略について何でもお聞きください</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
        <div className="bg-white/95 rounded-3xl shadow-2xl p-4">
          <div className="flex gap-2 mb-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="質問を入力してください..."
              className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-bold"
            >
              {isLoading ? '送信中...' : '📤 送信'}
            </button>
            <button
              onClick={handleStartListening}
              disabled={isLoading || isListening}
              className={`px-4 py-2 rounded-lg font-bold ${
                isListening ? 'bg-red-500 text-white' : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isListening ? '🎙️ 聞取中...' : '🎙️ 音声'}
            </button>
            <button
              onClick={() => router.push('/game')}
              className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 font-bold"
            >
              ← ゲームに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
