import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldAlert, Cpu, Network, Database, Server, BrainCircuit, CheckCircle2, Loader2, Lock, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

const generateData = (length: number, min: number, max: number) => 
  Array.from({ length }, () => ({ value: Math.floor(Math.random() * (max - min + 1)) + min }));

const AI_MODELS = ['Neuro-Sec-Ops', 'AutoScaler-V4', 'Threat-Intel-X', 'WAF-Auto-Tuner', 'Zero-Trust-Engine'];
const EVENTS = [
  // Security (70%)
  { type: 'threat', event: 'DDoS-like traffic detected (400% request rate increase)', resolution: 'Rate limited, scaled edge nodes, and blocked attacking IPs', icon: ShieldAlert, color: 'text-threat', bg: 'bg-threat/10', border: 'border-threat/20' },
  { type: 'threat', event: 'Brute-force login attempt on admin account', resolution: 'Account locked temporarily. IP blacklisted.', icon: Lock, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  { type: 'threat', event: 'Coordinated bot traffic targeting checkout API', resolution: 'Injected CAPTCHA challenge. Malicious bots blocked.', icon: ShieldAlert, color: 'text-threat', bg: 'bg-threat/10', border: 'border-threat/20' },
  { type: 'threat', event: 'Unknown anomalous access pattern detected', resolution: 'Switched affected microservice to Safe Mode. Alerted SecOps.', icon: BrainCircuit, color: 'text-intel', bg: 'bg-intel/10', border: 'border-intel/20' },
  { type: 'vuln', event: 'Suspicious SQLi payload in /api/login', resolution: 'Payload blocked. IP blacklisted globally', icon: Lock, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  
  // IT Automation (30%)
  { type: 'heal', event: 'Payment service crashed (OOM Error)', resolution: 'Self-Healing triggered: Restarted service and reallocated memory.', icon: Activity, color: 'text-ai', bg: 'bg-ai/10', border: 'border-ai/20' },
  { type: 'scale', event: 'Predictive AIOps: Expected traffic surge in 5 mins', resolution: 'Auto-scaled frontend pods (4 → 12). SLA assured.', icon: Zap, color: 'text-secure', bg: 'bg-secure/10', border: 'border-secure/20' },
  { type: 'learn', event: 'New attack signature identified', resolution: 'Self-Learning: Updated global defense models and retrained neural net.', icon: Database, color: 'text-intel', bg: 'bg-intel/10', border: 'border-intel/20' }
];

export function Dashboard() {
  const [stats, setStats] = useState({
    cpu: { value: 42, data: generateData(10, 30, 60) },
    threats: { value: 12, data: generateData(10, 5, 20) },
    requests: { value: 14.2, data: generateData(10, 10, 20) },
    sla: { value: 99.99, data: generateData(10, 99.9, 100) },
    blocked: { value: 8492, data: generateData(10, 8000, 9000) },
    vulns: { value: 3, data: generateData(10, 0, 5) },
  });

  const [activities, setActivities] = useState<any[]>([]);
  const [aiEnabled, setAiEnabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!aiEnabled) return; // Pause stats updates when AI is disabled
      
      setStats(prev => {
        const newCpu = Math.max(10, Math.min(95, prev.cpu.value + (Math.random() * 10 - 5)));
        const newThreats = Math.max(0, prev.threats.value + Math.floor(Math.random() * 5 - 2));
        const newRequests = Math.max(5, prev.requests.value + (Math.random() * 2 - 1));
        const newBlocked = prev.blocked.value + Math.floor(Math.random() * 10);
        const newVulns = Math.max(0, prev.vulns.value + (Math.random() > 0.9 ? 1 : Math.random() > 0.8 ? -1 : 0));

        return {
          cpu: { value: newCpu, data: [...prev.cpu.data.slice(1), { value: newCpu }] },
          threats: { value: newThreats, data: [...prev.threats.data.slice(1), { value: newThreats }] },
          requests: { value: newRequests, data: [...prev.requests.data.slice(1), { value: newRequests }] },
          sla: prev.sla, // Keep SLA mostly stable
          blocked: { value: newBlocked, data: [...prev.blocked.data.slice(1), { value: newBlocked }] },
          vulns: { value: newVulns, data: [...prev.vulns.data.slice(1), { value: newVulns }] },
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [aiEnabled]);

  useEffect(() => {
    const createActivity = (resolved = false) => {
      const template = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      return {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        model: AI_MODELS[Math.floor(Math.random() * AI_MODELS.length)],
        ...template,
        status: resolved ? 'resolved' : 'processing'
      };
    };

    // Initial load
    setActivities(Array.from({ length: 5 }).map(() => createActivity(true)));

    const interval = setInterval(() => {
      if (!aiEnabled) return; // Pause generating new activities if AI is disabled
      
      const newActivity = createActivity(false);
      setActivities(prev => [newActivity, ...prev].slice(0, 15));

      // Simulate fixing process
      setTimeout(() => {
        setActivities(current => 
          current.map(act => act.id === newActivity.id ? { ...act, status: 'resolved' } : act)
        );
      }, 2500);

    }, 4000);

    return () => clearInterval(interval);
  }, [aiEnabled]);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="Predictive Load" 
          value={`${stats.cpu.value.toFixed(1)}%`} 
          trend={stats.cpu.value > 50 ? "+2.4%" : "-1.2%"} 
          color="ai" 
          data={stats.cpu.data} 
          delay={0.1} 
        />
        <StatCard 
          title="Threats Neutralized" 
          value={stats.blocked.value.toLocaleString()} 
          trend={`+${Math.floor(Math.random() * 50)}/hr`} 
          color="threat" 
          data={stats.blocked.data} 
          delay={0.2} 
        />
        <StatCard 
          title="Auto-Scaled Nodes" 
          value={`${stats.requests.value.toFixed(1)}k`} 
          trend="+1.2k" 
          color="intel" 
          data={stats.requests.data} 
          delay={0.3} 
        />
        <StatCard 
          title="SLA Assurance" 
          value="99.99%" 
          trend="Stable" 
          color="secure" 
          data={stats.sla.data} 
          delay={0.4} 
        />
        <StatCard 
          title="Self-Healing Actions" 
          value={stats.threats.value} 
          trend={stats.threats.value > 10 ? "+3" : "-1"} 
          color="ai" 
          data={stats.threats.data} 
          delay={0.5} 
        />
        <StatCard 
          title="Model Accuracy" 
          value="99.8%" 
          trend="Learning" 
          color="warning" 
          data={stats.vulns.data} 
          delay={0.6} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[500px]">
        {/* Center AI Operations (Replaced Threat Map) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-12 xl:col-span-12 flex flex-col h-full glass-panel rounded-2xl border border-white/10 p-5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-ai/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-ai animate-pulse glow-blue" size={20} />
              <h2 className="text-lg font-semibold tracking-wide uppercase text-white/90">Live AI Operations & Mitigation</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                <span className={cn("w-2 h-2 rounded-full", aiEnabled ? "bg-ai glow-blue" : "bg-white/20")} /> 
                Models Active: {aiEnabled ? 5 : 0}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className={cn("w-2 h-2 rounded-full animate-pulse", aiEnabled ? "bg-secure glow-green" : "bg-warning glow-yellow")} /> 
                <span className={aiEnabled ? "text-secure" : "text-warning"}>
                  {aiEnabled ? "AUTONOMOUS MODE" : "MANUAL MODE"}
                </span>
              </div>
              
              {/* AI Toggle Switch */}
              <div className="ml-4 flex items-center gap-2 border-l border-white/10 pl-4">
                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">AI Engine</span>
                <button 
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    aiEnabled ? "bg-ai" : "bg-white/10"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      aiEnabled ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative z-10 rounded-xl overflow-hidden border border-white/5 bg-black/40 flex flex-col">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-3 border-b border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-wider bg-white/5">
              <div className="col-span-2">Time / Model</div>
              <div className="col-span-5">Detected Event</div>
              <div className="col-span-5">AI Resolution Status</div>
            </div>
            
            {/* Activities List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              <AnimatePresence initial={false}>
                {activities.map((activity) => {
                  const Icon = activity.icon;
                  const isProcessing = activity.status === 'processing';
                  
                  return (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "grid grid-cols-12 gap-4 p-3 rounded-lg border transition-colors items-center",
                        isProcessing ? "bg-white/5 border-white/10" : "bg-black/40 border-white/5 hover:bg-white/5"
                      )}
                    >
                      <div className="col-span-2 flex flex-col gap-1">
                        <span className="text-xs font-mono text-white/50">{activity.timestamp}</span>
                        <span className="text-[10px] font-medium text-ai bg-ai/10 px-1.5 py-0.5 rounded w-fit border border-ai/20 truncate max-w-full">
                          {activity.model}
                        </span>
                      </div>
                      
                      <div className="col-span-5 flex items-start gap-3">
                        <div className={cn("p-1.5 rounded-md shrink-0 mt-0.5", activity.bg, activity.border, "border")}>
                          <Icon size={14} className={activity.color} />
                        </div>
                        <span className="text-sm text-white/80 leading-snug">{activity.event}</span>
                      </div>
                      
                      <div className="col-span-5 flex items-center gap-3">
                        {isProcessing ? (
                          <div className="flex items-center gap-2 text-warning bg-warning/10 border border-warning/20 px-3 py-1.5 rounded-lg w-full">
                            <Loader2 size={14} className="animate-spin shrink-0" />
                            <span className="text-xs font-medium">Analyzing & Mitigating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-secure bg-secure/10 border border-secure/20 px-3 py-1.5 rounded-lg w-full">
                            <CheckCircle2 size={14} className="shrink-0 glow-green" />
                            <span className="text-xs font-medium truncate">{activity.resolution}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Quick Status Bar below list */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 relative z-10">
            <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3 hover:border-white/20 transition-colors cursor-default">
              <div className="p-2 rounded-lg bg-secure/10 border border-secure/20">
                <Server className="text-secure" size={16} />
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Primary Cluster</div>
                <div className="text-xs font-mono text-secure">OPERATIONAL</div>
              </div>
            </div>
            <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3 hover:border-white/20 transition-colors cursor-default">
              <div className="p-2 rounded-lg bg-intel/10 border border-intel/20">
                <Database className="text-intel" size={16} />
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Data Sync</div>
                <div className="text-xs font-mono text-intel">98.4% SYNCED</div>
              </div>
            </div>
            <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3 hover:border-white/20 transition-colors cursor-default">
              <div className="p-2 rounded-lg bg-warning/10 border border-warning/20">
                <Network className="text-warning" size={16} />
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Edge Routing</div>
                <div className="text-xs font-mono text-warning">HIGH LOAD</div>
              </div>
            </div>
            <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-3 hover:border-white/20 transition-colors cursor-default">
              <div className="p-2 rounded-lg bg-threat/10 border border-threat/20">
                <ShieldAlert className="text-threat" size={16} />
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Auto-Mitigation</div>
                <div className="text-xs font-mono text-threat animate-pulse">ACTIVE</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
