#!/usr/bin/env bash

set -euo pipefail

# This project deploys contracts through Soroban CLI (recommended and supported).
# Keeping this wrapper for compatibility with existing docs.

# Usage:
#   ./deploy-via-rpc.sh <network> <source>
#   SOROBAN_SOURCE=<source> ./deploy-via-rpc.sh testnet

NETWORK="${1:-testnet}"
SOURCE="${2:-${SOROBAN_SOURCE:-}}"

if [[ -z "$SOURCE" ]]; then
  echo "❌ Missing source account/secret"
  echo "Usage: ./deploy-via-rpc.sh <network> <source>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "ℹ️ Direct raw-RPC deployment is not maintained in this repo."
echo "ℹ️ Using supported Soroban CLI deployment flow instead."
echo
"$SCRIPT_DIR/deploy.sh" "$NETWORK" "$SOURCE"
