import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Radar, 
  BrainCircuit, 
  Server, 
  Activity, 
  Settings,
  Search,
  Bell,
  User,
  Menu,
  X,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
  { id: 'devsecops', label: 'Auto-Fix Pipeline', icon: ShieldCheck },
  { id: 'ddos', label: 'DDoS Preventor', icon: ShieldAlert },
  { id: 'analytics', label: 'System Telemetry', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-white flex flex-col font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 border-b border-white/10 bg-bg-secondary/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 z-50">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden text-white/70 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ai flex items-center justify-center glow-blue">
              <BrainCircuit size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-none">NEUROOPS AI</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-wider hidden sm:block">Autonomous IT with Cyber Defense Intelligence</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-secure glow-green"
            />
            <span className="text-xs font-medium text-secure text-glow-green">System Secure</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 w-64">
            <Search size={16} className="text-white/40" />
            <input 
              type="text" 
              placeholder="Search logs, IPs, threats..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/30 text-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-white/70 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-threat glow-red" />
            </button>
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10">
              <User size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <aside className={cn(
          "absolute lg:static inset-y-0 left-0 w-64 bg-bg-secondary/95 backdrop-blur-xl border-r border-white/10 z-40 transform transition-transform duration-300 ease-in-out flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    isActive 
                      ? "text-white bg-ai/10" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute left-0 w-1 h-6 bg-ai rounded-r-full glow-blue" 
                    />
                  )}
                  <Icon size={18} className={cn(
                    "transition-colors",
                    isActive ? "text-ai" : "group-hover:text-white/90"
                  )} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          {/* Mini Status for Sidebar Bottom */}
          <div className="p-4 border-t border-white/10">
            <div className="glass-panel p-3 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60">AI Engine</span>
                <span className="text-xs font-mono text-ai">99.9%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-ai w-[99.9%] glow-blue" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-bg-primary relative">
          {/* Subtle background glow effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-ai/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-intel/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>
        
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
