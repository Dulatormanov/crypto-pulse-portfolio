# Crypto Watcher Project

## Project Overview

Crypto Watcher is a modern web application for tracking cryptocurrencies and managing a personal investment portfolio. Users can view real-time data on major cryptocurrencies, manage their portfolio, see profit/loss calculations, and use an AI assistant to get market analysis.

---

## Installation and Setup Instructions

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/Dulatormanov/crypto-pulse-portfolio.git
   cd crypto-pulse-portfolio/backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file with your API keys:
   ```
   OPENAI_API_KEY=your_key
   COINGECKO_API_KEY=your_key
   PORT=8000
   ```
4. Start the server:
   ```bash
   python main_new.py
   ```

### Frontend

1. Navigate to the project root:
   ```bash
   cd ../
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Design and Development Process

- Initially developed the UI using React + Vite, focusing on user experience and responsive design
- Implemented a Python backend that aggregates data from CoinGecko and serves it through a custom API
- Created a background task system to update data every 60 seconds
- Added an AI assistant powered by OpenAI for enhanced analytics
- Deployed the application on Render (backend) and Vercel (frontend)

---

## Unique Approaches and Methodologies

- Background task implementation for regular data updates without client-side overhead
- LLM assistant integration to provide value-added analysis for users
- Flexible CORS and environment variable configuration for seamless deployment
- Frontend automatically falls back to direct CoinGecko API if the backend is unavailable
- Responsive design that works well on both desktop and mobile devices

---

## Trade-offs During Development

- Removed KZT from supported currencies due to CoinGecko API limitations
- Used pre-built UI components (shadcn/ui) to accelerate development
- AI assistant provides analysis but not investment advice to avoid liability issues
- Limited historical data to maintain performance and stay within API rate limits

---

## Known Issues or Limitations

- Potential delays during first request to backend on free Render tier (cold start)
- Possible 429 errors (Too Many Requests) when exceeding CoinGecko API limits
- CORS issues may occur with incorrect environment variable configuration
- Portfolio data is stored in localStorage and not persisted across devices

---

## Technology Stack Justification

- **React + TypeScript + Vite**: Fast development cycle, modern SPA approach, excellent TypeScript support
- **Python**: Simplifies integration with external APIs, rich ecosystem for data processing
- **Render/Vercel**: Free and quick deployment, simple CI/CD setup
- **OpenAI**: Powerful LLM for extending application functionality with market analysis
- **Tailwind + shadcn/ui**: Rapid UI development with consistent styling

---

## Demo Video

https://drive.google.com/file/d/1DWlQOq7NK34XEkWgu4JKe8q10J8APy2R/view?usp=sharing

---

## Deployment

- **Frontend**: https://crypto-pulse-portfolio-21gd.vercel.app/
- **Backend**: https://crypto-watcher-n4x4.onrender.com/api/status

---

## External Services

- All external APIs (CoinGecko, OpenAI) are called exclusively from the backend.

---

**This repository is public and does not contain zip files.**
