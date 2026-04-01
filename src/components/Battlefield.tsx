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
      setSelectedSoldiers([]); // 전투 시작 후 선택 초기화
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col p-8 overflow-hidden bg-background">
      {/* 배경 그리드 패턴 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#3a3a45 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <header className="relative z-10 flex justify-between items-start mb-12">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary">
            <Shield size={24} className="drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]" />
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">전방 방어선</h2>
          </div>
          <p className="text-[10px] font-mono text-tactical-text/40 tracking-[0.2em]">운영 상태: 활성 (ACTIVE)</p>
        </div>
        
        <div className="flex gap-8">
          <div className="text-right">
            <span className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-1">아군 유닛</span>
            <span className="text-4xl font-black text-glow-primary font-mono">{soldierCount}</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">위협 수준</span>
            <span className="text-4xl font-black text-glow-secondary font-mono">{enemyCount}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 grid grid-cols-2 gap-8 items-center">
        {/* 아군 구역 */}
        <div className="h-full border-r border-tactical-border/50 pr-4 flex flex-wrap content-start gap-4">
          <div className="w-full mb-2 flex justify-between items-center">
            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest flex items-center gap-2">
              <Users size={12} /> 유닛을 선택하십시오
            </span>
            {selectedSoldiers.length > 0 && (
              <span className="text-[10px] font-bold text-primary animate-pulse">
                {selectedSoldiers.length}명 선택됨
              </span>
            )}
          </div>
          <AnimatePresence>
            {Array.from({ length: soldierCount }).map((_, i) => {
              const isSelected = selectedSoldiers.includes(i);
              return (
                <motion.div
                  key={`soldier-${i}`}
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ 
                    scale: isSelected ? 1.1 : 1, 
                    opacity: 1, 
                    y: 0,
                    boxShadow: isSelected ? '0 0 20px rgba(0, 242, 255, 0.8)' : '0 0 10px rgba(0, 242, 255, 0.2)'
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => toggleSoldierSelection(i)}
                  className={`w-12 h-12 flex items-center justify-center rounded-sm cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-primary/40 border-2 border-primary shadow-glow-primary' 
                      : 'bg-primary/10 border border-primary/30 hover:bg-primary/20'
                  }`}
                >
                  <Users size={20} className={isSelected ? 'text-white' : 'text-primary'} />
                </motion.div>
              );
            })}
          </AnimatePresence>
          {soldierCount === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-tactical-text/20 text-xs font-bold uppercase tracking-widest text-center italic">
              지원 병력 대기 중...<br/>여유 시간을 확보하십시오.
            </div>
          )}
        </div>

        {/* 적군 구역 */}
        <div 
          className={`h-full pl-4 flex flex-wrap content-start gap-4 transition-all duration-300 rounded-lg ${
            selectedSoldiers.length > 0 ? 'bg-secondary/5 cursor-crosshair ring-1 ring-secondary/20' : ''
          }`}
          onClick={handleEnemyClick}
        >
          <div className="w-full mb-2">
            <span className="text-[10px] font-bold text-secondary/60 uppercase tracking-widest flex items-center gap-2">
              <Target size={12} /> {selectedSoldiers.length > 0 ? '대상을 클릭하여 공격' : '감지된 위협'}
            </span>
          </div>
          <AnimatePresence>
            {Array.from({ length: enemyCount }).map((_, i) => (
              <motion.div
                key={`enemy-${i}`}
                initial={{ scale: 0, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 bg-secondary/20 border border-secondary/50 flex items-center justify-center rounded-sm shadow-glow-secondary"
              >
                <Target size={20} className="text-secondary" />
              </motion.div>
            ))}
          </AnimatePresence>
          {enemyCount === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-tactical-text/20 text-xs font-bold uppercase tracking-widest text-center italic">
              구역 확보 완료.<br/>위협이 감지되지 않았습니다.
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 mt-8 pt-6 border-t border-tactical-border/50 flex justify-center">
        <div className="flex items-center gap-12 text-tactical-text/40 font-mono text-[10px] tracking-widest">
          <div className="flex items-center gap-2">
            <Sword size={12} /> {selectedSoldiers.length > 0 ? '교전 준비 완료' : '대기 모드'}
          </div>
          <div className="w-1 h-1 bg-tactical-border rounded-full" />
          <div>GRID_COORDS: 37.5665, 126.9780</div>
        </div>
      </footer>
    </div>
  );
};
