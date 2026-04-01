import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sword, Users, Target } from 'lucide-react';

interface BattlefieldProps {
  soldierCount: number;
  enemyCount: number;
}

export const Battlefield: React.FC<BattlefieldProps> = ({ soldierCount, enemyCount }) => {
  return (
    <div className="relative h-full w-full flex flex-col p-8 overflow-hidden bg-background">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#3a3a45 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
      />

      <header className="relative z-10 flex justify-between items-start mb-12">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary">
            <Shield size={24} className="drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]" />
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">Frontline Defense</h2>
          </div>
          <p className="text-[10px] font-mono text-tactical-text/40 tracking-[0.2em]">OPERATIONAL_STATUS: ACTIVE</p>
        </div>
        
        <div className="flex gap-8">
          <div className="text-right">
            <span className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Allied Units</span>
            <span className="text-4xl font-black text-glow-primary font-mono">{soldierCount}</span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">Threat Level</span>
            <span className="text-4xl font-black text-glow-secondary font-mono">{enemyCount}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 grid grid-cols-2 gap-8 items-center">
        {/* Allied Zone */}
        <div className="h-full border-r border-tactical-border/50 pr-4 flex flex-wrap content-start gap-4">
          <AnimatePresence>
            {Array.from({ length: soldierCount }).map((_, i) => (
              <motion.div
                key={`soldier-${i}`}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-10 h-10 bg-primary/20 border border-primary/50 flex items-center justify-center rounded-sm shadow-glow-primary"
              >
                <Users size={18} className="text-primary" />
              </motion.div>
            ))}
          </AnimatePresence>
          {soldierCount === 0 && (
            <div className="w-full h-full flex items-center justify-center text-tactical-text/20 text-xs font-bold uppercase tracking-widest text-center italic">
              Awaiting reinforcement...<br/>Reserve more time.
            </div>
          )}
        </div>

        {/* Enemy Zone */}
        <div className="h-full pl-4 flex flex-wrap content-start gap-4">
          <AnimatePresence>
            {Array.from({ length: enemyCount }).map((_, i) => (
              <motion.div
                key={`enemy-${i}`}
                initial={{ scale: 0, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-10 h-10 bg-secondary/20 border border-secondary/50 flex items-center justify-center rounded-sm shadow-glow-secondary"
              >
                <Target size={18} className="text-secondary" />
              </motion.div>
            ))}
          </AnimatePresence>
          {enemyCount === 0 && (
            <div className="w-full h-full flex items-center justify-center text-tactical-text/20 text-xs font-bold uppercase tracking-widest text-center italic">
              Sector secured.<br/>No threats detected.
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 mt-8 pt-6 border-t border-tactical-border/50 flex justify-center">
        <div className="flex items-center gap-12 text-tactical-text/40 font-mono text-[10px] tracking-widest">
          <div className="flex items-center gap-2">
            <Sword size={12} /> ENGAGEMENT READY
          </div>
          <div className="w-1 h-1 bg-tactical-border rounded-full" />
          <div>GRID_COORDS: 37.5665, 126.9780</div>
        </div>
      </footer>
    </div>
  );
};
