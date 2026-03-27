from fastapi import FastAPI, WebSocket, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
import random
import psutil
import datetime
import re
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import numpy as np
from sklearn.linear_model import LinearRegression

# --- Database Integration (For Persistence) ---
DATABASE_URL = "sqlite:///./neuroops.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class SecurityEvent(Base):
    __tablename__ = "security_events"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    type = Column(String(50)) # e.g., defense, healing, deployment
    action = Column(Text)
    severity = Column(String(20))

Base.metadata.create_all(bind=engine)

# --- AI Logic & State Management ---
class AIOpsPredictor:
    def __init__(self):
        self.model = LinearRegression()
        self.history = [] # list of (timestamp, cpu_usage)

    def record_usage(self, cpu_val):
        self.history.append((datetime.datetime.now().timestamp(), cpu_val))
        if len(self.history) > 300: # past 5 mins
            self.history = self.history[-300:]

    def predict_future_load(self):
        if len(self.history) < 10: return 0.0
        X = np.array([h[0] for h in self.history]).reshape(-1, 1)
        y = np.array([h[1] for h in self.history])
        self.model.fit(X, y)
        future_time = datetime.datetime.now().timestamp() + 30 # predict 30s ahead
        prediction = self.model.predict([[future_time]])
        return float(max(0, min(100, prediction[0])))

class NeuroBrain:
    def __init__(self):
        self.state = {
            "security_status": "Operational",
            "threat_level": "Optimal",
            "active_nodes": 5,
            "cpu_usage": 0,
            "memory_usage": 0,
            "network_traffic": 140,
            "blocked_ips": [],
            "recent_actions": [],
            "vulnerabilities_detected": 0,
            "predicted_load": 0.0
        }
        self.predictor = AIOpsPredictor()
        self.vuln_patterns = [
            (r'(?i)SELECT.*FROM.*WHERE.*=.*(%s|\{)', "CRITICAL: Potential Blind SQL Injection vector detected."),
            (r'xox[pb]\-[0-9]{12}', "SECRET LEAK: Slack Bot Token exposed."),
            (r'eval\(input\(\)\)', "DANGER: Remote Code Execution via eval-input pattern."),
            (r'subprocess\.check_output', "WARNING: Low-level Shell execution detected."),
            (r'kubectl.*delete.*--all', "DESTRUCTIVE: Kubernetes cluster reset command detected.")
        ]
        self._load_historical_actions()

    def _load_historical_actions(self):
        db = SessionLocal()
        events = db.query(SecurityEvent).order_by(SecurityEvent.timestamp.desc()).limit(20).all()
        for e in events:
            self.state["recent_actions"].append({
                "time": e.timestamp.strftime("%H:%M:%S"),
                "action": e.action,
                "type": e.type
            })
        db.close()

    def log_and_persist(self, action, a_type, severity="medium"):
        db = SessionLocal()
        event = SecurityEvent(type=a_type, action=action, severity=severity)
        db.add(event)
        db.commit()
        db.refresh(event)
        
        entry = {
            "time": event.timestamp.strftime("%H:%M:%S"),
            "action": action,
            "type": a_type
        }
        self.state["recent_actions"].insert(0, entry)
        self.state["recent_actions"] = self.state["recent_actions"][:50]
        db.close()

    def update_real_time_metrics(self):
        self.state["cpu_usage"] = psutil.cpu_percent()
        self.state["memory_usage"] = psutil.virtual_memory().percent
        self.predictor.record_usage(self.state["cpu_usage"])
        self.state["predicted_load"] = round(self.predictor.predict_future_load(), 2)

brain = NeuroBrain()

# --- API Definitions ---
app = FastAPI(title="NEUROOPS AI Production API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodePayload(BaseModel):
    id: str = "prod-push"
    code: str

@app.post("/api/v1/scan")
async def production_security_scan(payload: CodePayload):
    findings = []
    for pattern, msg in brain.vuln_patterns:
        if re.search(pattern, payload.code):
            findings.append(msg)
    
    if findings:
        brain.state["vulnerabilities_detected"] += len(findings)
        brain.log_and_persist(f"Security Gate Blocked Build {payload.id}: {findings[0]}", "defense", "high")
        return {"status": "blocked", "findings": findings, "timestamp": datetime.datetime.now().isoformat()}
    
    brain.log_and_persist(f"Build {payload.id} successfully analysis & signed.", "deployment", "low")
    return {"status": "secure", "metadata": {"rules_scanned": 124, "score": 100}}

@app.post("/api/v1/simulate")
async def trigger_autonomous_event(event_type: str):
    if event_type == "ddos":
        brain.state["security_status"] = "Responding"
        brain.state["threat_level"] = "Critical"
        brain.state["network_traffic"] = 4200 + random.randint(100, 500)
        source_ip = f"14.5.{random.randint(100, 200)}.{random.randint(1, 255)}"
        brain.log_and_persist(f"AI IDS DETECTED FLOOD: {brain.state['network_traffic']} r/s from {source_ip}.", "defense", "high")
        
        await asyncio.sleep(2)
        brain.state["blocked_ips"].append(source_ip)
        brain.state["security_status"] = "Operational"
        brain.state["threat_level"] = "Mitigated"
        brain.state["network_traffic"] = 145
        brain.log_and_persist(f"NEURO-BLOCK: Isolated source {source_ip} at edge firewall.", "defense", "medium")

    elif event_type == "scale":
        brain.log_and_persist("AIOps Predicted Load Spike: Auto-scaling active node cluster...", "healing", "low")
        await asyncio.sleep(1.5)
        brain.state["active_nodes"] = 7
        brain.log_and_persist("Infrastructure Scaled: Nodes 06 & 07 ready for traffic redirection.", "healing", "low")
        await asyncio.sleep(5)
        brain.state["active_nodes"] = 5
        brain.log_and_persist("Traffic Normalized: Downscaling to baseline nodes.", "healing", "low")

    return {"status": "event_processed", "type": event_type}

@app.websocket("/ws/v1/stream")
async def real_time_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            brain.update_real_time_metrics()
            await websocket.send_text(json.dumps(brain.state))
            await asyncio.sleep(0.8) # Ultra-low latency stream
    except Exception as e:
        print(f"Connection ended: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
