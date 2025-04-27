@echo off
echo Setting up environment for AI Assistant server...

rem Read OpenAI API key from file and set environment variable
for /f "delims=" %%a in (openai_key.txt) do set "OPENAI_API_KEY=%%a"

rem Set environment variables for the process
set PYTHONIOENCODING=utf-8

echo Starting server with AI Assistant enabled...
echo Using API key: %OPENAI_API_KEY:~0,8%...

py -3 main_new.py

pause 