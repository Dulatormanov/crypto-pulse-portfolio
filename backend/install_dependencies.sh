#!/bin/bash
echo "Installing dependencies for Crypto Pulse Backend..."
echo ""

pip install fastapi==0.103.1 uvicorn==0.23.2 httpx==0.25.0 python-dotenv==1.0.0 apscheduler==3.10.4
pip install pydantic==2.3.0 --only-binary=pydantic-core

echo ""
echo "Dependencies installed successfully!" 