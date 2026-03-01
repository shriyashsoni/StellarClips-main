#!/usr/bin/env bash

set -euo pipefail

if ! command -v cargo >/dev/null 2>&1; then
	echo "❌ cargo not found. Install Rust first: https://rustup.rs"
	exit 1
fi

if ! rustup target list --installed | grep -q "wasm32-unknown-unknown"; then
	echo "ℹ️ Installing wasm target..."
	rustup target add wasm32-unknown-unknown
fi

echo "🚀 Building Soroban contracts..."

contracts=(content_nft subscription payment revenue)

for contract in "${contracts[@]}"; do
	echo "📦 Building ${contract}..."
	(
		cd "$contract"
		cargo build --target wasm32-unknown-unknown --release
	)
done

echo "✅ All contracts built successfully"
echo
echo "WASM files:"
echo "- content_nft/target/wasm32-unknown-unknown/release/content_nft_contract.wasm"
echo "- subscription/target/wasm32-unknown-unknown/release/subscription_contract.wasm"
echo "- payment/target/wasm32-unknown-unknown/release/payment_contract.wasm"
echo "- revenue/target/wasm32-unknown-unknown/release/revenue_contract.wasm"
