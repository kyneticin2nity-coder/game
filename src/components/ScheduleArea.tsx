import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Calendar as CalendarIcon, Briefcase, Smile, Coffee, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ScheduleType, Schedule } from '../App';

interface ScheduleAreaProps {
  schedules: Schedule[];
  onAddSchedule: (title: string, startTime: string, endTime: string, type: ScheduleType) => void;
  onRemoveSchedule: (id: string) => void;
}

export const ScheduleArea: React.FC<ScheduleAreaProps> = ({ 
  schedules, 
  onAddSchedule, 
  onRemoveSchedule 
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [type, setType] = useState<ScheduleType>('normal');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Drag to create state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartMin, setDragStartMin] = useState<number | null>(null);
  const [dragCurrentMin, setDragCurrentMin] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddSchedule(title, start, end, type);
    setTitle('');
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const hourHeight = 80; // height of one hour in pixels

  const timeToMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const getPosition = (time: string) => {
    const minutes = timeToMinutes(time);
    return (minutes / 60) * hourHeight;
  };

  const getHeight = (start: string, end: string) => {
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);
    return ((endMin - startMin) / 60) * hourHeight;
  };

  const getTypeColor = (t: ScheduleType) => {
    switch(t) {
      case 'free': return 'bg-sky-100/80 border-sky-300 text-sky-900';
      case 'work': return 'bg-rose-100/80 border-rose-300 text-rose-900';
      case 'normal': return 'bg-yellow-100/80 border-yellow-300 text-yellow-900';
    }
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const totalMinutes = (y / hourHeight) * 60;
    // Snap to 15 minutes
    const snappedMinutes = Math.round(totalMinutes / 15) * 15;
    
    setIsDragging(true);
    setDragStartMin(snappedMinutes);
    setDragCurrentMin(snappedMinutes + 30); // Default 30 min duration
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const totalMinutes = (y / hourHeight) * 60;
    const snappedMinutes = Math.round(totalMinutes / 15) * 15;
    
    setDragCurrentMin(snappedMinutes);
  };

  const handleMouseUp = () => {
    if (!isDragging || dragStartMin === null || dragCurrentMin === null) {
      setIsDragging(false);
      return;
    }

    const min = Math.min(dragStartMin, dragCurrentMin);
    const max = Math.max(dragStartMin, dragCurrentMin);
    
    // Ensure at least 15 minutes
    const finalMax = max === min ? min + 15 : max;

    setStart(minutesToTime(min));
    setEnd(minutesToTime(finalMax));
    setIsDragging(false);
    setDragStartMin(null);
    setDragCurrentMin(null);

    // Focus title input to encourage naming the new schedule
    titleInputRef.current?.focus();
  };

  // Scroll to 08:00 on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 8 * hourHeight;
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans select-none">
      {/* Left Sidebar - Form & List */}
      <aside className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 border-b border-slate-100 bg-white">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">메인으로</span>
          </button>
          
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-2 mb-1">
            <CalendarIcon className="text-blue-600" size={24} /> 작전 설계
          </h2>
          <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Operation Planner Pro</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">일정 명칭</label>
              <input 
                ref={titleInputRef}
                type="text" 
                placeholder="일정을 입력하세요" 
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all shadow-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">시작</label>
                <input 
                  type="time" 
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm focus:border-blue-500 outline-none shadow-sm"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">종료</label>
                <input 
                  type="time" 
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm focus:border-blue-500 outline-none shadow-sm"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">유형 선택</label>
              <div className="flex flex-col gap-2">
                {(['free', 'work', 'normal'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-bold text-xs ${
                      type === t 
                        ? (t === 'free' ? 'bg-sky-50 border-sky-500 text-sky-700' : 
                           t === 'work' ? 'bg-rose-50 border-rose-500 text-rose-700' : 
                           'bg-yellow-50 border-yellow-500 text-yellow-700')
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {t === 'free' ? <Coffee size={14} /> : t === 'work' ? <Briefcase size={14} /> : <Smile size={14} />}
                      {t === 'free' ? '여유(Free)' : t === 'work' ? '업무(Work)' : '일반(Normal)'}
                    </div>
                    {type === t && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-200 uppercase tracking-widest mt-2">
              <Plus size={18} /> Add Schedule
            </button>
          </form>

          {/* Mini List */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">오늘의 일정 목록</h3>
            <div className="space-y-2">
              {schedules.map(s => (
                <div key={s.id} className="group flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      s.type === 'free' ? 'bg-sky-400' : s.type === 'work' ? 'bg-rose-400' : 'bg-yellow-400'
                    }`} />
                    <div>
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{s.title}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{s.startTime} - {s.endTime}</div>
                    </div>
                  </div>
                  <button onClick={() => onRemoveSchedule(s.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Calendar View */}
      <main className="flex-1 flex flex-col">
        {/* Calendar Header */}
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Today</h3>
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
              <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-400 hover:text-slate-900 transition-all"><ChevronLeft size={18} /></button>
              <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-400 hover:text-slate-900 transition-all"><ChevronRight size={18} /></button>
            </div>
            <span className="text-sm font-bold text-slate-600">April 2026</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button className="px-4 py-1.5 text-xs font-bold text-slate-400">Day</button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-900 bg-white shadow-sm rounded-lg border border-slate-100">Week</button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-400">Month</button>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-900"><Settings size={20} /></button>
          </div>
        </header>

        {/* Scrollable Grid Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto relative bg-white scroll-smooth"
        >
          {/* Time Labels Sidebar inside grid */}
          <div className="absolute left-0 top-0 w-20 h-full border-r border-slate-50 pointer-events-none z-10 bg-white">
            {hours.map(hour => (
              <div 
                key={hour} 
                className="absolute w-full flex justify-center"
                style={{ top: `${hour * hourHeight}px`, transform: 'translateY(-50%)' }}
              >
                <span className="text-[10px] font-bold text-slate-300">
                  {hour === 0 ? '' : `${hour.toString().padStart(2, '0')}:00`}
                </span>
              </div>
            ))}
          </div>

          {/* Grid Content */}
          <div 
            ref={gridRef}
            className="ml-20 relative h-[1920px] mr-8 cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => isDragging && handleMouseUp()}
          > 
            {/* Grid Lines */}
            {hours.map(hour => (
              <div 
                key={hour} 
                className="absolute w-full border-t border-slate-50 pointer-events-none"
                style={{ top: `${hour * hourHeight}px` }}
              />
            ))}

            {/* Ghost / Drag Selection */}
            {isDragging && dragStartMin !== null && dragCurrentMin !== null && (
              <div 
                className="absolute left-4 right-4 bg-blue-500/10 border-2 border-blue-500/30 rounded-xl z-30 pointer-events-none"
                style={{
                  top: `${(Math.min(dragStartMin, dragCurrentMin) / 60) * hourHeight}px`,
                  height: `${(Math.abs(dragCurrentMin - dragStartMin) / 60) * hourHeight || (15 / 60) * hourHeight}px`
                }}
              >
                <div className="absolute top-2 left-3 text-[10px] font-bold text-blue-600 bg-white/80 px-1.5 py-0.5 rounded shadow-sm">
                  {minutesToTime(Math.min(dragStartMin, dragCurrentMin))} - {minutesToTime(Math.max(dragStartMin, dragCurrentMin) || Math.min(dragStartMin, dragCurrentMin) + 15)}
                </div>
              </div>
            )}

            {/* Current Time Indicator */}
            <div 
              className="absolute w-full flex items-center z-20 pointer-events-none"
              style={{ top: `${(new Date().getHours() + new Date().getMinutes() / 60) * hourHeight}px` }}
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 -ml-1" />
              <div className="flex-1 h-[2px] bg-rose-500" />
            </div>

            {/* Schedules */}
            {schedules.map(s => {
              const top = getPosition(s.startTime);
              const height = getHeight(s.startTime, s.endTime);
              return (
                <div
                  key={s.id}
                  className={`absolute left-4 right-4 rounded-xl border-l-4 p-3 flex flex-col shadow-sm transition-all hover:shadow-md hover:scale-[1.01] overflow-hidden z-20 ${getTypeColor(s.type)}`}
                  style={{ top: `${top}px`, height: `${height}px`, minHeight: '30px' }}
                  onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking on existing schedule
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-black leading-tight mb-0.5">{s.title}</span>
                      <span className="text-[10px] font-bold opacity-60">
                        {s.startTime} - {s.endTime}
                      </span>
                    </div>
                    <div className="opacity-40">{s.type === 'free' ? <Coffee size={14} /> : s.type === 'work' ? <Briefcase size={14} /> : <Smile size={14} />}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
