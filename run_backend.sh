#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$DIR/backend"

cd "$BACKEND_DIR"
echo "[backend] Using directory: $BACKEND_DIR"

echo "[backend] Creating/activating virtualenv..."
python3 -m venv .venv
source .venv/bin/activate

echo "[backend] Installing dependencies..."
pip install -r requirements.txt

if [ ! -f .env ]; then
  echo "[backend] Creating .env with dummy GROQ key"
  {
    echo "GROQ_API_KEY=dummy_groq_key"
    echo "GROQ_MODEL=llama3-8b-8192"
  } > .env
fi

echo "[backend] Starting FastAPI on http://127.0.0.1:8000"
exec uvicorn app.main:app --reload --port 8000


