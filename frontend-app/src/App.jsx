import React, { useState, useEffect } from 'react';
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
  BarChart2
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

const BACKEND_URL = "http://localhost:8000";
const WS_URL = "ws://localhost:8000/ws/monitor";

const App = () => {
  const [data, setData] = useState({
    security_status: "Healthy",
    threat_level: "Low",
    active_nodes: 5,
    cpu_usage: 12,
    memory_usage: 18,
    network_traffic: 85,
    blocked_ips: [],
    recent_actions: [],
    vulnerabilities_detected: 0
  });

  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab ] = useState('dashboard');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState(null);

  useEffect(() => {
    let ws;
    const connect = () => {
      ws = new WebSocket(WS_URL);
      ws.onmessage = (event) => {
        const update = JSON.parse(event.data);
        setData((prev) => {
          const newHistoryPoint = { 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
            traffic: update.network_traffic,
            cpu: update.cpu_usage
          };
          setHistory(prevHist => [...prevHist.slice(-20), newHistoryPoint]);
          return update;
        });
      };
      ws.onerror = () => setTimeout(connect, 3000);
    };
    connect();
    return () => ws && ws.close();
  }, []);

  const simulateAttack = async (type) => {
    try {
      await axios.post(`${BACKEND_URL}/simulate/attack?attack_type=${type}`);
    } catch (err) {
      console.error("Failed to simulate attack:", err);
    }
  };

  const simulateDeploy = () => {
    setIsDeploying(true);
    setDeployResult(null);
    setTimeout(() => {
      const hasVulnerability = Math.random() > 0.4;
      setIsDeploying(false);
      if (hasVulnerability) {
        setDeployResult({
          status: 'blocked',
          msg: 'BLOCKED: Insecure code push detected.',
          details: 'Potential credentials leak in auth_helper.py:L12. Action: Deployment Blocked.'
        });
      } else {
        setDeployResult({
          status: 'success',
          msg: 'SECURE: Deployment Successful',
          details: 'Code analyzed against 52 DevSecOps rules. Zero vulnerabilities found.'
        });
      }
    }, 1800);
  };

  const getStatusColor = (level) => {
    if (level === "Critical") return "#ff5252";
    if (level === "High") return "#ff8c52";
    if (level === "Mitigated") return "#52deff";
    return "#52ff9d";
  };

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans bg-[#0a0a0c] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between mb-10 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">NEUROOPS <span className="text-blue-400">AI</span></h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Digital Immune System</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['dashboard', 'security', 'ops'].map((tab) => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${activeTab === tab ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'hover:bg-white/10 text-gray-400'}`}
            >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard title="System Health" value={data.security_status} icon={<ShieldCheck className="text-green-400" />} />
            <MetricCard title="Threat Level" value={data.threat_level} icon={<ShieldAlert style={{color: getStatusColor(data.threat_level)}} />} />
            <MetricCard title="Action Nodes" value={data.active_nodes} icon={<Zap className="text-yellow-400" />} />
            <MetricCard title="Security Score" value="98.5%" icon={<Lock className="text-purple-400" />} />

            <div className="md:col-span-3 bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" /> Real-time Anomaly Tracking
              </h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#111', border: 'none', borderRadius: '12px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" animationDuration={400} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-300"><BarChart2 className="w-5 h-5" /> Resource Load</h3>
              <ResourceGauge label="CPU LOAD" value={data.cpu_usage} color="#3b82f6" />
              <ResourceGauge label="MEMORY" value={data.memory_usage} color="#a855f7" />
              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-gray-500 tracking-tighter uppercase">Predictive SLA Assurance:</span>
                  <span className="text-[10px] text-green-400 font-bold">OPTIMAL</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '99%' }} className="bg-green-400 h-full"></motion.div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-[#112] border border-white/5 p-6 rounded-2xl min-h-[300px] flex flex-col">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Terminal className="w-5 h-5 text-gray-500" /> Explainable AI Action Log</h3>
              <div className="overflow-y-auto pr-2 space-y-3 flex-1">
                <AnimatePresence initial={false}>
                  {data.recent_actions.map((act, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ scale: 0.95, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }} 
                      className={`p-4 rounded-xl flex items-start gap-4 ${act.type === 'defense' ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/5 border border-green-500/10'}`}
                    >
                      <div className={`p-2 rounded-lg ${act.type === 'defense' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                        {act.type === 'defense' ? <ShieldAlert className="w-4 h-4 text-red-400" /> : <RefreshCcw className="w-4 h-4 text-green-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{act.action}</p>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{act.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {data.recent_actions.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-20 opacity-20">
                        <Activity className="w-12 h-12 mb-4" />
                        <p className="text-center font-bold">ALL SYSTEMS NOMINAL. MONITORING FLOWS...</p>
                    </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Lab */}
        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3"><ShieldCheck className="text-blue-400" /> DevSecOps Sentinel</h2>
              <p className="text-sm text-gray-400 mb-8 italic">Autonomous code analysis & deployment gating.</p>
              
              <div className="bg-black/40 p-6 rounded-2xl font-mono text-[11px] mb-8 border border-white/5 text-gray-400 relative">
                  <div className="absolute top-4 right-4 text-[10px] font-bold text-blue-500 uppercase">Input Payload</div>
                  <span className="text-gray-600 font-bold line-through">PASS</span><br/>
                  <span className="text-blue-400">user_data</span> = request.get_json()<br/>
                  <span className="text-pink-400"># TODO: Fix unsafe binding</span><br/>
                  <span className="text-blue-400">cursor</span>.execute(<span className="text-yellow-500">f"SELECT * FROM accounts WHERE user='&#123;user_data['name']&#125;'"</span>)
              </div>

              <button 
                  onClick={simulateDeploy} 
                  disabled={isDeploying}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                  {isDeploying ? 'AI ANALYSIS IN PROGRESS...' : 'START SECURE DEPLOYMENT'}
              </button>

              <AnimatePresence>
              {deployResult && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className={`mt-8 p-4 rounded-xl flex items-center gap-4 ${deployResult.status === 'success' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                      {deployResult.status === 'success' ? <CheckCircle className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
                      <div>
                          <p className="font-bold text-sm tracking-tight">{deployResult.msg}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{deployResult.details}</p>
                      </div>
                  </motion.div>
              )}
              </AnimatePresence>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-red-400"><Zap /> Simulation Control</h2>
              <p className="text-sm text-gray-400 mb-8 italic">Trigger real-world threats to test autonomous mitigation.</p>
              <div className="space-y-4">
                  <SimButton label="L7 DDoS Attack" color="red" icon={<Activity />} onClick={() => simulateAttack('ddos')} />
                  <SimButton label="Admin Brute Force" color="orange" icon={<Lock />} onClick={() => simulateAttack('brute_force')} />
                  <SimButton label="SQL Map Scanning" color="purple" icon={<Search />} onClick={() => simulateAttack('anomaly')} />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ops' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><RefreshCcw className="text-green-400" /> Autonomous IT Laboratory</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <p className="text-sm text-gray-400 mb-6">Simulation: Crash a critical service to witness the self-healing engine in action.</p>
                            <button 
                                onClick={() => simulateAttack('db_crash')}
                                className="w-full py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all uppercase text-xs tracking-widest"
                            >
                                Force Node-01 Failure
                            </button>
                        </div>
                        <div className="bg-black/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-gray-500 uppercase font-black mb-2 tracking-widest">SLA Health</span>
                            <span className="text-5xl font-black text-green-400 mb-2">99.99</span>
                            <span className="text-[10px] text-gray-600">PREDICTIVE STABILITY RATING</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">NEUROOPS - Built for Hackathon Excellence - Team Akatsuki</p>
      </footer>
    </div>
  );
};

const MetricCard = ({ title, value, icon }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-white/5">{icon}</div>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{title}</p>
    </div>
    <p className="text-2xl font-bold tracking-tight">{value}</p>
  </div>
);

const ResourceGauge = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-[10px] font-black text-gray-500 tracking-wider uppercase">{label}</span>
      <span className="text-[10px] font-bold" style={{color}}>{value}%</span>
    </div>
    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
      <motion.div animate={{ width: `${value}%` }} className="h-full" style={{ backgroundColor: color }} />
    </div>
  </div>
);

const SimButton = ({ label, color, icon, onClick }) => (
    <button onClick={onClick} className="w-full p-4 flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-left group transition-all">
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>{icon}</div>
        <div className="flex-1">
            <h4 className="font-bold text-sm tracking-tight">{label}</h4>
            <p className="text-[10px] text-gray-500">Trigger simulated {label.toLowerCase()}</p>
        </div>
        <Zap className="w-4 h-4 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
);

export default App;
