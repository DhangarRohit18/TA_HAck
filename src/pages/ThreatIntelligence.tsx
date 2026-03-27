import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, BrainCircuit, Activity, Lock, RefreshCw, Shield } from 'lucide-react';
import { ThreatMap } from '../components/ThreatMap';

const THREATS = [
  { id: 1, type: 'DDoS', source: 'Multiple IPs (RU, CN)', target: 'API Gateway', status: 'Blocked', action: 'Block IP + Scale', time: 'Just now' },
  { id: 2, type: 'Bot', source: '192.168.1.45', target: 'Login Endpoint', status: 'Mitigated', action: 'CAPTCHA Challenge', time: '2m ago' },
  { id: 3, type: 'Brute force', source: '10.0.0.12', target: 'Admin Panel', status: 'Blocked', action: 'Lock Account', time: '5m ago' },
  { id: 4, type: 'Malware', source: 'Payload Upload', target: 'Storage Bucket', status: 'Quarantined', action: 'Isolate Container', time: '12m ago' },
];

export function ThreatIntelligence() {
  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Runtime Cyber Defense</h2>
        <p className="text-sm text-white/50 mt-1">Real-time threat detection and autonomous mitigation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Map - Takes up 2 columns */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-threat glow-red" />
              <span className="text-sm font-semibold text-white/90">Global Threat Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-threat animate-pulse" />
              <span className="text-xs font-mono text-threat">LIVE</span>
            </div>
          </div>
          <div className="flex-1 p-4">
            <ThreatMap />
          </div>
        </div>

        {/* Attack Classification & Actions */}
        <div className="glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <BrainCircuit size={16} className="text-intel glow-purple" />
            <span className="text-sm font-semibold text-white/90">AI Attack Classification</span>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {THREATS.map((threat, idx) => (
              <motion.div 
                key={threat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-threat/20 text-threat text-xs font-bold border border-threat/30">
                      {threat.type}
                    </span>
                    <span className="text-xs text-white/40">{threat.time}</span>
                  </div>
                  <span className="text-xs font-mono text-secure">{threat.status}</span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Source:</span>
                    <span className="text-white font-mono text-xs">{threat.source}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Target:</span>
                    <span className="text-white font-mono text-xs">{threat.target}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                  <div className="p-1.5 rounded bg-ai/20 text-ai">
                    {threat.type === 'DDoS' ? <RefreshCw size={14} /> : 
                     threat.type === 'Bot' ? <Shield size={14} /> : <Lock size={14} />}
                  </div>
                  <span className="text-sm font-medium text-ai">{threat.action}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
