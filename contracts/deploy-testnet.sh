#!/usr/bin/env bash

set -euo pipefail

# Usage:
#   SOROBAN_SOURCE=<secret-or-identity> ./deploy-testnet.sh
#   ./deploy-testnet.sh <secret-or-identity>

SOURCE="${1:-${SOROBAN_SOURCE:-}}"

if [[ -z "$SOURCE" ]]; then
  echo "❌ Missing source account/secret"
  echo "Provide via arg or env:"
  echo "  ./deploy-testnet.sh <source>"
  echo "  SOROBAN_SOURCE=<source> ./deploy-testnet.sh"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Building contracts..."
"$SCRIPT_DIR/build.sh"

echo
echo "🚀 Deploying contracts to testnet..."
"$SCRIPT_DIR/deploy.sh" testnet "$SOURCE"
