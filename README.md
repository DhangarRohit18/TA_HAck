# NEUROOPS AI: Autonomous IT + Cyber Defense System

> "A security-first autonomous IT system that protects, predicts, and self-manages infrastructure — with AI as its core brain."

## 🛡️ Core Vision (70% Security, 30% IT Ops)
NEUROOPS AI bridges the gap between development and runtime. It ensures that code is secure before deployment and that the infrastructure can defend itself against live threats without human intervention.

### 🔍 Key Features
- **AI Code Security Guardian**: Scans repository pushes for SQL Injection, hardcoded secrets, and unsafe API patterns. Blocks insecure deployments automatically.
- **Runtime Threat Detection**: Uses machine learning to identify DDoS, brute-force, and anomalous traffic patterns.
- **Autonomous Cyber Defense**: Instantly mitigates threats by rate-limiting, IP blocking, and service isolation.
- **Self-Healing & Auto-Scaling**: Predictive AIOps that restarts crashed services and scales resources to maintain SLA performance.
- **Explainable AI (XAI)**: A transparent dashboard that explains *why* the AI took specific security or operational actions.

## 🚀 Presentation & Demo Guide
For the hackathon judges, run the following scenarios using the **NEUROOPS Dashboard**:

### 🎬 Demo 1: The DevSecOps Gate
1. Go to **Security Lab** tab.
2. Click **Trigger Secure Deployment Scan**.
3. Watch the AI block an insecure push (SQL Injection/Secrets).

### 🎬 Demo 2: Real-time DDoS Defense
1. Trigger a **L7 DDoS Attack** from the dashboard or run `python simulations/ddos_demo.py`.
2. Watch the **Network Traffic** spike in red.
3. Observe the **Autonomous Action Engine** block the suspicious IPs and mitigate the threat within seconds.

### 🎬 Demo 3: Self-Healing IT
1. Go to **IT Ops** tab.
2. Click **Kill Database Process**.
3. Watch the system detect the node failure and restart it automatically to restore the SLA.

## 🛠️ Technical Stack
- **Backend**: Python (FastAPI + Websockets)
- **AI/ML**: Scikit-Learn (Anomaly Detection), Regex-based Security Scanning.
- **Frontend**: React (Vite) + Tailwind CSS (v4) + Framer Motion.
- **Monitoring**: Real-time WebSocket-based analytics.
- **Presentation**: `Final_NEUROOPS_PPT.pptx` (Generated from TESSERACT '26 Template).

## 🏁 Winning Pitch
"NEUROOPS AI isn't just a monitoring tool; it's a digital immune system. It prevents vulnerabilities before they reach production, neutralizes live cyber attacks in milliseconds, and ensures IT infrastructure heals itself—all while explaining every decision to the human operators."
