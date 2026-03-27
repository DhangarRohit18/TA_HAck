import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Shield, Zap, Bell, Database, Lock, User, Globe, Server } from 'lucide-react';
import { cn } from '../lib/utils';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'security', label: 'Security & AI', icon: Shield },
    { id: 'infrastructure', label: 'Infrastructure', icon: Server },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-white/50 mt-1">Configure NEUROOPS AI autonomous behaviors and system preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                activeTab === tab.id 
                  ? "bg-ai/10 text-white border border-ai/20 glow-blue" 
                  : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
              )}
            >
              <tab.icon size={18} className={activeTab === tab.id ? "text-ai" : "text-white/40"} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 glass-panel rounded-2xl border border-white/10 p-6 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">System Preferences</h3>
                <div className="space-y-4">
                  <SettingToggle 
                    title="Strict Mode" 
                    description="Enforce maximum security policies. May block legitimate traffic if confidence is low."
                    defaultChecked={false}
                  />
                  <SettingToggle 
                    title="Auto-Update Signatures" 
                    description="Automatically download and apply zero-day threat signatures."
                    defaultChecked={true}
                  />
                  <SettingToggle 
                    title="Data Anonymization" 
                    description="Scrub PII from logs before sending to the AI analysis engine."
                    defaultChecked={true}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-white/70">Gemini API Key</label>
                    <div className="flex gap-2">
                      <input 
                        type="password" 
                        value="************************" 
                        readOnly
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/50 outline-none"
                      />
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">Update</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BrainCircuitIcon size={20} className="text-ai glow-blue" />
                  Autonomous AI Defense
                </h3>
                <div className="space-y-4">
                  <SettingToggle 
                    title="AI Auto-Fix (DevSecOps)" 
                    description="Allow AI to automatically rewrite vulnerable code in the CI/CD pipeline."
                    defaultChecked={true}
                  />
                  <SettingToggle 
                    title="Autonomous Threat Mitigation" 
                    description="Allow AI to block IPs, isolate pods, and deploy WAF rules without human approval."
                    defaultChecked={true}
                  />
                  <div className="flex flex-col gap-2 pt-2">
                    <label className="text-sm text-white/70">AI Confidence Threshold for Autonomous Action</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="50" max="99" defaultValue="90" className="flex-1 accent-ai" />
                      <span className="text-sm font-mono text-ai bg-ai/10 px-2 py-1 rounded">90%</span>
                    </div>
                    <p className="text-xs text-white/40">Actions below this threshold require human approval.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Auto-Scaling & Self-Healing</h3>
                <div className="space-y-4">
                  <SettingToggle 
                    title="Predictive Auto-Scaling" 
                    description="Scale resources proactively based on AI traffic predictions."
                    defaultChecked={true}
                  />
                  <SettingToggle 
                    title="Self-Healing Clusters" 
                    description="Automatically restart failing pods and re-route traffic from degraded nodes."
                    defaultChecked={true}
                  />
                  <div className="flex flex-col gap-2 pt-2">
                    <label className="text-sm text-white/70">Maximum Pod Scaling Limit</label>
                    <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none w-full max-w-xs">
                      <option>100 Pods</option>
                      <option>500 Pods</option>
                      <option>1000 Pods</option>
                      <option>Unlimited</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Alert Preferences</h3>
                <div className="space-y-4">
                  <SettingToggle 
                    title="Critical Security Alerts" 
                    description="Push notifications for active breaches or high-confidence threats."
                    defaultChecked={true}
                  />
                  <SettingToggle 
                    title="Autonomous Action Logs" 
                    description="Notify when the AI takes an autonomous action (e.g., blocking an IP)."
                    defaultChecked={true}
                  />
                  <SettingToggle 
                    title="Infrastructure Warnings" 
                    description="Alerts for high CPU, memory, or network latency."
                    defaultChecked={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingToggle({ title, description, defaultChecked }: { title: string, description: string, defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
      <div className="pr-4">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-white/50 mt-1">{description}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors shrink-0",
          checked ? "bg-ai glow-blue" : "bg-white/20"
        )}
      >
        <motion.div 
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

// Temporary icon component since BrainCircuit isn't imported at top to save space
function BrainCircuitIcon(props: any) {
  return <Zap {...props} />;
}
