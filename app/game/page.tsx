'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type ShotType = 'tee' | 'second' | 'approach';

interface Hole {
  hole: number;
  par: number;
  handicap: number;
  length: number;
  wind: string;
}

interface UserClub {
  id: string;
  name: string;
  code: string;
  yardage: number;
  enabled: boolean;
  shotTypes: ShotType[];
}

interface Club {
  id: string;
  label: string;
  icon: string;
  yardage: number;
  shotTypes: ShotType[];
}

export default function GameScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course_id');
  const prefecture = searchParams.get('prefecture');

  const [holes, setHoles] = useState<Hole[]>([]);
  const [selectedHole, setSelectedHole] = useState<Hole | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [golfImage, setGolfImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [shotType, setShotType] = useState<ShotType>('tee');
  const [userClubs, setUserClubs] = useState<UserClub[]>([
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
  ]);

  const clubIcons: { [key: string]: string } = {
    '1w': '🏌️',
    '3w': '🏌️',
    '5w': '🏌️',
    '5ut': '🏌️',
    '5i': '🥌',
    '6i': '🥌',
    '7i': '🥌',
    '8i': '🥌',
    '9i': '🥌',
    'pw': '⛳',
    'sw': '⛳',
    'pt': '🏴',
  };

  useEffect(() => {
    const fetchHoles = async () => {
      try {
        const response = await fetch('/holes.json');
        const data = await response.json();
        const courseHoles = data.holes['okinawa-cc'] || [];
        setHoles(courseHoles);

        const randomIndex = Math.floor(Math.random() * courseHoles.length);
        setSelectedHole(courseHoles[randomIndex]);
      } catch (error) {
        console.error('ホール情報の取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHoles();
  }, []);

  useEffect(() => {
    if (selectedHole) {
      generateGolfImage(selectedHole);
    }
  }, [selectedHole]);

  const generateGolfImage = async (hole: Hole) => {
    setImageLoading(true);
    try {
      const response = await fetch('/api/generate-golf-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hole: hole.hole,
          par: hole.par,
          length: hole.length,
          handicap: hole.handicap,
          wind: hole.wind,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGolfImage(data.imageUrl);
      }
    } catch (error) {
      console.error('画像生成エラー:', error);
      setGolfImage(null);
    } finally {
      setImageLoading(false);
    }
  };

  const generateProblem = (): string => {
    if (!selectedHole) return '';

    const shotInfo = {
      tee: { label: '【ティーショット】', description: 'ティーボックスから打つ。飛距離を最大限に活かしたクラブを選びましょう。' },
      second: { label: '【セカンドショット】', description: 'グリーンに向けてアプローチ。正確性を重視したクラブを選びましょう。' },
      approach: { label: '【アプローチショット】', description: 'グリーン周辺からの短いショット。ピンに寄せるクラブを選びましょう。' },
    }[shotType];

    return `ホール${selectedHole.hole}${shotInfo.label}。Par ${selectedHole.par}。距離${selectedHole.length}yard。HC${selectedHole.handicap}。風は${selectedHole.wind}。\n\n${shotInfo.description}\n\nあなたなら、どのクラブを選びますか？`;
  };

  const getDisplayImage = (): string => {
    if (!selectedHole) return '';
    const holeNum = selectedHole.hole;
    const par = selectedHole.par;

    if (par === 3 || par === 4) {
      // 2分割（上段/下段）
      return shotType === 'tee'
        ? `/courses/hole_${holeNum}/lower.jpg`
        : `/courses/hole_${holeNum}/upper.jpg`;
    }

    if (par === 5) {
      // 3分割（上段/中段/下段）
      switch (shotType) {
        case 'tee':
          return `/courses/hole_${holeNum}/lower.jpg`;
        case 'second':
          return `/courses/hole_${holeNum}/middle.jpg`;
        case 'approach':
          return `/courses/hole_${holeNum}/upper.jpg`;
      }
    }

    return '';
  };

  const handleClubSelect = (clubId: string) => {
    setSelectedClub(clubId);
  };

  const handleSelectNewHole = () => {
    if (holes.length > 0) {
      const randomIndex = Math.floor(Math.random() * holes.length);
      setSelectedHole(holes[randomIndex]);
      setSelectedClub(null);
      setShotType('tee');
    }
  };

  const filteredClubs = userClubs
    .filter(c => c.enabled && c.shotTypes.includes(shotType))
    .slice(0, 3)
    .map((c, i) => ({
      ...c,
      icon: clubIcons[c.id] || '🏌️',
    }));

  if (loading || !selectedHole) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <main className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-green-400 to-blue-400 p-2 rounded-t-3xl text-center mb-0">
          <h1 className="text-2xl font-bold text-white mb-0">ホール {selectedHole.hole}</h1>
          <p className="text-white text-sm">← {Math.ceil(selectedHole.hole / 9) === 1 ? 'アウト' : 'イン'} →</p>
        </div>

        {/* メインコンテンツ: 2カラムレイアウト */}
        <div className="flex gap-2 bg-white/95 rounded-b-3xl shadow-2xl p-2 mb-2">
          {/* 左側: 全体コース図 */}
          <div className="w-1/2 bg-gray-200 p-2 rounded-lg flex items-center justify-center min-h-96">
            {golfImage ? (
              <img
                src={golfImage}
                alt="全体コース図"
                className="max-h-full max-w-full rounded-lg shadow-lg object-contain"
              />
            ) : (
              <p className="text-gray-500">コース図を読み込み中...</p>
            )}
          </div>

          {/* 右側: コンテンツエリア */}
          <div className="w-1/2 flex flex-col gap-2">
            {/* 拡大表示セクション */}
            <div className="flex-1 bg-gray-100 p-2 rounded-lg flex items-center justify-center">
              <img
                src={getDisplayImage()}
                alt={`${shotType}セクション`}
                className="max-h-full max-w-full rounded-lg shadow-lg object-contain"
              />
            </div>

            {/* コース管理問題 */}
            <div className="bg-yellow-50 p-2 rounded-lg border-2 border-yellow-300">
              <h2 className="text-sm font-bold text-gray-800 mb-0">🎯 【コース管理問題】</h2>
              <p className="text-xs text-gray-800 leading-none whitespace-pre-wrap font-semibold mt-1">
                {generateProblem()}
              </p>
            </div>

            {/* ショットタイプ選択 */}
            <div className="flex gap-1 text-xs">
              {(['tee', 'second', 'approach'] as ShotType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setShotType(type)}
                  className={`flex-1 py-1 px-2 rounded font-bold transition ${
                    shotType === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {type === 'tee' ? 'TEE' : type === 'second' ? '2nd' : 'APP'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* クラブ選択エリア */}
        <div className="bg-white/95 rounded-3xl shadow-2xl p-2 mb-2">
          <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">🎯 3つのクラブから選んでください</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            {filteredClubs.map((club) => (
              <button
                key={club.id}
                onClick={() => handleClubSelect(club.id)}
                className={`p-2 rounded-xl border-4 transition ${
                  selectedClub === club.id
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-300 bg-gray-50 hover:border-green-400'
                }`}
              >
                <div className="text-4xl mb-0">{club.icon}</div>
                <p className="text-sm font-bold text-gray-800">{club.name}</p>
                <p className="text-xs text-blue-600">{club.yardage}y</p>
              </button>
            ))}
          </div>

          <button
            onClick={handleSelectNewHole}
            className="w-full py-1 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-bold"
          >
            🔄 別のホールを選ぶ
          </button>
        </div>
      </main>
    </div>
  );
}
