import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Activity, Terminal, Filter, Download, Server, ShieldAlert, Cpu, Network } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '../lib/utils';

const INITIAL_LOGS = [
  { time: '10:42:01', level: 'INFO', source: 'AI_ENGINE', message: 'Model weights updated successfully. Confidence threshold set to 0.92.' },
  { time: '10:42:15', level: 'WARN', source: 'FIREWALL', message: 'Unusual traffic spike detected from IP 192.168.1.105. Monitoring.' },
  { time: '10:42:30', level: 'INFO', source: 'AUTOSCALER', message: 'Predictive AIOps: Expected traffic surge. Scaling up frontend pods (4 → 12).' },
  { time: '10:42:45', level: 'CRITICAL', source: 'IDS', message: 'Brute-force login attempt on admin account. Source: 45.33.22.11' },
  { time: '10:43:00', level: 'INFO', source: 'AI_ENGINE', message: 'Autonomous mitigation applied. IP 45.33.22.11 added to global blocklist.' },
  { time: '10:43:10', level: 'INFO', source: 'SYSTEM', message: 'SLA target met: 99.99% uptime maintained.' },
];

const GENERATE_LOG = () => {
  const levels = ['INFO', 'INFO', 'WARN', 'CRITICAL'];
  const sources = ['AI_ENGINE', 'FIREWALL', 'AUTOSCALER', 'IDS', 'SYSTEM', 'SELF_HEAL'];
  const messages = [
    // Security (70%)
    'Analyzing network packet anomalies...',
    'Detected potential brute force attack. Rate limiting applied.',
    'New vulnerability signature downloaded and applied.',
    'Blocked malicious payload in HTTP POST request.',
    'DDoS pattern matched. Blocking IP range.',
    'Bot traffic detected. Enforcing CAPTCHA.',
    'Unknown anomalous access pattern detected. Switching to Safe Mode.',
    // Automation (30%)
    'Scaling down idle resources in us-east-1.',
    'Memory usage spike in auth-service container.',
    'Database query latency increased by 15ms.',
    'Service crashed (OOM Error). Initiating self-healing restart.',
    'Predictive scaling: Pre-warming pods for expected traffic.',
    'SLA target met: 99.99% uptime maintained.'
  ];

  const level = levels[Math.floor(Math.random() * levels.length)];
  const source = sources[Math.floor(Math.random() * sources.length)];
  const message = messages[Math.floor(Math.random() * messages.length)];
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });

  return { time, level, source, message };
};

const INITIAL_CHART_DATA = Array.from({ length: 20 }).map((_, i) => ({
  time: `10:${Math.floor(i / 2).toString().padStart(2, '0')}:${(i % 2 * 30).toString().padStart(2, '0')}`,
  cpu: Math.floor(Math.random() * 40) + 20,
  network: Math.floor(Math.random() * 30) + 40,
  threats: Math.floor(Math.random() * 10),
}));

export function LogsAnalytics() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [chartData, setChartData] = useState(INITIAL_CHART_DATA);
  const [filter, setFilter] = useState('ALL');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Add new log at the BEGINNING of the array
      setLogs(prev => {
        const newLogs = [GENERATE_LOG(), ...prev];
        if (newLogs.length > 50) return newLogs.slice(0, 50);
        return newLogs;
      });

      // Update chart data
      setChartData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          cpu: Math.floor(Math.random() * 40) + 30,
          network: Math.floor(Math.random() * 30) + 50,
          threats: Math.floor(Math.random() * 15),
        }];
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Remove auto-scroll to bottom since new logs are at the top
  // useEffect(() => {
  //   if (logsEndRef.current) {
  //     logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [logs]);

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(log => log.level === filter);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Logs & Analytics</h2>
          <p className="text-sm text-white/50 mt-1">Real-time system telemetry and event streams</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
        {/* Analytics Graphs */}
        <div className="lg:col-span-3 flex flex-col gap-6 min-h-0">
          <div className="glass-panel rounded-2xl border border-white/10 p-5 flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-ai glow-blue" />
                <h3 className="font-semibold">System Telemetry</h3>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-ai glow-blue" /> Predictive Load (%)</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-intel glow-purple" /> Network (Mbps)</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-threat glow-red" /> Active Threats</div>
              </div>
            </div>
            
            <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickMargin={10} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(val) => `${val}%`} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(11, 15, 26, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                  <Area type="monotone" dataKey="network" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorNetwork)" />
                  <Area type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 h-32">
            <div className="glass-panel rounded-xl border border-white/10 p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-white/50 mb-2">
                <Cpu size={16} />
                <span className="text-xs uppercase tracking-wider">Avg Predictive Load</span>
              </div>
              <div className="text-2xl font-bold font-mono text-ai glow-blue">42.8%</div>
            </div>
            <div className="glass-panel rounded-xl border border-white/10 p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-white/50 mb-2">
                <Network size={16} />
                <span className="text-xs uppercase tracking-wider">Peak Traffic</span>
              </div>
              <div className="text-2xl font-bold font-mono text-intel glow-purple">845 Mbps</div>
            </div>
            <div className="glass-panel rounded-xl border border-white/10 p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-white/50 mb-2">
                <ShieldAlert size={16} />
                <span className="text-xs uppercase tracking-wider">Threats Blocked</span>
              </div>
              <div className="text-2xl font-bold font-mono text-threat glow-red">1,204</div>
            </div>
          </div>
        </div>

        {/* Real-time Terminal Logs */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 flex flex-col min-h-0 h-[500px] lg:h-auto lg:max-h-[calc(100vh-12rem)]">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-white/50 shrink-0" />
              <span className="text-sm font-semibold text-white/90 whitespace-nowrap">Live Event Stream</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 overflow-x-auto hide-scrollbar">
              {['ALL', 'INFO', 'WARN', 'CRITICAL'].map(level => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold tracking-wider transition-colors shrink-0",
                    filter === level ? "bg-white/20 text-white" : "text-white/40 hover:text-white/80"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 p-4 bg-[#0d1117] font-mono text-xs overflow-y-auto flex flex-col gap-2">
            {filteredLogs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 border-b border-white/5 pb-2 last:border-0"
              >
                <div className="flex items-center gap-2 sm:w-32 shrink-0">
                  <span className="text-white/30">[{log.time}]</span>
                  <span className={cn(
                    "font-bold",
                    log.level === 'INFO' ? "text-ai" :
                    log.level === 'WARN' ? "text-warning" :
                    "text-threat"
                  )}>
                    {log.level}
                  </span>
                </div>
                <span className="text-intel shrink-0 sm:w-28 truncate">[{log.source}]</span>
                <span className="text-white/70 break-words flex-1">{log.message}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
