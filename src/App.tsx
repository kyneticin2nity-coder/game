import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase, signInWithGoogle, signOut } from './lib/supabaseClient';
import { ScheduleArea } from './components/ScheduleArea';
import { Battlefield } from './components/Battlefield';
import { Entry } from './pages/Entry';
import { LogOut, User as UserIcon, Zap, CheckCircle, ChevronLeft } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type ScheduleType = 'free' | 'work' | 'normal';

export interface Schedule {
  id: string;
  title: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  type: ScheduleType;
}

type GameState = '대기' | '전투중';

function AppContent() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [xp, setXp] = useState(0);
  const [gameState, setGameState] = useState<GameState>('대기');
  const [battleTime, setBattleTime] = useState(0);
  const [selectedSoldierCount, setSelectedSoldierCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 전투 중 타이머
  useEffect(() => {
    let timer: number;
    if (gameState === '전투중') {
      timer = window.setInterval(() => {
        setBattleTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const handleAddSchedule = (title: string, startTime: string, endTime: string, type: ScheduleType) => {
    const newSchedule: Schedule = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      startTime,
      endTime,
      type,
    };
    setSchedules([...schedules, newSchedule].sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  const handleRemoveSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  // 시간 차이(분) 계산 함수
  const getMinutesBetween = (start: string, end: string) => {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  };

  // 아군 유닛: free 일정의 총 시간 / 15
  const freeMinutes = schedules
    .filter(s => s.type === 'free')
    .reduce((acc, s) => acc + getMinutesBetween(s.startTime, s.endTime), 0);
  const soldierCount = Math.floor(freeMinutes / 15);

  // 적군 유닛: work 일정의 개수
  const enemyCount = schedules.filter(s => s.type === 'work').length;

  const handleStartBattle = (selectedIds: number[]) => {
    if (selectedIds.length > 0 && enemyCount > 0) {
      setSelectedSoldierCount(selectedIds.length);
      setBattleTime(0);
      setGameState('전투중');
    }
  };

  const handleCompleteBattle = () => {
    const reward = selectedSoldierCount * 50;
    setXp(prev => prev + reward);
    setGameState('대기');
    setBattleTime(0);
    const workSchedules = schedules.filter(s => s.type === 'work');
    if (workSchedules.length > 0) {
      handleRemoveSchedule(workSchedules[0].id);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Routes>
        <Route path="/" element={<Entry />} />
        
        {/* 작전 일정 관리 페이지 */}
        <Route path="/schedule" element={
          <ScheduleArea 
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onRemoveSchedule={handleRemoveSchedule}
          />
        } />

        {/* 작전 구역 페이지 */}
        <Route path="/battlefield" element={
          <div className="flex flex-col h-full w-full bg-[#f8fafc] text-slate-900">
            {/* Battlefield Header */}
            <header className="h-16 border-b border-slate-200 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-50">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/')}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col">
                  <h1 className="text-xl font-black italic tracking-tighter text-blue-600 uppercase leading-tight">Operation Zone</h1>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 shadow-sm transition-all duration-500" 
                        style={{ width: `${(xp % 1000) / 10}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">LV.{Math.floor(xp/1000) + 1} XP:{xp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                      <UserIcon size={14} className="text-blue-500" />
                      <span className="text-[11px] font-bold text-slate-600">{user.email}</span>
                    </div>
                    <button onClick={signOut} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <button onClick={signInWithGoogle} className="glow-btn-primary text-[11px] py-1.5 px-6">
                    Google 로그인
                  </button>
                )}
              </div>
            </header>

            <main className="flex-1 relative">
              {gameState === '전투중' ? (
                <div className="h-full w-full flex flex-col items-center justify-center bg-white">
                  <div className="absolute top-12 flex flex-col items-center">
                    <Zap size={64} className="text-rose-500 mb-4 animate-bounce" />
                    <h2 className="text-5xl font-black text-slate-900 italic tracking-tighter uppercase mb-2">교전 진행 중</h2>
                    <div className="flex items-center gap-3 px-6 py-2 bg-rose-50 border border-rose-100 rounded-full">
                      <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                      <span className="text-2xl font-mono font-black text-rose-600">
                        {Math.floor(battleTime / 3600).toString().padStart(2, '0')}:
                        {Math.floor((battleTime % 3600) / 60).toString().padStart(2, '0')}
                      </span>
                    </div>                  </div>

                  <div className="flex gap-20 items-center mb-20">
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">투입된 아군</span>
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-blue-100 shadow-lg shadow-blue-100/50">
                          <img src="/game/soldier.png" alt="soldier" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-7xl font-black text-slate-900 leading-none">{selectedSoldierCount}</div>
                      </div>
                    </div>                    <div className="text-4xl font-black text-slate-200 italic">VS</div>
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-sm font-bold text-rose-500 uppercase tracking-widest">목표 위협</span>
                      <div className="text-6xl font-black text-slate-900">1</div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCompleteBattle}
                    className="flex items-center gap-3 px-12 py-5 bg-emerald-500 hover:bg-emerald-600 text-white text-2xl font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-95 group"
                  >
                    <CheckCircle size={32} className="group-hover:rotate-12 transition-transform" />
                    전투 완료
                  </button>
                  
                  <p className="mt-8 text-slate-400 font-medium animate-pulse">임무가 완료되면 위 버튼을 누르십시오</p>
                </div>
              ) : (
                <Battlefield 
                  soldierCount={soldierCount}
                  enemyCount={enemyCount}
                  onStartBattle={handleStartBattle}
                />
              )}
            </main>
          </div>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
