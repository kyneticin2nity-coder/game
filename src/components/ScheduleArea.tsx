import React, { useState } from 'react';
import { Plus, Trash2, Clock, Calendar as CalendarIcon, Briefcase, Smile, Coffee } from 'lucide-react';
import { ScheduleType, Schedule } from '../App';

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
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [type, setType] = useState<ScheduleType>('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddSchedule(title, start, end, type);
    setTitle('');
  };

  const getTypeStyle = (t: ScheduleType) => {
    switch(t) {
      case 'free': return 'bg-schedule-free border-sky-300 text-sky-900';
      case 'work': return 'bg-schedule-work border-rose-300 text-white';
      case 'normal': return 'bg-schedule-normal border-yellow-300 text-yellow-900';
    }
  };

  const getTypeIcon = (t: ScheduleType) => {
    switch(t) {
      case 'free': return <Coffee size={14} />;
      case 'work': return <Briefcase size={14} />;
      case 'normal': return <Smile size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6 overflow-hidden">
      <header className="space-y-1">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-2">
          <CalendarIcon className="text-blue-500" /> 작전 일정 관리
        </h2>
        <p className="text-slate-400 text-xs font-bold font-mono">SECTOR: SCHEDULER_PRO</p>
      </header>

      {/* 일정 입력 폼 */}
      <form onSubmit={handleSubmit} className="tactical-card p-5 space-y-4 border-slate-200">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">일정 이름</label>
          <input 
            type="text" 
            placeholder="일정 명칭을 입력하십시오" 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">시작 시간</label>
            <input 
              type="time" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">종료 시간</label>
            <input 
              type="time" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">일정 종류</label>
          <div className="grid grid-cols-3 gap-2">
            {(['free', 'work', 'normal'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-2 text-[10px] font-black rounded-lg border-2 transition-all ${
                  type === t 
                    ? (t === 'free' ? 'bg-sky-100 border-sky-400 text-sky-700' : 
                       t === 'work' ? 'bg-rose-100 border-rose-400 text-rose-700' : 
                       'bg-yellow-100 border-yellow-400 text-yellow-700')
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                {t === 'free' ? '여유(Free)' : t === 'work' ? '업무(Work)' : '일반(Normal)'}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full glow-btn-primary h-11 flex items-center justify-center gap-2">
          <Plus size={18} /> 일정 추가하기
        </button>
      </form>

      {/* 일정 목록 */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
        {schedules.map((s) => (
          <div key={s.id} className="tactical-card p-4 flex items-center justify-between group hover:border-slate-300 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${getTypeStyle(s.type)}`}>
                {getTypeIcon(s.type)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{s.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono font-bold">
                  <Clock size={12} /> {s.startTime} - {s.endTime}
                </div>
              </div>
            </div>
            <button 
              onClick={() => onRemoveSchedule(s.id)}
              className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {schedules.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 text-xs font-bold uppercase tracking-widest text-center">
            기록된 일정이 없습니다<br/>오늘의 작전을 계획하십시오
          </div>
        )}
      </div>

      <footer className="tactical-card p-4 bg-slate-50 border-slate-200">
        <div className="flex justify-between items-center text-[11px] font-black text-slate-500 uppercase tracking-tighter">
          <span>작전 데이터 요약</span>
          <span className="text-blue-500">PRO_MODE: ACTIVE</span>
        </div>
      </footer>
    </div>
  );
};
