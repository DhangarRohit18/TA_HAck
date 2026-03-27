import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Search, ShieldAlert, ShieldCheck, Play, CheckCircle2, XCircle, AlertCircle, BrainCircuit, Server, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

const VULNERABLE_CODE = `async function login(req, res) {
  const { username, password } = req.body;
  
  // Vulnerable code
  const query = \`SELECT * FROM users 
                 WHERE username = '\${username}' 
                 AND password = '\${password}'\`;
                 
  const user = await db.execute(query);
  
  if (user) {
    const token = jwt.sign({ id: user.id }, 
                  "hardcoded_secret_key_123");
    return res.json({ token });
  }
  
  return res.status(401).send("Unauthorized");
}`;

const SECURE_CODE = `async function login(req, res) {
  const { username, password } = req.body;
  
  // SECURE: Parameterized query prevents SQLi
  const query = \`SELECT * FROM users 
                 WHERE username = $1 
                 AND password = $2\`;
                 
  const user = await db.execute(query, [username, password]);
  
  if (user) {
    // SECURE: Using environment variables
    const token = jwt.sign({ id: user.id }, 
                  process.env.JWT_SECRET);
    return res.json({ token });
  }
  
  return res.status(401).send("Unauthorized");
}`;

const SCAN_LOGS = [
  "Initializing SAST scanner engine...",
  "Loading security rulesets (OWASP Top 10)...",
  "Analyzing AST for auth.service.ts...",
  "Performing data flow and taint analysis...",
  "Checking dependencies for known CVEs...",
  "WARN: Unsanitized input detected in SQL query (Line 6)",
  "WARN: Hardcoded JWT secret detected (Line 12)",
  "Generating vulnerability report...",
  "Scan complete. 2 critical issues found."
];

