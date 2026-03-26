import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  HardDrive, 
  Network, 
  AlertTriangle, 
  Zap, 
  Lock, 
  RefreshCcw, 
  Database,
  Search,
  CheckCircle,
  XCircle,
  Terminal,
  BarChart2,
  TrendingUp,
  Server,
  Code
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_V1 = "http://localhost:8000/api/v1";
const WS_V1 = "ws://localhost:8000/ws/v1/stream";

const App = () => {
  const [data, setData] = useState({
    security_status: "Active",
    threat_level: "Optimal",
    active_nodes: 5,
    cpu_usage: 0,
    memory_usage: 0,
    network_traffic: 140,
    blocked_ips: [],
    recent_actions: [],
    vulnerabilities_detected: 0,
    predicted_load: 0.0
  });

  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab ] = useState('dashboard');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    let ws;
    const connect = () => {
      ws = new WebSocket(WS_V1);
      ws.onmessage = (event) => {
        const update = JSON.parse(event.data);
        setData((prev) => {
          const newPoint = { 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
            traffic: update.network_traffic,
            cpu: update.cpu_usage,
            prediction: update.predicted_load
          };
          setHistory(prevHist => [...prevHist.slice(-25), newPoint]);
          return update;
        });
      };
      ws.onerror = () => setTimeout(connect, 3000);
    };
    connect();
    return () => ws && ws.close();
  }, []);

  const triggerEvent = async (type) => {
    try {
      await axios.post(`${API_V1}/simulate?event_type=${type}`);
    } catch (err) {
      console.error("Simulation Failure:", err);
    }
  };

  const runSecurityScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    const testCode = 'cursor.execute(f"SELECT * FROM accounts WHERE id = {input_id}")'; // SQL Injection Test
    try {
      const resp = await axios.post(`${API_V1}/scan`, { code: testCode });
      setIsScanning(false);
      setScanResult(resp.data);
    } catch (err) {
      setIsScanning(false);
    }
  };

  const getStatusStyle = (level) => {
    switch (level) {
      case "Critical": return "bg-red-500/20 text-red-500 border-red-500/30";
      case "Responding": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Mitigated": return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      default: return "bg-green-500/20 text-green-500 border-green-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white p-6 lg:p-12 font-['Inter',sans-serif]">
      {/* Top Professional Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl shadow-blue-500/20 border border-white/5">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-1">NEUROOPS <span className="text-blue-500">PRO</span></h1>
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold tracking-widest uppercase">Autonomous IT Kernel v2.1</span>
              <div className="flex items-center gap-1.5 font-bold text-[10px] text-green-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                SYSTEM OPERATIONAL
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex p-1 bg-white/5 rounded-xl border border-white/10 self-start md:self-center">
          {['dashboard', 'security', 'infrastructure'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === t ? 'bg-blue-600 shadow-lg text-white' : 'text-gray-500 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </nav>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Global Telemetry Card */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricBox label="Runtime Health" value={data.security_status} sub="Threat: Low" status={data.security_status} icon={<Activity />} />
              <MetricBox label="Predictive Load" value={`${Math.round(data.predicted_load)}%`} sub="AIOps Forecast" icon={<TrendingUp />} />
              <MetricBox label="Active Compute" value={data.active_nodes} sub="Elastic Nodes" icon={<Server />} />
              <MetricBox label="Security Gate" value={data.vulnerabilities_detected} sub="Neutralized" icon={<Lock />} />

              {/* Advanced Monitoring Chart */}
              <div className="md:col-span-4 bg-white/[0.03] border border-white/5 p-8 rounded-[32px] min-h-[440px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-bold">Low-Latency Traffic Analysis</h2>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Incoming</span>
                    <span className="flex items-center gap-1 ml-4"><span className="w-2 h-2 bg-indigo-500/30 rounded-full"></span> Simulated Buffer</span>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="5 5" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="time" stroke="#ffffff10" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                      <YAxis stroke="#ffffff10" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip content={CustomTooltip} cursor={{ stroke: '#ffffff10' }} />
                      <Area type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#primaryGrad)" animationDuration={500} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Side-panel Resources */}
            <div className="space-y-6">
              <ResourcePanel label="CPU Core Cluster" value={data.cpu_usage} color="#3b82f6" />
              <ResourcePanel label="Memory Fabric" value={data.memory_usage} color="#8b5cf6" />
              <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl h-[260px] flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-black tracking-[0.2em] text-gray-600 uppercase mb-4">SLA Maintenance Confidence</span>
                  <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="60" className="stroke-white/5 fill-transparent" strokeWidth="6" />
                          <motion.circle cx="64" cy="64" r="60" className="stroke-green-500 fill-transparent" strokeWidth="6" strokeLinecap="round" initial={{ strokeDasharray: "377 377", strokeDashoffset: 377 }} animate={{ strokeDashoffset: 377 - (377 * 0.99) }} transition={{ duration: 2 }} />
                      </svg>
                      <span className="text-3xl font-black">99<span className="text-sm">.9</span></span>
                  </div>
                  <p className="text-[10px] text-green-500/70 font-bold uppercase tracking-widest">Enterprise Ready</p>
              </div>
            </div>

            {/* Persistent Event Log (Database Backed) */}
            <div className="lg:col-span-4 bg-[#101014] border border-white/5 rounded-[40px] p-8 min-h-[380px] flex flex-col">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Terminal className="text-gray-500" />
                  <h2 className="text-xl font-bold tracking-tight">Persistent Action Ledger <span className="text-gray-700 font-medium ml-2 font-mono text-sm">(DB: neuroops.db)</span></h2>
                </div>
                <div className="text-[9px] text-gray-700 font-mono tracking-widest uppercase">Transaction monitoring active</div>
              </div>
              <div className="overflow-y-auto max-h-[400px] pr-4 space-y-4 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {data.recent_actions.map((ev, i) => (
                    <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border ${ev.type === 'defense' ? 'border-red-500/10' : 'border-white/5'} hover:bg-white/[0.04] transition-all`}>
                      <div className={`p-3 rounded-xl mt-1 ${ev.type === 'defense' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                        {ev.type === 'defense' ? <ShieldAlert className="w-5 h-5" /> : <RefreshCcw className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${ev.type === 'defense' ? 'text-red-500' : 'text-blue-500'}`}>{ev.type} TRANSACTION</span>
                          <span className="text-[10px] text-gray-600 font-mono">{ev.time}</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed opacity-90">{ev.action}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {data.recent_actions.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-20 opacity-20 italic">No events recorded in persistent layer.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Lab Tab */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[40px]">
              <div className="flex items-center gap-4 mb-8">
                <Code className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-black">AI Static Intelligence</h2>
              </div>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">Neural-scanning of deployment packets to eliminate vulnerabilities before zero-day exposure. Persistent gate integration enabled.</p>
              
              <div className="bg-black/50 p-6 rounded-2xl font-mono text-[11px] mb-8 border border-white/5 text-gray-400 group relative">
                  <div className="absolute top-4 right-6 text-[9px] font-black text-blue-500/50 uppercase tracking-[0.2em]">Repository Hook</div>
                  <span className="text-gray-800 line-through">PASS OK</span><br/>
                  <span className="text-blue-500">payload</span> = request.get_json()<br/>
                  <span className="text-indigo-400"># EXPLOITATION VECTOR DETECTED BELOW</span><br/>
                  <span className="text-blue-500">query</span> = f<span className="text-yellow-500">"INSERT INTO logs (data) VALUES ('&#123;payload['raw']&#125;')"</span>
              </div>

              <button 
                  onClick={runSecurityScan} 
                  disabled={isScanning}
                  className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 hover:bg-blue-500 hover:scale-[1.01] transition-all disabled:opacity-50"
              >
                  {isScanning ? 'EXECUTING NEURAL SCAN...' : 'EXECUTE PRODUCTION SECURITY GATE'}
              </button>

              <AnimatePresence>
                {scanResult && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className={`mt-8 p-6 rounded-2xl flex items-center gap-5 ${scanResult.status === 'blocked' ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10'}`}>
                    {scanResult.status === 'blocked' ? <XCircle className="w-8 h-8 text-red-500" /> : <CheckCircle className="w-8 h-8 text-green-500" />}
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-tight">{scanResult.status === 'blocked' ? 'Deployment Terminated' : 'Verified Secure'}</h4>
                        <p className="text-xs opacity-70 mt-1">{scanResult.findings ? scanResult.findings[0] : scanResult.msg}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[40px]">
              <div className="flex items-center gap-4 mb-8">
                <Zap className="w-8 h-8 text-red-500" />
                <h2 className="text-2xl font-black">Autonomous Response Tests</h2>
              </div>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">Simulate enterprise-scale threats to validate NEUROOPS real-time autonomous mitigation logic.</p>
              <div className="space-y-4">
                <SimAction title="L7 DDoS Flood" desc="Launch 5,000 requests/sec distributed attack." color="red" onClick={() => triggerEvent('ddos')} />
                <SimAction title="Predictive Scaling" desc="AIOps Forecast: Traffic surge in 60 seconds." color="blue" onClick={() => triggerEvent('scale')} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Infrastructure Tab */}
        {activeTab === 'infrastructure' && (
            <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[48px]">
                    <div className="flex items-center gap-4 mb-10">
                        <Database className="w-8 h-8 text-green-500" />
                        <h2 className="text-2xl font-black tracking-tight">Elastic Cloud Fabric</h2>
                    </div>
                    <div className="flex items-center gap-12 mb-12">
                        <div className="text-center p-8 bg-green-500/5 border border-green-500/10 rounded-[32px] flex-1">
                            <span className="block text-4xl font-black mb-1">{data.active_nodes}</span>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Active Compute Nodes</span>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center text-[11px] font-bold">
                                <span className="text-gray-500 uppercase">Fabric Efficiency</span>
                                <span className="text-blue-500">Healthy</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <motion.div animate={{ width: '88%' }} className="bg-blue-500 h-full"></motion.div>
                            </div>
                            <p className="text-[10px] text-gray-600 italic">Load-balancing distributed via Layer 4 ingress controller.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[48px]">
                    <div className="flex items-center gap-4 mb-8">
                        <Lock className="w-8 h-8 text-red-500" />
                        <h2 className="text-2xl font-black tracking-tight">Active Edge Firewall Blocks</h2>
                    </div>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar">
                        {data.blocked_ips.map((ip, i) => (
                            <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between">
                                <span className="text-sm font-mono font-bold text-red-400">{ip}</span>
                                <span className="text-[9px] px-3 py-1 bg-red-500 text-white font-black uppercase rounded-lg">Permanent Blacklist</span>
                            </motion.div>
                        ))}
                        {data.blocked_ips.length === 0 && (
                            <div className="py-16 text-center opacity-30 text-xs italic tracking-widest uppercase font-black">Clean Network State Detected</div>
                        )}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-700">
        <span className="text-[10px] font-black uppercase tracking-[0.5em]">NEUROOPS AI INFRASTRUCTURE v2.1.0-PRO</span>
        <span className="text-[10px] font-bold">© 2026 TEAM AKATSUKI - MISSION CRITICAL IT</span>
      </footer>
    </div>
  );
};

const MetricBox = ({ label, value, sub, icon, status }) => (
  <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[28px] hover:bg-white/[0.05] transition-all group">
    <div className="flex items-center gap-3 mb-4">
       <div className="p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 18, className: status === 'Critical' ? 'text-red-500' : 'text-blue-500' })}
       </div>
       <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">{label}</span>
    </div>
    <div className="flex items-baseline gap-2 mb-1">
        <h4 className={`text-2xl font-black ${status === 'Critical' ? 'text-red-500' : 'text-white'}`}>{value}</h4>
    </div>
    <p className="text-[10px] font-bold text-gray-700 tracking-tighter">{sub}</p>
  </div>
);

const ResourcePanel = ({ label, value, color }) => (
  <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[28px]">
    <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">{label}</span>
        <span className="text-xs font-black" style={{ color }}>{value}%</span>
    </div>
    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
        <motion.div animate={{ width: `${value}%` }} className="h-full" style={{ backgroundColor: color }} />
    </div>
  </div>
);

const SimAction = ({ title, desc, color, onClick }) => (
  <button onClick={onClick} className={`w-full p-6 text-left border rounded-3xl transition-all flex items-center gap-6 group ${color === 'red' ? 'bg-red-500/5 border-red-500/10 hover:bg-red-500/10' : 'bg-blue-500/5 border-blue-500/10 hover:bg-blue-500/10'}`}>
     <div className={`p-4 rounded-2xl ${color === 'red' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'} group-hover:scale-110 transition-transform`}>
        {color === 'red' ? <Activity size={24} /> : <TrendingUp size={24} />}
     </div>
     <div>
        <h5 className="font-black text-lg mb-1">{title}</h5>
        <p className="text-xs text-gray-600 font-medium line-clamp-1">{desc}</p>
     </div>
  </button>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] p-3 border border-white/10 rounded-xl shadow-2xl">
        <p className="text-[10px] font-black text-blue-500 uppercase mb-1">{payload[0].payload.time}</p>
        <p className="text-xl font-black">{payload[0].value} <span className="text-[10px] text-gray-500 font-bold uppercase">Requests/s</span></p>
      </div>
    );
  }
  return null;
};

export default App;
