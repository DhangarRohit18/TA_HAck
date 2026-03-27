import requests
import time

URL = "http://localhost:8000/simulate/attack?attack_type=db_crash" # I'll add this to main.py

def crash_db():
    print("WARNING: Simulating Database Node Failure...")
    # Add some delay to show the "Healthy" state in the dashboard first
    time.sleep(2)
    # The actual 'crash' is just a status update in our mock system
    print("Action Engine: Restarting service...")
    time.sleep(1.5)
    print("AI Brain: Service recovered. SLA maintained.")

if __name__ == "__main__":
    crash_db()
