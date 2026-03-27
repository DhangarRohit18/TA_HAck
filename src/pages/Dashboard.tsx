import React from 'react';
import { StatCard } from '../components/StatCard';
import { ThreatMap } from '../components/ThreatMap';
import { AIDecisions } from '../components/AIDecisions';
import { AlertsFeed } from '../components/AlertsFeed';
import { motion } from 'motion/react';

const MOCK_DATA = [
  { value: 40 }, { value: 30 }, { value: 60 }, { value: 45 }, { value: 80 }, { value: 65 }, { value: 90 }
];

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="CPU Usage" 
          value="42%" 
          trend="-5%" 
          color="ai" 
          data={MOCK_DATA} 
          delay={0.1} 
        />
        <StatCard 
          title="Active Threats" 
          value="12" 
          trend="+2" 
          color="threat" 
          data={MOCK_DATA} 
          delay={0.2} 
        />
        <StatCard 
          title="Requests/sec" 
          value="14.2k" 
          trend="+1.2k" 
          color="intel" 
          data={MOCK_DATA} 
          delay={0.3} 
        />
        <StatCard 
          title="SLA Status" 
          value="99.99%" 
          trend="Stable" 
          color="secure" 
          data={MOCK_DATA} 
          delay={0.4} 
        />
        <StatCard 
          title="Blocked Attacks" 
          value="8,492" 
          trend="+402" 
          color="ai" 
          data={MOCK_DATA} 
          delay={0.5} 
        />
        <StatCard 
          title="Vulnerabilities" 
          value="3" 
          trend="-1" 
          color="warning" 
          data={MOCK_DATA} 
          delay={0.6} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[500px]">
        {/* Center Map (Takes up most space) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-8 xl:col-span-8 flex flex-col h-full"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-wide uppercase text-white/90">Live Threat Visualization</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-threat animate-pulse" />
              <span className="text-xs font-mono text-threat">REAL-TIME</span>
            </div>
          </div>
          <div className="flex-1">
            <ThreatMap />
          </div>
        </motion.div>

        {/* Right Sidebar (Split into AI Decisions and Alerts) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6 h-full">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex-1 min-h-[250px]"
          >
            <AIDecisions />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex-1 min-h-[250px]"
          >
            <AlertsFeed />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
