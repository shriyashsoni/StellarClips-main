#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTRACTS_DIR="$ROOT_DIR/contracts"

ok() {
  echo "✅ $1"
}

fail() {
  echo "❌ $1"
  exit 1
}

warn() {
  echo "⚠️  $1"
}

echo "🔎 StellarClips deployment preflight (non-broadcast)"
echo

for file in \
  "$CONTRACTS_DIR/build.sh" \
  "$CONTRACTS_DIR/deploy.sh" \
  "$CONTRACTS_DIR/deploy-testnet.sh" \
  "$CONTRACTS_DIR/deploy-via-rpc.sh" \
  "$CONTRACTS_DIR/deploy-with-nodejs.js"; do
  [[ -f "$file" ]] || fail "Missing required file: $file"
done
ok "Deployment scripts are present"

command -v node >/dev/null 2>&1 || fail "Node.js is required"
command -v pnpm >/dev/null 2>&1 || warn "pnpm not found in PATH (frontend commands may fail)"
command -v cargo >/dev/null 2>&1 || fail "cargo not found (install Rust via rustup)"
command -v soroban >/dev/null 2>&1 || fail "soroban CLI not found (install with: cargo install --locked soroban-cli)"
ok "Required tooling is installed"

if command -v rustup >/dev/null 2>&1; then
  if rustup target list --installed | grep -q "wasm32-unknown-unknown"; then
    ok "Rust wasm target is installed"
  else
    warn "wasm32-unknown-unknown target missing (build.sh will install it automatically)"
  fi
else
  warn "rustup not found; cannot verify wasm target"
fi

bash -n "$CONTRACTS_DIR/build.sh"
bash -n "$CONTRACTS_DIR/deploy.sh"
bash -n "$CONTRACTS_DIR/deploy-testnet.sh"
bash -n "$CONTRACTS_DIR/deploy-via-rpc.sh"
ok "Bash deployment scripts pass syntax checks"

node --check "$CONTRACTS_DIR/deploy-with-nodejs.js"
ok "Node deployment wrapper passes syntax checks"

echo
echo "✅ Preflight passed"
echo "Ready for deployment commands:"
echo "  cd contracts && ./build.sh"
echo "  ./deploy.sh testnet <source_account_or_secret>"
