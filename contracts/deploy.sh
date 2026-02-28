#!/bin/bash

# Deployment script for Soroban contracts
# Usage: ./deploy.sh <network> <source_account>
# Example: ./deploy.sh testnet SXXX...

NETWORK=${1:-testnet}
SOURCE=${2}

if [ -z "$SOURCE" ]; then
    echo "Error: Source account required"
    echo "Usage: ./deploy.sh <network> <source_account>"
    exit 1
fi

echo "Deploying contracts to $NETWORK..."

# Deploy Content NFT Contract
echo "Deploying Content NFT Contract..."
CONTENT_NFT_ADDRESS=$(soroban contract deploy \
    --wasm content_nft/target/wasm32-unknown-unknown/release/content_nft_contract.wasm \
    --source $SOURCE \
    --network $NETWORK)
echo "Content NFT Contract: $CONTENT_NFT_ADDRESS"

# Deploy Subscription Contract
echo "Deploying Subscription Contract..."
SUBSCRIPTION_ADDRESS=$(soroban contract deploy \
    --wasm subscription/target/wasm32-unknown-unknown/release/subscription_contract.wasm \
    --source $SOURCE \
    --network $NETWORK)
echo "Subscription Contract: $SUBSCRIPTION_ADDRESS"

# Deploy Payment Contract
echo "Deploying Payment Contract..."
PAYMENT_ADDRESS=$(soroban contract deploy \
    --wasm payment/target/wasm32-unknown-unknown/release/payment_contract.wasm \
    --source $SOURCE \
    --network $NETWORK)
echo "Payment Contract: $PAYMENT_ADDRESS"

# Deploy Revenue Contract
echo "Deploying Revenue Contract..."
REVENUE_ADDRESS=$(soroban contract deploy \
    --wasm revenue/target/wasm32-unknown-unknown/release/revenue_contract.wasm \
    --source $SOURCE \
    --network $NETWORK)
echo "Revenue Contract: $REVENUE_ADDRESS"

echo ""
echo "All contracts deployed successfully!"
echo ""
echo "Add these to your .env file:"
echo "NEXT_PUBLIC_CONTENT_NFT_CONTRACT=$CONTENT_NFT_ADDRESS"
echo "NEXT_PUBLIC_SUBSCRIPTION_CONTRACT=$SUBSCRIPTION_ADDRESS"
echo "NEXT_PUBLIC_PAYMENT_CONTRACT=$PAYMENT_ADDRESS"
echo "NEXT_PUBLIC_REVENUE_CONTRACT=$REVENUE_ADDRESS"
