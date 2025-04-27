import requests
import sys
import time

def check_server(url, max_retries=3, retry_delay=2):
    """Check if the server is running and responding correctly."""
    print(f"Checking server at {url}...")
    
    for attempt in range(max_retries):
        try:
            response = requests.get(f"{url}/api/status", timeout=5)
            if response.status_code == 200:
                status_data = response.json()
                print("✅ Server is running!")
                print(f"Last update: {status_data.get('last_update', 'unknown')}")
                print(f"AI Assistant enabled: {status_data.get('ai_assistant_enabled', False)}")
                print(f"Available currencies: {', '.join(status_data.get('currencies_available', []))}")
                return True
            else:
                print(f"❌ Server returned status code {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Connection error (attempt {attempt+1}/{max_retries}): {str(e)}")
        
        if attempt < max_retries - 1:
            print(f"Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
    
    print("❌ Server check failed after multiple attempts")
    return False

if __name__ == "__main__":
    server_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    check_server(server_url) 