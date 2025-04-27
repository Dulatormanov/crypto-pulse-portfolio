@echo off
echo Starting Crypto Pulse Backend Server with API Key (Fixed Version)...
echo.

REM Set your CoinGecko API key here
set COINGECKO_API_KEY=CG-LYdmt4purBcvmF3VJpEhSYe1

cd %~dp0
C:\Users\dulat\AppData\Local\Programs\Python\Python313\python.exe main_fixed.py
pause 