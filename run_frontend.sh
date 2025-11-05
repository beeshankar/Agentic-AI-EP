#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$DIR/frontend"

cd "$FRONTEND_DIR"
echo "[frontend] Using directory: $FRONTEND_DIR"

echo "[frontend] Installing npm dependencies..."
npm install

echo "[frontend] Starting Vite on http://localhost:5173"
exec npm run dev


