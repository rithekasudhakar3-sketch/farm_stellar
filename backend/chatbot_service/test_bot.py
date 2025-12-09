import requests
import json

url = "http://127.0.0.1:8001/ask"
payload = {
    "message": "What is the best time to plant wheat?",
    "session_id": "test_user_1"
}
headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except requests.exceptions.ConnectionError:
    print("Error: Could not connect to the server. Is uvicorn running?")
except Exception as e:
    print(f"An error occurred: {e}")