export function DevSecOps() {
  const [stage, setStage] = useState<'idle' | 'scanning' | 'detected' | 'fixing' | 'deploying' | 'deployed'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [codeContent, setCodeContent] = useState(VULNERABLE_CODE);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const startPipeline = () => {
    setStage('idle');
    setProgress(0);
    setLogs([]);
    setCodeContent(VULNERABLE_CODE);
    
    // Brief pause before scanning starts to show "Code Input"
    setTimeout(() => {
      setStage('scanning');
    }, 1000);
  };

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    if (stage === 'scanning') {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 1; // Slower progress
        if (currentProgress > 100) currentProgress = 100;
        setProgress(currentProgress);
        
        const logIndex = Math.floor((currentProgress / 100) * SCAN_LOGS.length);
        if (logIndex > 0 && logIndex <= SCAN_LOGS.length) {
          setLogs(SCAN_LOGS.slice(0, logIndex));
        }

        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setStage('detected'), 1500); // Longer pause before showing detected
        }
      }, 80); // 80ms * 100 = 8 seconds total scanning time
      return () => clearInterval(interval);
    }
    
    if (stage === 'fixing') {
      let i = 0;
      setCodeContent('');
      const interval = setInterval(() => {
        setCodeContent(SECURE_CODE.slice(0, i));
        i += 2; // Slower typing
        if (i >= SECURE_CODE.length) {
          clearInterval(interval);
          setCodeContent(SECURE_CODE);
          setTimeout(() => setStage('deploying'), 2000); // Longer pause to read the fixed code
        }
      }, 20);
      return () => clearInterval(interval);
    }

    if (stage === 'deploying') {
      const timeout = setTimeout(() => {
        setStage('deployed');
      }, 2500);
      return () => clearTimeout(timeout);
    }

    if (stage === 'idle') {
      setCodeContent(VULNERABLE_CODE);
      setLogs([]);
      setProgress(0);
    }
  }, [stage]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">DevSecOps Pipeline</h2>
          <p className="text-sm text-white/50 mt-1">Pre-deployment security & autonomous remediation</p>
        </div>
        <button 
          onClick={startPipeline}
          disabled={stage !== 'idle' && stage !== 'deployed'}
          className={cn(
            "px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all",
            stage === 'idle' || stage === 'deployed'
              ? "bg-ai text-white hover:bg-ai/90 glow-blue"
              : "bg-white/10 text-white/50 cursor-not-allowed"
          )}
        >
          <Play size={16} />
          {stage === 'idle' || stage === 'deployed' ? 'Start Pipeline' : 'Pipeline Running...'}
        </button>
      </div>

      {/* Pipeline Flow Visualization */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ai/5 via-transparent to-secure/5 pointer-events-none" />
        
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-10 right-10 h-1 bg-white/10 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Animated Progress Bar */}
        <motion.div 
          className="absolute top-1/2 left-10 h-1 bg-ai -translate-y-1/2 z-0 rounded-full glow-blue"
          initial={{ width: '0%' }}
          animate={{ 
            width: stage === 'idle' ? '0%' :
                   stage === 'scanning' ? `${progress * 0.25}%` : // 0-25%
                   stage === 'detected' ? '50%' : // 50%
                   stage === 'fixing' ? '75%' : // 75%
                   stage === 'deploying' ? '90%' : // 90%
                   stage === 'deployed' ? '100%' : '0%' 
          }}
          transition={{ duration: 0.5 }}
        />

        <Step 
          icon={Code} 
          label="Code Input" 
          status={stage !== 'idle' ? 'complete' : 'pending'} 
          color="ai"
        />
        <Step 
          icon={Search} 
          label="AI Scan" 
          status={stage === 'scanning' ? 'active' : stage === 'idle' ? 'pending' : 'complete'} 
          color="intel"
        />
        <Step 
          icon={ShieldAlert} 
          label="Detect" 
          status={stage === 'detected' ? 'active' : ['fixing', 'deploying', 'deployed'].includes(stage) ? 'complete' : 'pending'} 
          color="threat"
        />
        <Step 
          icon={ShieldCheck} 
          label="Auto Fix" 
          status={stage === 'fixing' ? 'active' : ['deploying', 'deployed'].includes(stage) ? 'complete' : 'pending'} 
          color="warning"
        />
        <Step 
          icon={CheckCircle2} 
          label="Deploy" 
          status={stage === 'deploying' ? 'active' : stage === 'deployed' ? 'complete' : 'pending'} 
          color="secure"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Code Panel */}
        <div className="glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code size={16} className="text-white/50" />
              <span className="text-sm font-mono text-white/70">auth.service.ts</span>
            </div>
            <span className="text-xs text-white/40">
              {stage === 'deploying' || stage === 'deployed' ? 'v2.4.2 (Secured)' : 'v2.4.1'}
            </span>
          </div>
          <div className="p-4 flex-1 bg-[#0d1117] font-mono text-sm overflow-y-auto relative">
            <pre className={cn(
              "transition-colors duration-500",
              stage === 'fixing' ? "text-ai" : 
              (stage === 'deploying' || stage === 'deployed') ? "text-secure" : "text-white/80"
            )}>
              <code>{codeContent}</code>
            </pre>
            
            {/* Highlight overlays based on stage */}
            <AnimatePresence>
              {stage === 'detected' && (
                <motion.div 
                  key="sql-injection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-[88px] left-4 right-4 h-[60px] bg-threat/20 border border-threat/50 rounded pointer-events-none flex items-center justify-end pr-2"
                >
                  <span className="text-xs font-bold text-threat bg-threat/10 px-2 py-1 rounded">SQL INJECTION</span>
                </motion.div>
              )}
              {stage === 'detected' && (
                <motion.div 
                  key="hardcoded-secret"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-[188px] left-4 right-4 h-[24px] bg-warning/20 border border-warning/50 rounded pointer-events-none flex items-center justify-end pr-2"
                >
                  <span className="text-xs font-bold text-warning bg-warning/10 px-2 py-1 rounded">HARDCODED SECRET</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Panel */}
        <div className="glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden relative">
          <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <BrainCircuit size={16} className="text-ai glow-blue" />
            <span className="text-sm font-semibold text-white/90">AI Security Engine</span>
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              {stage === 'idle' && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center text-white/50"
                >
                  <ShieldCheck size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Ready to scan code for vulnerabilities.</p>
                  <p className="text-sm mt-2">Press Start Pipeline to begin.</p>
                </motion.div>
              )}

              {stage === 'scanning' && (
                <motion.div 
                  key="scanning"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-t-2 border-ai border-r-2 border-r-transparent glow-blue"
                      />
                      <Search size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-ai" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Scanning Codebase</h3>
                      <p className="text-sm text-white/60 font-mono">{Math.floor(progress)}% Complete</p>
                    </div>
                  </div>
                  
                  {/* Terminal Log Window */}
                  <div className="flex-1 bg-black/60 border border-white/10 rounded-lg p-3 font-mono text-xs overflow-y-auto flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-white/40 mb-2 border-b border-white/10 pb-2">
                      <Terminal size={14} />
                      <span>Scanner Output</span>
                    </div>
                    {logs.map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "text-white/70",
                          log.includes("WARN") ? "text-warning" : 
                          log.includes("critical") ? "text-threat" : ""
                        )}
                      >
                        <span className="text-white/30 mr-2">[{new Date().toISOString().substring(11, 19)}]</span>
                        {log}
                      </motion.div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </motion.div>
              )}

              {stage === 'detected' && (
                <motion.div 
                  key="detected"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center gap-3 mb-6 p-4 bg-threat/10 border border-threat/30 rounded-xl">
                    <XCircle size={32} className="text-threat glow-red" />
                    <div>
                      <h3 className="text-lg font-bold text-threat">Deployment Blocked</h3>
                      <p className="text-sm text-white/70">Critical vulnerabilities detected in auth.service.ts</p>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-start gap-3">
                      <ShieldAlert size={16} className="text-threat mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-white">SQL Injection Risk</h4>
                        <p className="text-xs text-white/50 mt-1">Direct string concatenation in SQL query allows arbitrary command execution.</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-start gap-3">
                      <AlertCircle size={16} className="text-warning mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-white">Hardcoded Secret</h4>
                        <p className="text-xs text-white/50 mt-1">JWT secret key is hardcoded. Should use environment variables.</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStage('fixing')}
                    className="w-full py-3 mt-4 bg-ai/20 text-ai hover:bg-ai/30 border border-ai/50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 glow-blue"
                  >
                    <BrainCircuit size={18} />
                    Apply AI Auto-Fix
                  </button>
                </motion.div>
              )}

              {stage === 'fixing' && (
                <motion.div 
                  key="fixing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <BrainCircuit size={32} className="text-ai animate-pulse glow-blue" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Generating Secure Code</h3>
                      <p className="text-sm text-white/60">Applying parameterized queries and env vars...</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-ai/5 border border-ai/20 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                    <Code size={24} className="text-ai mb-2" />
                    <p className="text-sm text-white/80 font-mono">Rewriting auth.service.ts</p>
                    <div className="w-full max-w-xs h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                      <motion.div 
                        className="h-full bg-ai glow-blue"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2.5, ease: "linear" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {stage === 'deploying' && (
                <motion.div 
                  key="deploying"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center h-full"
                >
                  <Server size={48} className="text-secure mb-6 animate-pulse glow-green" />
                  <h3 className="text-xl font-bold text-white mb-2">Deploying to Production</h3>
                  <p className="text-sm text-white/60">Security checks passed. Initiating rollout...</p>
                </motion.div>
              )}

              {stage === 'deployed' && (
                <motion.div 
                  key="deployed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center h-full"
                >
                  <CheckCircle2 size={64} className="text-secure mb-6 glow-green" />
                  <h3 className="text-2xl font-bold text-white mb-2">Deployment Successful</h3>
                  <p className="text-sm text-white/60 text-center max-w-xs">
                    Code was automatically secured and deployed with 0 vulnerabilities.
                  </p>
                  <button 
                    onClick={() => setStage('idle')}
                    className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                  >
                    Reset Pipeline
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ icon: Icon, label, status, color }: { icon: any, label: string, status: 'pending' | 'active' | 'complete', color: string }) {
  const colorMap: Record<string, string> = {
    ai: 'text-ai bg-ai/20 border-ai/50',
    intel: 'text-intel bg-intel/20 border-intel/50',
    threat: 'text-threat bg-threat/20 border-threat/50',
    warning: 'text-warning bg-warning/20 border-warning/50',
    secure: 'text-secure bg-secure/20 border-secure/50',
  };

  const glowMap: Record<string, string> = {
    ai: 'glow-blue',
    intel: 'glow-purple',
    threat: 'glow-red',
    warning: 'glow-yellow',
    secure: 'glow-green',
  };

  return (
    <div className="relative z-10 flex flex-col items-center gap-2">
      <motion.div 
        animate={status === 'active' ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500",
          status === 'complete' ? colorMap[color] : 
          status === 'active' ? cn(colorMap[color], glowMap[color]) : 
          "bg-bg-secondary border-white/10 text-white/30"
        )}
      >
        <Icon size={20} />
      </motion.div>
      <span className={cn(
        "text-xs font-medium transition-colors duration-500",
        status === 'pending' ? "text-white/30" : "text-white/90"
      )}>
        {label}
      </span>
    </div>
  );
}
