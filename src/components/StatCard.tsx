import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  color: 'secure' | 'threat' | 'warning' | 'ai' | 'intel';
  data?: any[];
  delay?: number;
}

export function StatCard({ title, value, trend, color, data, delay = 0 }: StatCardProps) {
  const colorMap = {
    secure: 'text-secure',
    threat: 'text-threat',
    warning: 'text-warning',
    ai: 'text-ai',
    intel: 'text-intel',
  };

  const bgMap = {
    secure: 'bg-secure/10',
    threat: 'bg-threat/10',
    warning: 'bg-warning/10',
    ai: 'bg-ai/10',
    intel: 'bg-intel/10',
  };

  const strokeMap = {
    secure: '#22C55E',
    threat: '#EF4444',
    warning: '#F59E0B',
    ai: '#3B82F6',
    intel: '#8B5CF6',
  };

  const bgSolidMap = {
    secure: 'bg-secure',
    threat: 'bg-threat',
    warning: 'bg-warning',
    ai: 'bg-ai',
    intel: 'bg-intel',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider">{title}</h3>
        <div className={cn("w-2 h-2 rounded-full", bgMap[color])}>
          <div className={cn("w-full h-full rounded-full animate-pulse", bgSolidMap[color])} />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <span className={cn("text-2xl font-mono font-bold tracking-tight", colorMap[color])}>
            {value}
          </span>
          {trend && (
            <span className="text-xs text-white/40 ml-2 font-mono">{trend}</span>
          )}
        </div>
        
        {data && (
          <div className="w-20 h-10 opacity-50 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={strokeMap[color]} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={strokeMap[color]} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={strokeMap[color]} 
                  fillOpacity={1} 
                  fill={`url(#gradient-${title.replace(/\s+/g, '-')})`} 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
      {/* Hover Glow */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none",
        bgSolidMap[color]
      )} />
    </motion.div>
  );
}
