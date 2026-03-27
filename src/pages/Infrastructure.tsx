import React from 'react';
import { motion } from 'motion/react';
import { Server, Activity, ArrowUpRight, ArrowDownRight, RefreshCcw, Zap, CheckCircle2 } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '../lib/utils';

const TRAFFIC_DATA = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  traffic: Math.floor(Math.random() * 5000) + 1000,
  pods: Math.floor(Math.random() * 10) + 2,
}));

const ACTIONS = [
  { id: 1, type: 'scale', message: 'Scaled pods 4 → 8 due to traffic spike', time: '10:42 AM', status: 'success' },
  { id: 2, type: 'heal', message: 'Restarted crashed container (auth-service)', time: '10:15 AM', status: 'success' },
  { id: 3, type: 'sla', message: 'Re-routed traffic to secondary region (latency > 200ms)', time: '09:30 AM', status: 'success' },
  { id: 4, type: 'scale', message: 'Scaled down pods 8 → 4 (low traffic)', time: '08:00 AM', status: 'success' },
];

export function Infrastructure() {
  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Autonomous IT Engine</h2>
        <p className="text-sm text-white/50 mt-1">Self-healing, auto-scaling, and SLA optimization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-ai glow-blue" />
              <span className="text-sm font-semibold text-white/90">Predictive Auto-Scaling</span>
            </div>
            <span className="text-xs font-mono text-ai bg-ai/10 px-2 py-1 rounded-md border border-ai/20">
              AI OPTIMIZED
            </span>
          </div>
          
          <div className="p-6 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121826', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="traffic" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Log */}
        <div className="glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <Server size={16} className="text-secure glow-green" />
            <span className="text-sm font-semibold text-white/90">Autonomous Actions</span>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {ACTIONS.map((action, idx) => (
              <motion.div 
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg border",
                    action.type === 'scale' ? "bg-ai/10 border-ai/30 text-ai" :
                    action.type === 'heal' ? "bg-warning/10 border-warning/30 text-warning" :
                    "bg-secure/10 border-secure/30 text-secure"
                  )}>
                    {action.type === 'scale' ? <ArrowUpRight size={16} /> :
                     action.type === 'heal' ? <RefreshCcw size={16} /> :
                     <Zap size={16} />}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/90 leading-snug">{action.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-white/40">{action.time}</span>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-secure" />
                        <span className="text-[10px] font-mono text-secure uppercase">Success</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* SLA Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white/60 mb-1">Global Uptime</h3>
            <p className="text-3xl font-mono font-bold text-secure text-glow-green">99.999%</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-secure/10 border border-secure/30 flex items-center justify-center">
            <Activity size={24} className="text-secure" />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white/60 mb-1">Avg Latency</h3>
            <p className="text-3xl font-mono font-bold text-ai text-glow-blue">42ms</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-ai/10 border border-ai/30 flex items-center justify-center">
            <Zap size={24} className="text-ai" />
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white/60 mb-1">Active Pods</h3>
            <p className="text-3xl font-mono font-bold text-intel text-glow-purple">128</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-intel/10 border border-intel/30 flex items-center justify-center">
            <Server size={24} className="text-intel" />
          </div>
        </div>
      </div>
    </div>
  );
}
