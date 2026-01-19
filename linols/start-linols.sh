#!/bin/bash

# LinOLS Startup Script
set -e

echo "🔧 Starting LinOLS Web Interface..."

# Start X server
Xvfb :99 -screen 0 1024x768x24 &
export DISPLAY=:99

# Start window manager
fluxbox &

# Wait for X server
sleep 5

# Start VNC server for remote access
x11vnc -display :99 -nopw -listen localhost -xkb -ncache 10 -ncache_cr -forever &

# Start LinOLS web interface
cd /app/web
python3 app.py &

# Keep container running
wait