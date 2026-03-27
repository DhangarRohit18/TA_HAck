import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, TrendingUp, ShieldCheck, Target, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

const LEARNING_DATA = [
  { epoch: 1, accuracy: 78, loss: 0.4 },
  { epoch: 2, accuracy: 82, loss: 0.3 },
  { epoch: 3, accuracy: 85, loss: 0.25 },
  { epoch: 4, accuracy: 89, loss: 0.18 },
  { epoch: 5, accuracy: 92, loss: 0.12 },
  { epoch: 6, accuracy: 94, loss: 0.08 },
  { epoch: 7, accuracy: 96, loss: 0.05 },
];

export function AIIntelligence() {
  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Intelligence Panel</h2>
        <p className="text-sm text-white/50 mt-1">Continuous learning and model confidence metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Model Confidence" 
          value="94.2%" 
          trend="+2.1%" 
          icon={Target} 
          color="ai" 
        />
        <MetricCard 
          title="Accuracy Improvement" 
          value="+12%" 
          trend="Last 30 days" 
          icon={TrendingUp} 
          color="secure" 
        />
        <MetricCard 
          title="Patterns Learned" 
          value="1,402" 
          trend="+42 new" 
          icon={BrainCircuit} 
          color="intel" 
        />
        <MetricCard 
          title="False Positives" 
          value="0.01%" 
          trend="-0.05%" 
          icon={ShieldCheck} 
          color="warning" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Learning Curve Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit size={16} className="text-intel glow-purple" />
              <span className="text-sm font-semibold text-white/90">Model Training Progress</span>
            </div>
            <span className="text-xs font-mono text-intel bg-intel/10 px-2 py-1 rounded-md border border-intel/20">
              EPOCH 7/10
            </span>
          </div>
          
          <div className="p-6 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LEARNING_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="epoch" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} domain={[60, 100]} />
                <YAxis yAxisId="right" orientation="right" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121826', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#8B5CF6' }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="loss" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explainability UI */}
        <div className="glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <Zap size={16} className="text-ai glow-blue" />
            <span className="text-sm font-semibold text-white/90">Explainable AI (XAI)</span>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <ExplainCard 
              action="Blocked IP 192.168.1.10"
              reason="Anomaly score = 0.91"
              pattern="Matched DDoS pattern (Syn Flood)"
              confidence={94}
              color="secure"
            />
            <ExplainCard 
              action="Scaled pods 2 → 6"
              reason="Traffic velocity > 500 req/s"
              pattern="Predictive load balancing model"
              confidence={98}
              color="ai"
            />
            <ExplainCard 
              action="Quarantined Container"
              reason="Unauthorized file modification"
              pattern="Zero-day malware signature"
              confidence={89}
              color="warning"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon, color }: any) {
  const colorMap: any = {
    ai: 'text-ai bg-ai/10 border-ai/30',
    secure: 'text-secure bg-secure/10 border-secure/30',
    intel: 'text-intel bg-intel/10 border-intel/30',
    warning: 'text-warning bg-warning/10 border-warning/30',
  };

  const textMap: any = {
    ai: 'text-ai text-glow-blue',
    secure: 'text-secure text-glow-green',
    intel: 'text-intel text-glow-purple',
    warning: 'text-warning text-glow-yellow',
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-white/20 transition-colors">
      <div>
        <h3 className="text-sm font-medium text-white/60 mb-1">{title}</h3>
        <div className="flex items-end gap-2">
          <p className={cn("text-3xl font-mono font-bold tracking-tight", textMap[color])}>{value}</p>
          <span className="text-xs font-mono text-white/40 mb-1">{trend}</span>
        </div>
      </div>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", colorMap[color])}>
        <Icon size={24} className={textMap[color].split(' ')[0]} />
      </div>
    </div>
  );
}

function ExplainCard({ action, reason, pattern, confidence, color }: any) {
  const colorMap: any = {
    ai: 'bg-ai',
    secure: 'bg-secure',
    warning: 'bg-warning',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
    >
      <h4 className="text-sm font-bold text-white mb-2">{action}</h4>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-white/50">Reason:</span>
          <span className="text-white font-mono">{reason}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/50">Pattern:</span>
          <span className="text-white font-mono">{pattern}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-white/10">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-white/50">AI Confidence</span>
          <span className="text-white font-mono">{confidence}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={cn("h-full", colorMap[color])}
          />
        </div>
      </div>
    </motion.div>
  );
}
