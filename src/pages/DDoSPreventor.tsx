import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ShieldCheck, Activity, Server, Play, Globe, Zap, Network, Crosshair } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

const INITIAL_DATA = Array.from({ length: 30 }).map((_, i) => ({
  time: `-${30 - i}s`,
  normal: Math.floor(Math.random() * 20) + 40,
  malicious: Math.floor(Math.random() * 5),
}));

export function DDoSPreventor() {
  const [stage, setStage] = useState<'idle' | 'attack' | 'mitigating' | 'resolved'>('idle');
  const [chartData, setChartData] = useState(INITIAL_DATA);
  const [logs, setLogs] = useState<{time: string, msg: string, type: string}[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string, type: 'info' | 'warn' | 'critical' | 'success') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString('en-US', { hour12: false }), msg, type }]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const startSimulation = () => {
    setStage('attack');
    setLogs([]);
    addLog('WARNING: Massive inbound traffic spike detected from multiple regions.', 'critical');
    
    setTimeout(() => {
      setStage('mitigating');
      addLog('AI ENGINE: Volumetric DDoS pattern recognized. Initiating autonomous defense.', 'warn');
      addLog('ACTION: Scaling edge nodes to absorb impact.', 'info');
      addLog('ACTION: Deploying dynamic IP blocklist and rate-limiting.', 'info');
    }, 4000);

    setTimeout(() => {
      setStage('resolved');
      addLog('SUCCESS: Malicious traffic scrubbed. Normal operations restored.', 'success');
    }, 9000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        let normal = Math.floor(Math.random() * 20) + 40;
        let malicious = Math.floor(Math.random() * 5);

        if (stage === 'attack') {
          malicious = Math.floor(Math.random() * 400) + 200;
          normal = Math.max(0, normal - 20); // Normal traffic drops due to congestion
        } else if (stage === 'mitigating') {
          malicious = Math.floor(Math.random() * 100) + 50;
          normal = Math.floor(Math.random() * 20) + 30;
        } else if (stage === 'resolved') {
          malicious = Math.floor(Math.random() * 10);
        }

        return [...prev.slice(1), { 
          time: new Date().toLocaleTimeString('en-US', { hour12: false }), 
          normal, 
          malicious 
        }];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">DDoS Attack Preventor</h2>
          <p className="text-sm text-white/50 mt-1">Real-time autonomous threat neutralization</p>
        </div>
        <button 
          onClick={startSimulation}
          disabled={stage === 'attack' || stage === 'mitigating'}
          className={cn(
            "px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all",
            stage === 'idle' || stage === 'resolved'
              ? "bg-threat text-white hover:bg-threat/90 glow-red"
              : "bg-white/10 text-white/50 cursor-not-allowed"
          )}
        >
          <Play size={16} />
          {stage === 'idle' || stage === 'resolved' ? 'Simulate DDoS Attack' : 'Attack in Progress...'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
        {/* Left Side: Chart and Stats */}
        <div className="lg:col-span-3 flex flex-col gap-6 min-h-0">
          <div className="glass-panel rounded-2xl border border-white/10 p-5 flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity size={18} className={cn("transition-colors", stage === 'attack' ? "text-threat glow-red" : "text-ai glow-blue")} />
                <h3 className="font-semibold">Live Traffic Analysis</h3>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-ai glow-blue" /> Legitimate Traffic</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-threat glow-red" /> Malicious Requests</div>
              </div>
            </div>
            
            <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMalicious" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickMargin={10} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(val) => `${val}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(11, 15, 26, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="malicious" stackId="1" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorMalicious)" />
                  <Area type="monotone" dataKey="normal" stackId="2" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorNormal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-3 gap-4 h-32">
            <div className={cn("glass-panel rounded-xl border p-4 flex flex-col justify-center transition-colors", 
              stage === 'attack' ? "border-threat/50 bg-threat/10" : "border-white/10"
            )}>
              <div className="flex items-center gap-2 text-white/50 mb-2">
                <Crosshair size={16} className={stage === 'attack' ? "text-threat" : ""} />
                <span className="text-xs uppercase tracking-wider">System Status</span>
              </div>
              <div className={cn("text-xl font-bold font-mono", 
                stage === 'idle' ? "text-ai" : 
                stage === 'attack' ? "text-threat glow-red" : 
                stage === 'mitigating' ? "text-warning glow-yellow" : "text-secure glow-green"
              )}>
                {stage === 'idle' ? 'MONITORING' : 
                 stage === 'attack' ? 'UNDER ATTACK' : 
                 stage === 'mitigating' ? 'MITIGATING' : 'SECURED'}
              </div>
            </div>
            
            <div className="glass-panel rounded-xl border border-white/10 p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-white/50 mb-2">
                <Network size={16} />
                <span className="text-xs uppercase tracking-wider">Blocked IPs</span>
              </div>
              <div className="text-2xl font-bold font-mono text-intel glow-purple">
                {stage === 'idle' ? '0' : stage === 'attack' ? '142' : stage === 'mitigating' ? '8,492' : '8,504'}
              </div>
            </div>

            <div className="glass-panel rounded-xl border border-white/10 p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-white/50 mb-2">
                <Zap size={16} />
                <span className="text-xs uppercase tracking-wider">Edge Nodes</span>
              </div>
              <div className="text-2xl font-bold font-mono text-ai glow-blue">
                {stage === 'idle' ? '12' : stage === 'attack' ? '12' : stage === 'mitigating' ? '48' : '24'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: AI Action Log */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 flex flex-col min-h-0 h-full overflow-hidden lg:max-h-[calc(100vh-12rem)]">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-secure" />
              <span className="text-sm font-semibold text-white/90">AI Defense Log</span>
            </div>
          </div>
          
          <div className="flex-1 p-4 bg-[#0d1117] font-mono text-xs overflow-y-auto flex flex-col gap-3">
            {logs.length === 0 ? (
              <div className="text-white/30 text-center mt-10">Awaiting events...</div>
            ) : (
              logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/30">[{log.time}]</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                      log.type === 'critical' ? "bg-threat/20 text-threat border border-threat/30" :
                      log.type === 'warn' ? "bg-warning/20 text-warning border border-warning/30" :
                      log.type === 'success' ? "bg-secure/20 text-secure border border-secure/30" :
                      "bg-ai/20 text-ai border border-ai/30"
                    )}>
                      {log.type}
                    </span>
                  </div>
                  <span className={cn(
                    "text-sm",
                    log.type === 'critical' ? "text-threat" :
                    log.type === 'warn' ? "text-warning" :
                    log.type === 'success' ? "text-secure" :
                    "text-white/80"
                  )}>
                    {log.msg}
                  </span>
                </motion.div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
