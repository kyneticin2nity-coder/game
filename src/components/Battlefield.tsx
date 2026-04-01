import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sword, Users, Target } from 'lucide-react';

interface BattlefieldProps {
  soldierCount: number;
  enemyCount: number;
  onStartBattle: (selectedIds: number[]) => void;
}

export const Battlefield: React.FC<BattlefieldProps> = ({ soldierCount, enemyCount, onStartBattle }) => {
  const [selectedSoldiers, setSelectedSoldiers] = useState<number[]>([]);

  const toggleSoldierSelection = (id: number) => {
    setSelectedSoldiers(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleEnemyClick = () => {
    if (selectedSoldiers.length > 0 && enemyCount > 0) {
      onStartBattle(selectedSoldiers);
      setSelectedSoldiers([]);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col p-10 overflow-hidden bg-[#f8fafc]">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} 
      />

      <header className="relative z-10 flex justify-between items-start mb-16">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-slate-800">
            <Shield size={28} className="text-blue-500" />
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">작전 구역</h2>
          </div>
          <p className="text-[11px] font-bold text-slate-400 tracking-[0.2em] ml-1">상태: 대기 중 (READY)</p>
        </div>
        
        <div className="flex gap-10">
          <div className="text-right">
            <span className="block text-[11px] font-black text-blue-500 uppercase tracking-widest mb-1">대기 유닛</span>
            <span className="text-5xl font-black text-slate-900 font-mono">{soldierCount}</span>
          </div>
          <div className="text-right">
            <span className="block text-[11px] font-black text-rose-500 uppercase tracking-widest mb-1">위협 수준</span>
            <span className="text-5xl font-black text-slate-900 font-mono">{enemyCount}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 grid grid-cols-2 gap-12 items-center">
        {/* 아군 구역 */}
        <div className="h-full border-r border-slate-200 pr-6 flex flex-wrap content-start gap-5">
          <div className="w-full mb-3 flex justify-between items-center">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Users size={14} className="text-blue-500" /> 출격할 유닛을 선택하십시오
            </span>
          </div>
          <AnimatePresence>
            {Array.from({ length: soldierCount }).map((_, i) => {
              const isSelected = selectedSoldiers.includes(i);
              return (
                <motion.div
                  key={`soldier-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: isSelected ? 1.15 : 1, 
                    opacity: 1,
                    y: isSelected ? -5 : 0
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => toggleSoldierSelection(i)}
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl cursor-pointer shadow-sm transition-all duration-200 overflow-hidden ${
                    isSelected 
                      ? 'bg-blue-500 text-white shadow-blue-200 shadow-xl ring-4 ring-blue-50' 
                      : 'bg-white border border-slate-200 text-blue-500 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <img src="/soldier.png" alt="soldier" className="w-full h-full object-cover" />
                </motion.div>
              );
            })}
          </AnimatePresence>
          {soldierCount === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 text-sm font-black uppercase tracking-widest text-center italic">
              예비 유닛이 부족합니다<br/>일정에서 여유 시간을 확보하십시오
            </div>
          )}
        </div>

        {/* 적군 구역 */}
        <div 
          className={`h-full pl-6 flex flex-wrap content-start gap-5 transition-all duration-500 rounded-3xl ${
            selectedSoldiers.length > 0 
              ? 'bg-rose-50/50 cursor-crosshair ring-2 ring-rose-100 ring-dashed' 
              : ''
          }`}
          onClick={handleEnemyClick}
        >
          <div className="w-full mb-3">
            <span className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${
              selectedSoldiers.length > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'
            }`}>
              <Target size={14} /> {selectedSoldiers.length > 0 ? '위협 대상을 클릭하여 교전 시작' : '감지된 위협'}
            </span>
          </div>
          <AnimatePresence>
            {Array.from({ length: enemyCount }).map((_, i) => (
              <motion.div
                key={`enemy-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 bg-white border border-rose-100 flex items-center justify-center rounded-2xl shadow-sm text-rose-500"
              >
                <Target size={24} />
              </motion.div>
            ))}
          </AnimatePresence>
          {enemyCount === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 text-sm font-black uppercase tracking-widest text-center italic">
              감지된 위협이 없습니다<br/>평화로운 구역입니다
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 mt-10 pt-8 border-t border-slate-200 flex justify-center">
        <div className="flex items-center gap-16 text-slate-400 font-bold text-[11px] tracking-widest uppercase">
          <div className={`flex items-center gap-2 transition-colors ${selectedSoldiers.length > 0 ? 'text-blue-500' : ''}`}>
            <Sword size={14} /> {selectedSoldiers.length > 0 ? `${selectedSoldiers.length} 유닛 준비 완료` : '전술 대기 중'}
          </div>
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
          <div>좌표: 37.5665, 126.9780</div>
        </div>
      </footer>
    </div>
  );
};
