import { useState, useEffect } from 'react';
import { supabase, signInWithGoogle, signOut } from './lib/supabaseClient';
import { CalendarArea } from './components/CalendarArea';
import { Battlefield } from './components/Battlefield';
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Task {
  id: string;
  title: string;
  durationMinutes: number;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const TOTAL_AVAILABLE_MINUTES = 480; // 8 hours work day

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
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
  const freeMinutes = Math.max(0, TOTAL_AVAILABLE_MINUTES - busyMinutes);
  
  // Core Game Logic: 15 mins = 1 soldier, 1 task = 1 enemy
  const soldierCount = Math.floor(freeMinutes / 15);
  const enemyCount = tasks.length;

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-tactical-text overflow-hidden">
      {/* Tactical Header */}
      <header className="h-16 border-b border-tactical-border px-8 flex items-center justify-between bg-tactical-bg/50 backdrop-blur-md relative z-50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 border border-primary/30 rounded shadow-glow-primary">
            <LayoutDashboard size={20} className="text-primary" />
          </div>
          <h1 className="text-xl font-black italic tracking-tighter text-glow-primary uppercase">Time Defender v1.0</h1>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-tactical-bg border border-tactical-border rounded-full">
                <UserIcon size={14} className="text-primary" />
                <span className="text-[10px] font-mono font-bold">{user.email}</span>
              </div>
              <button 
                onClick={signOut}
                className="p-2 text-tactical-text/40 hover:text-secondary transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="glow-btn-primary text-[10px]"
            >
              Initialize Google Auth
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Calendar Area */}
        <aside className="w-[400px] border-r border-tactical-border bg-tactical-bg/30 relative z-40">
          <CalendarArea 
            tasks={tasks}
            onAddTask={handleAddTask}
            onRemoveTask={handleRemoveTask}
            totalAvailableMinutes={TOTAL_AVAILABLE_MINUTES}
          />
        </aside>

        {/* Right Side: Battlefield */}
        <section className="flex-1 bg-background relative">
          <Battlefield 
            soldierCount={soldierCount}
            enemyCount={enemyCount}
          />
        </section>
      </main>

      {/* Aesthetic Overlay */}
      <div className="fixed inset-0 pointer-events-none border-[20px] border-primary/5 z-[100] mix-blend-overlay" />
    </div>
  );
}

export default App;
