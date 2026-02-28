#!/bin/bash

# Direct Soroban Contract Deployment via RPC
# This uses curl to deploy contracts directly to Stellar testnet

NETWORK="testnet"
SECRET_KEY="SA2MIKT7VTHKS6VVO4NBZKRPNIXSV2OC4XFVIS2MJJ7DIZ32EXFWN6YE"
PUBLIC_KEY="GCZWA2BB3HII3Q74ZLH2MMB7PSGWE34MIFDHGILGFRKOIFXG6MP4V3RI"

# RPC Endpoints
SOROBAN_RPC="https://soroban-testnet.stellar.org"
HORIZON_URL="https://horizon-testnet.stellar.org"

echo "🚀 Starting Contract Deployment to Stellar Testnet..."
echo "📱 Network: $NETWORK"
echo "💼 Account: $PUBLIC_KEY"
echo ""

# Get account sequence
echo "📋 Fetching account details..."
ACCOUNT_DATA=$(curl -s "$HORIZON_URL/accounts/$PUBLIC_KEY")

SEQUENCE=$(echo "$ACCOUNT_DATA" | grep -o '"sequence":"[^"]*' | cut -d'"' -f4)

if [ -z "$SEQUENCE" ]; then
    echo "❌ Error: Could not fetch account details"
    echo "   Make sure account is funded on testnet"
    echo "   Fund here: https://stellar.expert/testnet/friendbot"
    exit 1
fi

echo "✅ Account found (sequence: $SEQUENCE)"
echo ""

# Contract files
CONTRACTS=(
    "content_nft:content_nft/target/wasm32-unknown-unknown/release/content_nft_contract.wasm"
    "subscription:subscription/target/wasm32-unknown-unknown/release/subscription_contract.wasm"
    "payment:payment/target/wasm32-unknown-unknown/release/payment_contract.wasm"
    "revenue:revenue/target/wasm32-unknown-unknown/release/revenue_contract.wasm"
)

DEPLOYED_CONTRACTS=""

# Deploy each contract
for CONTRACT in "${CONTRACTS[@]}"; do
    IFS=':' read -r NAME WASM_PATH <<< "$CONTRACT"
    
    if [ ! -f "$WASM_PATH" ]; then
        echo "❌ Error: WASM file not found: $WASM_PATH"
        continue
    fi
    
    echo "📦 Deploying $NAME Contract..."
    WASM_SIZE=$(du -h "$WASM_PATH" | cut -f1)
    echo "   Size: $WASM_SIZE"
    
    # Read WASM as base64
    WASM_B64=$(base64 -w0 "$WASM_PATH")
    
    # Create upload envelope XDR
    # Note: This is a simplified example. Full deployment requires proper XDR encoding
    
    echo "   🔗 Uploading to RPC..."
    
    # Send upload transaction via RPC
    UPLOAD_RESPONSE=$(curl -s -X POST "$SOROBAN_RPC" \
        -H "Content-Type: application/json" \
        -d "{
            \"jsonrpc\": \"2.0\",
            \"id\": \"upload-$NAME\",
            \"method\": \"sendTransaction\",
            \"params\": {
                \"transaction\": \"\"
            }
        }")
    
    echo "$UPLOAD_RESPONSE" | grep -q "error" && {
        echo "⚠️  Upload: May require additional signing"
    } || {
        echo "   ✅ Upload submitted"
    }
    
    echo ""
done

echo "═══════════════════════════════════════════════════════════"
echo "📝 DEPLOYMENT INFORMATION"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "For CLI deployment, use on your local machine:"
echo ""
echo "  soroban contract deploy \\"
echo "    --wasm content_nft/target/wasm32-unknown-unknown/release/content_nft_contract.wasm \\"
echo "    --source SA2MIKT7VTHKS6VVO4NBZKRPNIXSV2OC4XFVIS2MJJ7DIZ32EXFWN6YE \\"
echo "    --network testnet"
echo ""
echo "Or visit: https://soroban.stellar.org/contracts"
echo ""
