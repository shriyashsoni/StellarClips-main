#!/usr/bin/env bash

set -euo pipefail

# Usage:
#   SOROBAN_SOURCE=<secret-or-identity> SOROBAN_PLATFORM_ADDRESS=<G...> SOROBAN_TOKEN_ADDRESS=<C...> ./deploy-testnet.sh
#   ./deploy-testnet.sh <secret-or-identity> <platform-address> <token-address>

SOURCE="${1:-${SOROBAN_SOURCE:-}}"
PLATFORM_ADDRESS="${2:-${SOROBAN_PLATFORM_ADDRESS:-}}"
TOKEN_ADDRESS="${3:-${SOROBAN_TOKEN_ADDRESS:-}}"

if [[ -z "$SOURCE" ]]; then
  echo "❌ Missing source account/secret"
  echo "Provide via arg or env:"
  echo "  ./deploy-testnet.sh <source> <platform-address> <token-address>"
  echo "  SOROBAN_SOURCE=<source> SOROBAN_PLATFORM_ADDRESS=<G...> SOROBAN_TOKEN_ADDRESS=<C...> ./deploy-testnet.sh"
  exit 1
fi

if [[ -z "$PLATFORM_ADDRESS" || -z "$TOKEN_ADDRESS" ]]; then
  echo "❌ Missing platform/token init arguments"
  echo "Provide both platform and token addresses as args or env vars"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Building contracts..."
"$SCRIPT_DIR/build.sh"

echo
echo "🚀 Deploying contracts to testnet..."
"$SCRIPT_DIR/deploy.sh" testnet "$SOURCE" "$PLATFORM_ADDRESS" "$TOKEN_ADDRESS"
