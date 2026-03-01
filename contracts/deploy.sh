#!/usr/bin/env bash

set -euo pipefail

# Usage: ./deploy.sh <network> <source_account_or_secret>
# Example: ./deploy.sh testnet SXXXXXXXXXXXXXXXXXXXXXXXX

NETWORK="${1:-testnet}"
SOURCE="${2:-}"

if [[ -z "$SOURCE" ]]; then
    echo "❌ Source account/secret required"
    echo "Usage: ./deploy.sh <network> <source_account_or_secret>"
    exit 1
fi

if ! command -v soroban >/dev/null 2>&1; then
    echo "❌ soroban CLI not found. Install with: cargo install --locked soroban-cli"
    exit 1
fi

required_wasm=(
    "content_nft/target/wasm32-unknown-unknown/release/content_nft_contract.wasm"
    "subscription/target/wasm32-unknown-unknown/release/subscription_contract.wasm"
    "payment/target/wasm32-unknown-unknown/release/payment_contract.wasm"
    "revenue/target/wasm32-unknown-unknown/release/revenue_contract.wasm"
)

missing=0
for wasm in "${required_wasm[@]}"; do
    if [[ ! -f "$wasm" ]]; then
        missing=1
    fi
done

if [[ "$missing" -eq 1 ]]; then
    echo "ℹ️ Missing contract artifacts. Building first..."
    "$(dirname "$0")/build.sh"
fi

echo "🚀 Deploying contracts to network: $NETWORK"

deploy_contract() {
    local label="$1"
    local wasm="$2"

    echo "📦 Deploying $label..."
    soroban contract deploy \
        --wasm "$wasm" \
        --source-account "$SOURCE" \
        --network "$NETWORK"
}

CONTENT_NFT_ADDRESS="$(deploy_contract "Content NFT" "content_nft/target/wasm32-unknown-unknown/release/content_nft_contract.wasm" | tail -n1)"
SUBSCRIPTION_ADDRESS="$(deploy_contract "Subscription" "subscription/target/wasm32-unknown-unknown/release/subscription_contract.wasm" | tail -n1)"
PAYMENT_ADDRESS="$(deploy_contract "Payment" "payment/target/wasm32-unknown-unknown/release/payment_contract.wasm" | tail -n1)"
REVENUE_ADDRESS="$(deploy_contract "Revenue" "revenue/target/wasm32-unknown-unknown/release/revenue_contract.wasm" | tail -n1)"

echo
echo "✅ All contracts deployed"
echo
echo "NEXT_PUBLIC_CONTENT_NFT_CONTRACT=$CONTENT_NFT_ADDRESS"
echo "NEXT_PUBLIC_SUBSCRIPTION_CONTRACT=$SUBSCRIPTION_ADDRESS"
echo "NEXT_PUBLIC_PAYMENT_CONTRACT=$PAYMENT_ADDRESS"
echo "NEXT_PUBLIC_REVENUE_CONTRACT=$REVENUE_ADDRESS"
