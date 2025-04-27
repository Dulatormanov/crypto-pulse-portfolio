import http.server
import socketserver
import json
import urllib.request
import urllib.parse
import threading
import time
import os
from datetime import datetime

# Port for the server
PORT = 8000

# Global variables to store cached data
crypto_data = {
    "usd": [],
    "eur": []
}
last_update_time = datetime.now()
update_in_progress = False

# CoinGecko API URL - Using free API for compatibility
COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

# Get API key from environment variable or use empty string
COINGECKO_API_KEY = os.environ.get('COINGECKO_API_KEY', '')

# Supported currencies
SUPPORTED_CURRENCIES = ["usd", "eur"]  # Removed kzt due to API issues

# Function to fetch data from CoinGecko
def fetch_crypto_data(currency):
    global crypto_data
    
    try:
        print(f"Fetching data for {currency} from CoinGecko...")
        url = f"{COINGECKO_API_URL}/coins/markets?vs_currency={currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
        
        print(f"Request URL: {url}")
        
        # Set up basic headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json'
        }
        
        # Add API key header if available
        if COINGECKO_API_KEY:
            headers['X-CG-API-Key'] = COINGECKO_API_KEY
            print(f"Using API key: {COINGECKO_API_KEY[:4]}...{COINGECKO_API_KEY[-4:]} in X-CG-API-Key header")
        
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                print(f"Successfully fetched {len(data)} records for {currency}")
                return data
            else:
                print(f"CoinGecko API error: {response.status}")
                return []
    except Exception as e:
        print(f"Error fetching data from CoinGecko: {str(e)}")
        # Detailed error information
        import traceback
        print(f"Detailed error: {traceback.format_exc()}")
        return []

# Function to update all cryptocurrency data
def update_all_crypto_data():
    global update_in_progress, last_update_time, crypto_data
    
    if update_in_progress:
        return
    
    update_in_progress = True
    try:
        print(f"Updating cryptocurrency data at {datetime.now()}")
        for currency in SUPPORTED_CURRENCIES:
            data = fetch_crypto_data(currency)
            if data:
                crypto_data[currency] = data
        last_update_time = datetime.now()
    except Exception as e:
        print(f"Error in background update task: {str(e)}")
    finally:
        update_in_progress = False

# Function to run the update every 60 seconds
def updater():
    while True:
        update_all_crypto_data()
        time.sleep(60)  # Wait for 60 seconds

# Start the updater in a background thread
updater_thread = threading.Thread(target=updater)
updater_thread.daemon = True
updater_thread.start()

# Initialize data on startup
update_all_crypto_data()

# Custom request handler
class CryptoHandler(http.server.SimpleHTTPRequestHandler):
    def _set_headers(self, status_code=200, content_type='application/json'):
        self.send_response(status_code)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')  # CORS header
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        self._set_headers()
    
    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        
        if path == '/api/cryptocurrencies':
            # Parse the query parameters
            query_components = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            currency = query_components.get('currency', ['usd'])[0].lower()
            
            # Validate the currency parameter
            if currency not in SUPPORTED_CURRENCIES:
                error_response = {
                    "error": "Invalid currency",
                    "detail": f"Unsupported currency: {currency}. Supported currencies are: {', '.join(SUPPORTED_CURRENCIES)}"
                }
                self._set_headers(400)
                self.wfile.write(json.dumps(error_response).encode())
                return
            
            # Get data for the requested currency
            data = crypto_data.get(currency, [])
            
            # If no data is available, try to fetch it now
            if not data:
                data = fetch_crypto_data(currency)
                if data:
                    crypto_data[currency] = data
            
            # If still no data, return appropriate error
            if not data:
                error_response = {
                    "error": "Service unavailable",
                    "detail": "Unable to fetch cryptocurrency data. The service is temporarily unavailable."
                }
                self._set_headers(503)
                self.wfile.write(json.dumps(error_response).encode())
                return
            
            self._set_headers()
            self.wfile.write(json.dumps(data).encode())
        
        elif path == '/api/status':
            status_response = {
                "status": "online",
                "last_update": last_update_time.isoformat(),
                "currencies_available": SUPPORTED_CURRENCIES,
                "cached_currencies": list(crypto_data.keys())
            }
            self._set_headers()
            self.wfile.write(json.dumps(status_response).encode())
        
        else:
            # Return 404 for any other path
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

def run_server():
    handler = CryptoHandler
    
    # Create the server with the handler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print(f"API Endpoints:")
        print(f"  - http://localhost:{PORT}/api/cryptocurrencies?currency=usd")
        print(f"  - http://localhost:{PORT}/api/status")
        print("Press Ctrl+C to stop the server")
        
        try:
            # Start the server
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Server stopped")
            httpd.server_close()

if __name__ == "__main__":
    run_server() 