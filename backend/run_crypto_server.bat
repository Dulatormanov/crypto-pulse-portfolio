@echo off
echo =============================================
echo  Crypto Portfolio Backend with AI Assistant
echo =============================================

echo Setting up environment for AI Assistant...

rem Read OpenAI API key from file and set environment variable
for /f "delims=" %%a in (openai_key.txt) do set "OPENAI_API_KEY=%%a"

rem Set environment variables for the process
set PYTHONIOENCODING=utf-8

echo.
echo Using API key: %OPENAI_API_KEY:~0,8%...
echo.
echo Starting server with full functionality...
echo.
echo API Endpoints:
echo - http://localhost:8000/api/cryptocurrencies?currency=usd
echo - http://localhost:8000/api/status
echo - http://localhost:8000/api/ai-assistant (POST)
echo.
echo Press Ctrl+C to stop the server
echo.

py -3 main_new.py

pause 