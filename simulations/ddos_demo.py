import requests
import time
import threading

URL = "http://localhost:8000/simulate/attack?attack_type=ddos"

def start_attack():
    print("Initiating simulated DDoS attack on NEUROOPS target...")
    try:
        response = requests.post(URL)
        if response.status_code == 200:
            print("Response from AI Brain:", response.json())
        else:
            print("Failed to reach backend.")
    except Exception as e:
        print(f"Error during simulation: {e}")

if __name__ == "__main__":
    start_attack()
