import React, { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  durationMinutes: number;
}

interface CalendarAreaProps {
  tasks: Task[];
  onAddTask: (title: string, duration: number) => void;
  onRemoveTask: (id: string) => void;
  totalAvailableMinutes: number;
}

export const CalendarArea: React.FC<CalendarAreaProps> = ({ 
  tasks, 
  onAddTask, 
  onRemoveTask,
  totalAvailableMinutes 
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle, newDuration);
    setNewTitle('');
  };

  const busyMinutes = tasks.reduce((acc, t) => acc + t.durationMinutes, 0);
  const freeMinutes = Math.max(0, totalAvailableMinutes - busyMinutes);

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-black text-glow-primary tracking-tighter uppercase">Operations Center</h2>
        <p className="text-tactical-text/60 text-xs font-mono">SECTOR: TIME_LOG_01</p>
      </header>

      <form onSubmit={handleSubmit} className="tactical-card p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary uppercase tracking-widest">New Objective</label>
          <input 
            type="text" 
            placeholder="Enter mission title..." 
            className="w-full bg-background/50 border border-tactical-border p-2 text-sm focus:border-primary outline-none transition-colors"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Estimated Time (Min)</label>
            <input 
              type="number" 
              className="w-full bg-background/50 border border-tactical-border p-2 text-sm focus:border-primary outline-none transition-colors"
              value={newDuration}
              onChange={(e) => setNewDuration(Number(e.target.value))}
            />
          </div>
          <button type="submit" className="self-end glow-btn-primary h-10 px-4 flex items-center justify-center">
            <Plus size={20} />
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-tactical-border">
        {tasks.map((task) => (
          <div key={task.id} className="tactical-card p-3 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-secondary shadow-glow-secondary" />
              <div>
                <h4 className="text-sm font-bold text-tactical-text">{task.title}</h4>
                <div className="flex items-center gap-1 text-[10px] text-tactical-text/50 font-mono">
                  <Clock size={10} /> {task.durationMinutes}m
                </div>
              </div>
            </div>
            <button 
              onClick={() => onRemoveTask(task.id)}
              className="p-2 text-tactical-text/30 hover:text-secondary transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="h-32 flex items-center justify-center border border-dashed border-tactical-border rounded-lg text-tactical-text/20 text-xs uppercase font-bold tracking-widest">
            No active missions
          </div>
        )}
      </div>

      <footer className="tactical-card p-4 bg-primary/5 border-primary/20">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Reserve Capacity</span>
          <span className="text-lg font-black text-glow-primary">{freeMinutes}m</span>
        </div>
        <div className="w-full h-1 bg-tactical-border mt-2 overflow-hidden">
          <div 
            className="h-full bg-primary shadow-glow-primary transition-all duration-500" 
            style={{ width: `${(freeMinutes / totalAvailableMinutes) * 100}%` }}
          />
        </div>
      </footer>
    </div>
  );
};
