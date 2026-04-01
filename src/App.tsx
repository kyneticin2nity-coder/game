import { useState, useEffect } from 'react';
import { supabase, signInWithGoogle, signOut } from './lib/supabaseClient';
import { CalendarArea } from './components/CalendarArea';
import { Battlefield } from './components/Battlefield';
import { LogOut, User as UserIcon, LayoutDashboard, Zap } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Task {
  id: string;
  title: string;
  durationMinutes: number;
}

type GameState = '대기' | '전투중' | '정비';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [xp, setXp] = useState(0);
  const [gameState, setGameState] = useState<GameState>('대기');
  const [gameTime, setGameTime] = useState(0); // 초 단위 (1초 = 게임 내 1분으로 가정)
  
  const TOTAL_AVAILABLE_MINUTES = 480; // 8시간 기준

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 게임 시간 타이머 (1초마다 게임 내 1분 경과)
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddTask = (title: string, duration: number) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      durationMinutes: duration,
    };
    setTasks([...tasks, newTask]);
  };

  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const busyMinutes = tasks.reduce((acc, t) => acc + t.durationMinutes, 0);
  const initialFreeMinutes = Math.max(0, TOTAL_AVAILABLE_MINUTES - busyMinutes);
  
  // 핵심 게임 로직: 여유 시간 15분당 아군 1명 생성
  // 하지만 시간이 지날수록 (gameTime) 아군이 1명씩 소멸 (15분 경과마다)
  const passedUnits = Math.floor(gameTime / 15);
  const initialSoldiers = Math.floor(initialFreeMinutes / 15);
  const currentSoldierCount = Math.max(0, initialSoldiers - passedUnits);
  
  const enemyCount = tasks.length;

  const handleStartBattle = (selectedSoldierIds: number[]) => {
    if (selectedSoldierIds.length > 0 && enemyCount > 0) {
      setGameState('전투중');
      // 전투 로직은 추후 확장
      setTimeout(() => {
        // 전투 종료 후 경험치 보상 (생존 아군 수 * 10 XP)
        const reward = selectedSoldierIds.length * 10;
        setXp(prev => prev + reward);
        setGameState('대기');
        // 전투 승리 시 첫 번째 적 제거 (예시)
        if (tasks.length > 0) {
          handleRemoveTask(tasks[0].id);
        }
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-tactical-text overflow-hidden">
      {/* 택티컬 헤더 */}
      <header className="h-16 border-b border-tactical-border px-8 flex items-center justify-between bg-tactical-bg/50 backdrop-blur-md relative z-50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 border border-primary/30 rounded shadow-glow-primary">
            <LayoutDashboard size={20} className="text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter text-glow-primary uppercase leading-tight">타임 디펜더 v1.1</h1>
            <div className="flex items-center gap-2">
              <div className="h-1 w-24 bg-tactical-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary shadow-glow-primary transition-all duration-500" 
                  style={{ width: `${(xp % 100)}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-primary font-bold">LV.{Math.floor(xp/100) + 1} XP:{xp}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-tactical-text/40 uppercase tracking-widest">작전 시간</span>
            <span className="text-xl font-black font-mono text-primary">
              {Math.floor(gameTime / 60).toString().padStart(2, '0')}:
              {(gameTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-tactical-bg border border-tactical-border rounded-full">
                <UserIcon size={14} className="text-primary" />
                <span className="text-[10px] font-mono font-bold">{user.email}</span>
              </div>
              <button 
                onClick={signOut}
                className="p-2 text-tactical-text/40 hover:text-secondary transition-colors"
                title="로그아웃"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="glow-btn-primary text-[10px] py-1 px-4"
            >
              구글 계정 연결
            </button>
          )}
        </div>
      </header>

      {/* 메인 컨테이너 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 좌측: 캘린더/할 일 영역 */}
        <aside className="w-[400px] border-r border-tactical-border bg-tactical-bg/30 relative z-40">
          <CalendarArea 
            tasks={tasks}
            onAddTask={handleAddTask}
            onRemoveTask={handleRemoveTask}
            totalAvailableMinutes={TOTAL_AVAILABLE_MINUTES}
          />
        </aside>

        {/* 우측: 전장 영역 */}
        <section className="flex-1 bg-background relative">
          {gameState === '전투중' ? (
            <div className="h-full w-full flex flex-col items-center justify-center bg-secondary/5 animate-pulse">
              <Zap size={64} className="text-secondary mb-4 drop-shadow-[0_0_15px_rgba(255,0,212,0.8)]" />
              <h2 className="text-4xl font-black text-secondary italic tracking-tighter uppercase">교전 중...</h2>
              <p className="text-tactical-text/60 font-mono mt-2">대상 제거 및 데이터 동기화 중</p>
            </div>
          ) : (
            <Battlefield 
              soldierCount={currentSoldierCount}
              enemyCount={enemyCount}
              onStartBattle={handleStartBattle}
            />
          )}
        </section>
      </main>

      {/* 시각적 오버레이 */}
      <div className="fixed inset-0 pointer-events-none border-[20px] border-primary/5 z-[100] mix-blend-overlay" />
    </div>
  );
}

export default App;
