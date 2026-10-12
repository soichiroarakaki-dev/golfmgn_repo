'use client';

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
  const [shotNumber, setShotNumber] = useState(1);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [clubPath, setClubPath] = useState<string[]>([]);
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

  const getFilteredClubs = (): Club[] => {
    let shotType: ShotType;

    if (shotNumber === 1) {
      shotType = 'tee';
    } else if (remainingDistance <= 20) {
      shotType = 'approach';
    } else {
      shotType = 'second';
    }

    return userClubs
      .filter(c => c.enabled && c.shotTypes.includes(shotType))
      .map(c => ({
        id: c.id,
        label: `${c.name} (${c.code})`,
        icon: getClubIcon(c.id),
        yardage: c.yardage,
        shotTypes: c.shotTypes,
      }));
  };

  const getClubIcon = (clubId: string): string => {
    const iconMap: Record<string, string> = {
      '1w': '🎯', '3w': '🎯', '5w': '🎯',
      '5ut': '⛳', '5i': '⛳', '6i': '⛳', '7i': '⛳', '8i': '⛳', '9i': '⛳',
      'pw': '🏌️', 'sw': '🏌️', 'pt': '⛳',
    };
    return iconMap[clubId] || '🏌️';
  };

  const getShotInfo = (): { label: string; description: string } => {
    if (shotNumber === 1) {
      return {
        label: '【ティーショット（1打目）】',
        description: `残り距離: ${remainingDistance}y`,
      };
    } else if (remainingDistance <= 20) {
      return {
        label: '【グリーン周り（アプローチ）】',
        description: `残り距離: ${remainingDistance}y`,
      };
    } else {
      return {
        label: `【セカンド以降（${shotNumber}打目）】`,
        description: `残り距離: ${remainingDistance}y`,
      };
    }
  };

  const generateProblem = () => {
    if (!selectedHole) return 'ホール情報を読み込み中...';

    const shotInfo = getShotInfo();
    return `ホール${selectedHole.hole}${shotInfo.label}。Par ${selectedHole.par}。距離${selectedHole.length}yard。HC${selectedHole.handicap}。風は${selectedHole.wind}。${shotInfo.description}。あなたなら、どのクラブを選びますか？`;
  };

  const generateGolfImage = async (hole: Hole, golfCourseName?: string) => {
    setImageLoading(true);
    try {
      const course = golfCourseName || courseId || 'okinawa-cc';
      const holeNumber = String(hole.hole).padStart(2, '0');
      const courseImageUrl = `/images/${course}/hole${holeNumber}.jpg`;
      
      console.log(`Loading image: ${courseImageUrl}`);
      setGolfImage(courseImageUrl);
    } catch (error) {
      console.error('Error loading image:', error);
      setGolfImage(null);
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    const loadHoles = async () => {
      try {
        const response = await fetch('/holes.json');
        const data = await response.json();

        if (courseId && data.holes[courseId]) {
          const courseHoles = data.holes[courseId];
          setHoles(courseHoles);
          const randomHole = courseHoles[Math.floor(Math.random() * courseHoles.length)];
          setSelectedHole(randomHole);
          setRemainingDistance(randomHole.length);
          generateGolfImage(randomHole, courseId);
        }
      } catch (error) {
        console.error('Failed to load holes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHoles();
  }, [courseId, prefecture]);

  const handleClubSelect = (clubId: string) => {
    setSelectedClub(clubId);
    
    if (selectedHole) {
      const selected = userClubs.find(c => c.id === clubId);
      if (selected) {
        const newClubPath = [...clubPath, selected.code];
        const newRemainingDistance = Math.max(0, remainingDistance - selected.yardage);

        if (selected.id === 'pt' || newRemainingDistance === 0) {
          setTimeout(() => {
            router.push(
              `/result?hole=${selectedHole.hole}&par=${selectedHole.par}&length=${selectedHole.length}&shotNumber=${shotNumber}&selectedClub=${selected.code}&remainingDistance=${newRemainingDistance}&clubPath=${newClubPath.join(',')}`
            );
          }, 300);
        } else {
          setShotNumber(shotNumber + 1);
          setRemainingDistance(newRemainingDistance);
          setClubPath(newClubPath);
          setSelectedClub(null);
        }
      }
    }
  };

  const handleRandomHole = () => {
    if (holes.length > 0) {
      const randomHole = holes[Math.floor(Math.random() * holes.length)];
      setSelectedHole(randomHole);
      setShotNumber(1);
      setRemainingDistance(randomHole.length);
      setClubPath([]);
      setSelectedClub(null);
      generateGolfImage(randomHole, courseId || undefined);
    }
  };

  const filteredClubs = getFilteredClubs();

  if (loading || !selectedHole) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 flex items-center justify-center">
        <p className="text-2xl font-bold text-gray-700">ホール情報を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <main className="max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden mb-6 border-4 border-yellow-300">
          <div className="bg-gradient-to-r from-green-400 to-blue-400 p-6 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">ホール {selectedHole.hole}</h1>
            <p className="text-white text-lg">← {Math.ceil(selectedHole.hole / 9) === 1 ? 'アウト' : 'イン'} →</p>
          </div>

          <div className="relative bg-gray-100 p-8 flex justify-center items-center min-h-64 border-b-4 border-gray-300">
            {imageLoading ? (
              <p className="text-gray-500 text-lg">🖼️ 画像を読み込み中...</p>
            ) : golfImage ? (
              <img
                src={golfImage}
                alt={`ホール${selectedHole.hole}`}
                className="max-w-full max-h-96 rounded-lg shadow-lg"
              />
            ) : (
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-4">画像が読み込まれていません</p>
                <button
                  onClick={() => selectedHole && generateGolfImage(selectedHole)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  🔄 再試行
                </button>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 【コース管理問題】</h2>
              <p className="text-lg text-gray-800 leading-relaxed font-semibold">
                {generateProblem()}
              </p>
            </div>

            {clubPath.length > 0 && (
              <div className="bg-blue-50 p-3 rounded mb-4 border-l-4 border-blue-400">
                <p className="text-xs text-gray-600 font-bold">📍 クラブ選択履歴</p>
                <p className="text-sm text-gray-800 font-semibold">{clubPath.join(' → ')}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t-2 border-gray-200">
              <div className="bg-green-50 p-3 rounded text-center">
                <p className="text-xs text-gray-600 font-bold">ホール</p>
                <p className="text-2xl font-bold text-green-700">{selectedHole.hole}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded text-center">
                <p className="text-xs text-gray-600 font-bold">Par</p>
                <p className="text-2xl font-bold text-blue-700">{selectedHole.par}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded text-center">
                <p className="text-xs text-gray-600 font-bold">HC</p>
                <p className="text-2xl font-bold text-yellow-700">{selectedHole.handicap}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded text-center">
                <p className="text-xs text-gray-600 font-bold">距離</p>
                <p className="text-xl font-bold text-purple-700">{remainingDistance}y</p>
              </div>
              <div className="bg-red-50 p-3 rounded text-center">
                <p className="text-xs text-gray-600 font-bold">風</p>
                <p className="text-lg font-bold text-red-700">{selectedHole.wind}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-xl shadow-2xl p-8 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            🎯 あなたなら、どのクラブを選びますか？
          </h3>
          
          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <button
                  key={club.id}
                  onClick={() => handleClubSelect(club.id)}
                  disabled={selectedClub === club.id}
                  className={`p-8 rounded-xl border-4 transition-all transform hover:scale-105 ${
                    selectedClub === club.id
                      ? 'border-green-500 bg-gradient-to-b from-green-50 to-green-100 shadow-2xl scale-105'
                      : 'border-gray-300 bg-gradient-to-b from-gray-50 to-white hover:border-green-400 shadow-lg'
                  }`}
                >
                  <div className="text-6xl mb-4">{club.icon}</div>
                  <p className="text-xl font-bold text-gray-800">{club.label}</p>
                  <p className="text-sm text-blue-600 font-semibold mt-2">{club.yardage}y</p>
                  <p className="text-xs text-gray-600 mt-2">選択済</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              このショットに対応するクラブがありません
            </p>
          )}
        </div>

        <button
          onClick={handleRandomHole}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg text-lg"
        >
          🔄 別のホールを選ぶ
        </button>
      </main>
    </div>
  );
}
