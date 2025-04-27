# Crypto Pulse Portfolio - Backend Setup

This document explains how to set up and run the backend for the Crypto Pulse Portfolio application.

## Project Structure

The project consists of two main parts:
- React frontend (in the project root)
- FastAPI backend (in the `/backend` directory)

## Backend Features

- Fetches cryptocurrency data from CoinGecko API
- Updates data every 60 seconds via background task
- Support for multiple currencies (USD, EUR, KZT)
- Error handling for external API issues
- JSON response format

## Setting Up the Backend

### Prerequisites
- Python 3.8+
- Node.js and npm for the frontend

### Backend Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
# Windows
python -m venv venv

# Unix/Linux/Mac
python3 -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Unix/Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Backend

#### Using the provided scripts:
- Windows: Double-click `start_server.bat` or run it from command prompt
- Unix/Linux/Mac: Run `./start_server.sh` (make it executable first with `chmod +x start_server.sh`)

#### Or manually:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at http://localhost:8000

## Running the Frontend

1. In a separate terminal, from the project root, install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:8080 (or other port as configured in your vite.config.ts)

## API Documentation

After starting the backend server, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Connecting Frontend to Backend

The frontend is configured to connect to the backend at http://localhost:8000. 
If your backend is running on a different URL, update the `BACKEND_API_URL` variable in `/src/services/crypto-api.ts`. 