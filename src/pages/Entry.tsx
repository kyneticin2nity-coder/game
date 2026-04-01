import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Swords, Zap, Clock, Shield } from 'lucide-react';

export const Entry: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden z-0">
        <div className="grid grid-cols-12 gap-8 rotate-12 -translate-y-24">
          {Array.from({ length: 48 }).map((_, i) => (
            <Zap key={i} size={80} className="text-blue-900" />
          ))}
        </div>
      </div>

      <div className="max-w-4xl w-full z-10 space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-4">
            <Shield size={16} className="text-blue-600" />
            <span className="text-xs font-black text-blue-600 tracking-widest uppercase">System Operational</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-slate-900 uppercase leading-[0.85] flex flex-col items-center">
            <span>Time Defender</span>
            <span className="text-blue-600 drop-shadow-sm">White Edition</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm md:text-base">
            작전을 설계하고 전장을 지배하십시오
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Schedule Management Option */}
          <button
            onClick={() => navigate('/schedule')}
            className="group relative h-80 bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 text-left transition-all hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100 active:scale-95 overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 group-hover:scale-110 duration-500">
              <Calendar size={240} className="text-blue-900" />
            </div>
            
            <div className="relative h-full flex flex-col justify-between">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Calendar size={32} />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-blue-400" />
                  <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Protocol Alpha</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
                  작전 일정 관리
                </h2>
                <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-[240px]">
                  노션 캘린더 스타일의 시간 관리 시스템을 통해 오늘의 전략적 일정을 수립하십시오.
                </p>
              </div>
            </div>
          </button>

          {/* Operation Zone Option */}
          <button
            onClick={() => navigate('/battlefield')}
            className="group relative h-80 bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 text-left transition-all hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-900/20 active:scale-95 overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 group-hover:scale-110 duration-500">
              <Swords size={240} className="text-emerald-500" />
            </div>

            <div className="relative h-full flex flex-col justify-between">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Swords size={32} />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-emerald-500" />
                  <span className="text-xs font-black text-emerald-500/60 uppercase tracking-widest">Protocol Omega</span>
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
                  작전 구역 진입
                </h2>
                <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-[240px]">
                  수립된 작전 일정을 바탕으로 실제 전장에 투입되어 위협을 제거하고 경험치를 획득하십시오.
                </p>
              </div>
            </div>
          </button>
        </div>

        <footer className="text-center pt-8">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
            Time Defender Operation System v2.0 // Secured Connection
          </p>
        </footer>
      </div>
    </div>
  );
};
