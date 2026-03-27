import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Shield, Zap, Server } from 'lucide-react';
import { cn } from '../lib/utils';

const DECISIONS = [
  {
    id: 1,
    action: 'Blocked IP 192.168.1.10',
    reason: 'Anomaly score = 0.91 (Matched DDoS pattern)',
    confidence: 94,
    icon: Shield,
    color: 'secure',
    time: 'Just now'
  },
  {
    id: 2,
    action: 'Scaled pods 2 → 6',
    reason: 'Traffic spike detected (+400%)',
    confidence: 98,
    icon: Zap,
    color: 'ai',
    time: '2m ago'
  },
  {
    id: 3,
    action: 'Restarted service auth-api',
    reason: 'Memory leak pattern identified',
    confidence: 89,
    icon: Server,
    color: 'warning',
    time: '5m ago'
  }
];

export function AIDecisions() {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit size={20} className="text-intel glow-blue" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-white/80">AI Decision Panel</h2>
        </div>
        <span className="text-xs font-mono text-intel bg-intel/10 px-2 py-1 rounded-md border border-intel/20">
          AUTO-PILOT ACTIVE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        <AnimatePresence>
          {DECISIONS.map((decision, index) => {
            const Icon = decision.icon;
            const colorMap = {
              secure: 'text-secure bg-secure/10 border-secure/20',
              ai: 'text-ai bg-ai/10 border-ai/20',
              warning: 'text-warning bg-warning/10 border-warning/20',
            };
            const iconColorMap = {
              secure: 'text-secure',
              ai: 'text-ai',
              warning: 'text-warning',
            };

            return (
              <motion.div
                key={decision.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg border", colorMap[decision.color])}>
                    <Icon size={16} className={iconColorMap[decision.color]} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-white truncate">{decision.action}</h4>
                      <span className="text-[10px] text-white/40 whitespace-nowrap ml-2">{decision.time}</span>
                    </div>
                    <p className="text-xs text-white/60 truncate">{decision.reason}</p>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${decision.confidence}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={cn(
                            "h-full", 
                            decision.color === 'secure' ? 'bg-secure' : 
                            decision.color === 'ai' ? 'bg-ai' : 'bg-warning'
                          )}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-white/50">{decision.confidence}% Conf</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
