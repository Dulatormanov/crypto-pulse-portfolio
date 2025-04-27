# Crypto Pulse Backend

This is the backend for the Crypto Pulse Portfolio application.

## Features

- Fetches cryptocurrency data from CoinGecko API
- Updates data every 60 seconds via background task
- Support for multiple currencies (USD, EUR)
- Error handling for external API issues
- JSON response format

## API Endpoints

- `GET /api/cryptocurrencies?currency=usd` - Get cryptocurrency data (default currency is USD)
- `GET /api/status` - Get backend status information

## Setup and Installation

### Prerequisites
- Python 3.8+
- CoinGecko API Key (see below)

### CoinGecko API Key
CoinGecko now requires an API key for all API requests. You need to:

1. Sign up for a free account at https://www.coingecko.com/en/api/pricing
2. Obtain an API key from your dashboard
3. Set the API key in the `start_server_with_api_key.bat` file or as an environment variable:
   ```
   set COINGECKO_API_KEY=your_api_key_here
   ```

### Installation

No external dependencies are required. This backend uses Python's standard library.

### Running the Server

For Windows, use one of the batch files:
```bash
start_server_with_api_key.bat
```

The API will be available at http://localhost:8000

## Docker

You can also run the application using Docker:

```bash
docker build -t crypto-pulse-backend .
docker run -p 8000:8000 crypto-pulse-backend
```

## API Documentation

After starting the server, you can access the API at:
- http://localhost:8000/api/cryptocurrencies?currency=usd
- http://localhost:8000/api/status 