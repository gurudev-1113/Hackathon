import requests
import json

BASE_URL = "http://localhost:8080"

def test_user_api():
    print("Testing User Profile API...")
    email = "test@example.com" # Should match what's in your DB or localStorage
    resp = requests.get(f"{BASE_URL}/users/me?email={email}")
    if resp.status_code == 200:
        print("✓ GET /users/me successful")
        user = resp.json()
        user['fullName'] = "Updated Name"
        update_resp = requests.put(f"{BASE_URL}/users/me?email={email}", json=user)
        if update_resp.status_code == 200:
            print("✓ PUT /users/me successful")
        else:
            print(f"✗ PUT /users/me failed: {update_resp.status_code}")
    else:
        print(f"✗ GET /users/me failed (User might not exist): {resp.status_code}")

def test_valve_api():
    print("\nTesting Valve API...")
    # Test bulk add
    new_valves = [
        {"device_id": "V_TEST_1", "name": "Test Valve 1", "lat": 13.0, "lon": 74.0, "status": "CLOSED", "battery": 90},
        {"device_id": "V_TEST_2", "name": "Test Valve 2", "lat": 13.1, "lon": 74.1, "status": "OPEN", "battery": 80}
    ]
    bulk_resp = requests.post(f"{BASE_URL}/valves/bulk", json=new_valves)
    if bulk_resp.status_code == 200:
        print("✓ POST /valves/bulk successful")
    else:
        print(f"✗ POST /valves/bulk failed: {bulk_resp.status_code}")

    # Test single update
    update_data = {"name": "Test Valve 1 Updated", "status": "OPEN", "battery": 95}
    single_update = requests.put(f"{BASE_URL}/valves/V_TEST_1", json=update_data)
    if single_update.status_code == 200:
        print("✓ PUT /valves/{id} successful")
    else:
        print(f"✗ PUT /valves/{id} failed: {single_update.status_code}")

def test_firmware_api():
    print("\nTesting Firmware API...")
    resp = requests.get(f"{BASE_URL}/firmware")
    if resp.status_code == 200:
        print("✓ GET /firmware successful")
    else:
        print(f"✗ GET /firmware failed: {resp.status_code}")

if __name__ == "__main__":
    try:
        test_user_api()
        test_valve_api()
        test_firmware_api()
    except Exception as e:
        print(f"Error during verification: {e}")
        print("Note: Ensure the Spring Boot backend is running on port 8080.")
