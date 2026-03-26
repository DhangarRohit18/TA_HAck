from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random

app = FastAPI(title="NEUROOPS AI Backend")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mocked system state
system_state = {
    "security_status": "Secure",
    "threat_level": "Low",
    "active_nodes": 5,
    "cpu_usage": 15,
    "memory_usage": 22,
    "network_traffic": 120, # kbps
    "blocked_ips": [],
    "recent_actions": [],
    "vulnerabilities_detected": 0
}

@app.get("/")
async def root():
    return {"message": "NEUROOPS AI Backend is running"}

@app.get("/status")
async def get_status():
    return system_state

@app.post("/simulate/attack")
async def simulate_attack(attack_type: str):
    """
    Simulated cyber events for the demo.
    """
    if attack_type == "ddos":
        system_state["threat_level"] = "Critical"
        system_state["network_traffic"] = 1500 + random.randint(1000, 5000)
        system_state["security_status"] = "Under Attack"
        action = f"Blocked 14.5.122.{random.randint(1,255)}: DDoS pattern detected (Layer 7)."
        system_state["recent_actions"].insert(0, {"time": "Just now", "action": action, "type": "defense"})
        
        await asyncio.sleep(2)
        system_state["threat_level"] = "Mitigated"
        system_state["security_status"] = "Secure"
        system_state["network_traffic"] = 120
        system_state["blocked_ips"].append(f"14.5.122.{random.randint(1,255)}")

    elif attack_type == "brute_force":
        system_state["threat_level"] = "High"
        action = "Detected brute-force on /api/v1/auth. Source IP locked for 24h."
        system_state["recent_actions"].insert(0, {"time": "Just now", "action": action, "type": "defense"})
        system_state["vulnerabilities_detected"] += 1
        await asyncio.sleep(1.5)
        system_state["threat_level"] = "Low"

    elif attack_type == "db_crash":
        system_state["active_nodes"] = 4
        action = "Database Primary Node down. Switching to replica and auto-restarting node 01..."
        system_state["recent_actions"].insert(0, {"time": "Just now", "action": action, "type": "healing"})
        await asyncio.sleep(2)
        system_state["active_nodes"] = 5
        system_state["recent_actions"].insert(0, {"time": "+1.5s", "action": "Node 01 restarted. Heal complete.", "type": "healing"})

    return {"status": "Success", "event": attack_type}

@app.websocket("/ws/monitor")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Simulate real-time fluctuations
            system_state["cpu_usage"] = max(5, min(95, system_state["cpu_usage"] + random.randint(-5, 5)))
            system_state["memory_usage"] = max(10, min(90, system_state["memory_usage"] + random.randint(-2, 2)))
            if system_state["threat_level"] == "Low":
                system_state["network_traffic"] = max(50, min(500, system_state["network_traffic"] + random.randint(-20, 20)))
            
            await websocket.send_text(json.dumps(system_state))
            await asyncio.sleep(1)
    except Exception as e:
        print(f"WebSocket closed: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
