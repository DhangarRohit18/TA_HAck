import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ShieldCheck, AlertCircle, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
}

const INITIAL_ALERTS: Alert[] = [
  { id: '1', type: 'critical', message: 'DDoS attack detected on API Gateway', time: '10:42:01' },
  { id: '2', type: 'warning', message: 'Suspicious login attempt from RU', time: '10:41:15' },
  { id: '3', type: 'info', message: 'Auto-scaling triggered (CPU > 80%)', time: '10:38:22' },
  { id: '4', type: 'info', message: 'System recovery complete', time: '10:35:00' },
];

export function AlertsFeed() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);

  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Math.random().toString(36).substring(2, 11),
        type: Math.random() > 0.8 ? 'critical' : Math.random() > 0.5 ? 'warning' : 'info',
        message: Math.random() > 0.5 ? 'New vulnerability scanned in pipeline' : 'Unusual outbound traffic detected',
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-threat glow-red" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-white/80">Live Alerts Feed</h2>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-threat animate-pulse" />
          <span className="text-xs font-mono text-threat">LIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        <AnimatePresence initial={false}>
          {alerts.map((alert) => {
            const isCritical = alert.type === 'critical';
            const isWarning = alert.type === 'warning';
            const isInfo = alert.type === 'info';

            const Icon = isCritical ? AlertTriangle : isWarning ? AlertCircle : ShieldCheck;
            
            const colorClass = isCritical 
              ? 'text-threat border-threat/30 bg-threat/5' 
              : isWarning 
                ? 'text-warning border-warning/30 bg-warning/5' 
                : 'text-secure border-secure/30 bg-secure/5';

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "p-3 rounded-xl border flex items-start gap-3 transition-colors",
                  colorClass
                )}
              >
                <div className={cn("mt-0.5", isCritical ? "glow-red" : isWarning ? "" : "glow-green")}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 leading-snug">{alert.message}</p>
                  <span className="text-[10px] font-mono text-white/40 mt-1 block">{alert.time}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
