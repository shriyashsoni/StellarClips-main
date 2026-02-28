#!/bin/bash

# Build script for all Soroban contracts

echo "Building Soroban contracts..."

# Build Content NFT Contract
echo "Building Content NFT Contract..."
cd content_nft
cargo build --target wasm32-unknown-unknown --release
cd ..

# Build Subscription Contract
echo "Building Subscription Contract..."
cd subscription
cargo build --target wasm32-unknown-unknown --release
cd ..

# Build Payment Contract
echo "Building Payment Contract..."
cd payment
cargo build --target wasm32-unknown-unknown --release
cd ..

# Build Revenue Contract
echo "Building Revenue Contract..."
cd revenue
cargo build --target wasm32-unknown-unknown --release
cd ..

echo "All contracts built successfully!"
echo ""
echo "WASM files location:"
echo "- content_nft/target/wasm32-unknown-unknown/release/content_nft_contract.wasm"
echo "- subscription/target/wasm32-unknown-unknown/release/subscription_contract.wasm"
echo "- payment/target/wasm32-unknown-unknown/release/payment_contract.wasm"
echo "- revenue/target/wasm32-unknown-unknown/release/revenue_contract.wasm"
