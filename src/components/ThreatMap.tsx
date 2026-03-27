import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ShieldAlert, Activity } from 'lucide-react';

interface Attack {
  id: string;
  source: { x: number; y: number; name: string };
  target: { x: number; y: number; name: string };
  type: 'ddos' | 'brute' | 'malware';
  severity: 'high' | 'medium' | 'low';
}

export function ThreatMap() {
  const [attacks, setAttacks] = useState<Attack[]>([]);

  // Generate random attacks
  useEffect(() => {
    const interval = setInterval(() => {
      const newAttack: Attack = {
        id: Math.random().toString(36).substring(2, 11),
        source: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, name: 'Unknown IP' },
        target: { x: 50, y: 50, name: 'Core Server' }, // Center target
        type: Math.random() > 0.5 ? 'ddos' : 'brute',
        severity: Math.random() > 0.7 ? 'high' : 'medium',
      };

      setAttacks(prev => [...prev.slice(-4), newAttack]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 group">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Center Target Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-16 h-16 rounded-full bg-ai/20 border border-ai/50 flex items-center justify-center glow-blue"
        >
          <Globe className="text-ai" size={32} />
        </motion.div>
        
        {/* Pulse rings */}
        <motion.div 
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-ai/30"
        />
        <motion.div 
          animate={{ scale: [1, 3.5], opacity: [0.3, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-ai/20"
        />
      </div>

      {/* Attack Lines and Nodes */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <AnimatePresence>
          {attacks.map((attack) => (
            <motion.g key={attack.id}>
              {/* Source Node */}
              <motion.circle
                initial={{ opacity: 0, r: 0 }}
                animate={{ opacity: 1, r: 4 }}
                exit={{ opacity: 0 }}
                cx={`${attack.source.x}%`}
                cy={`${attack.source.y}%`}
                fill="#EF4444"
                className="glow-red"
              />
              
              {/* Attack Line */}
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                x1={`${attack.source.x}%`}
                y1={`${attack.source.y}%`}
                x2={`${attack.target.x}%`}
                y2={`${attack.target.y}%`}
                stroke="#EF4444"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              
              {/* Projectile */}
              <motion.circle
                initial={{ cx: `${attack.source.x}%`, cy: `${attack.source.y}%`, opacity: 1 }}
                animate={{ cx: `${attack.target.x}%`, cy: `${attack.target.y}%`, opacity: 0 }}
                transition={{ duration: 1, ease: "linear" }}
                r="3"
                fill="#EF4444"
                className="glow-red"
              />
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>

      {/* Overlay Info */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-bg-secondary/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
        <Activity size={16} className="text-ai animate-pulse" />
        <span className="text-xs font-mono text-white/80">LIVE TRAFFIC</span>
      </div>
      
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-threat/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-threat/30">
        <ShieldAlert size={16} className="text-threat animate-pulse" />
        <span className="text-xs font-mono text-threat">{attacks.length} ACTIVE THREATS</span>
      </div>
    </div>
  );
}
