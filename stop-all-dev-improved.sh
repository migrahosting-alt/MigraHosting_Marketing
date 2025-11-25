#!/bin/bash

echo "======================================"
echo "Stopping MigraHosting Development Stack"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check for tmux session first
if command -v tmux &> /dev/null && tmux has-session -t migrahosting 2>/dev/null; then
    echo "[1/3] Stopping tmux session..."
    tmux kill-session -t migrahosting
    echo -e "${GREEN}✓ Tmux session stopped${NC}"
else
    # Kill processes using saved PIDs
    if [ -f .pids ]; then
        echo "[1/3] Stopping Node.js processes from PIDs..."
        while read pid; do
            if kill -0 $pid 2>/dev/null; then
                kill $pid 2>/dev/null
                echo "Killed process $pid"
            fi
        done < .pids
        rm .pids
        echo -e "${GREEN}✓ Processes stopped${NC}"
    else
        # Kill by port as fallback
        echo "[1/3] Stopping Node.js services by port..."
        lsof -ti:4242,3000,3001,5173 2>/dev/null | xargs kill -9 2>/dev/null
        echo -e "${GREEN}✓ Services stopped${NC}"
    fi
fi

# Stop Docker containers
echo ""
echo "[2/3] Stopping Docker containers..."
cd mpanel-main
docker-compose down
cd ..
echo -e "${GREEN}✓ Docker containers stopped${NC}"

echo ""
echo "[3/3] Cleanup complete"
echo ""
echo "======================================"
echo "All Services Stopped"
echo "======================================"
