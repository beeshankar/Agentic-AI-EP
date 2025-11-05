#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"

BACKEND_DIR="$DIR/backend"
FRONTEND_DIR="$DIR/frontend"

echo "[dev] Starting Agentic AI portal (backend + frontend)"

if [ ! -d "$BACKEND_DIR" ] || [ ! -d "$FRONTEND_DIR" ]; then
  echo "[dev] Error: expected backend and frontend directories under $DIR" >&2
  exit 1
fi

# --- Backend ---
echo "[dev] Preparing backend virtualenv..."
cd "$BACKEND_DIR"
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Ensure .env exists with dummy values if missing
if [ ! -f .env ]; then
  echo "[dev] Creating backend .env with dummy GROQ key"
  {
    echo "GROQ_API_KEY=dummy_groq_key"
    echo "GROQ_MODEL=llama3-8b-8192"
  } > .env
fi

# Start FastAPI in background
echo "[dev] Starting FastAPI on http://127.0.0.1:8000"
uvicorn app.main:app --reload --port 8000 > "$BACKEND_DIR/.server.log" 2>&1 &
BACKEND_PID=$!

# --- Frontend ---
echo "[dev] Preparing frontend..."
cd "$FRONTEND_DIR"
npm install
echo "[dev] Starting Vite on http://localhost:5173"

cleanup() {
  echo "\n[dev] Shutting down..."
  if ps -p "$BACKEND_PID" > /dev/null 2>&1; then
    kill "$BACKEND_PID" || true
  fi
}
trap cleanup EXIT INT TERM

npm run dev


