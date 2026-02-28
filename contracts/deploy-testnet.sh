#!/bin/bash

# ============================================================================
# 🚀 StellarClips Smart Contract Deployment Script
# ============================================================================
# This script deploys all 4 Soroban contracts to Stellar Testnet
# Works on local machine with Soroban CLI installed
# 
# Setup:
#   1. Install Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
#   2. source $HOME/.cargo/env
#   3. cargo install --locked soroban-cli
#   4. Run this script: chmod +x deploy-testnet.sh && ./deploy-testnet.sh
# ============================================================================

set -e  # Exit on error

# Configuration
NETWORK="testnet"
SECRET_KEY="SA2MIKT7VTHKS6VVO4NBZKRPNIXSV2OC4XFVIS2MJJ7DIZ32EXFWN6YE"
PUBLIC_KEY="GCZWA2BB3HII3Q74ZLH2MMB7PSGWE34MIFDHGILGFRKOIFXG6MP4V3RI"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 StellarClips Smart Contract Deployment                 ║"
echo "║     Network: Stellar Testnet                               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo -e "${RED}❌ Error: soroban CLI not found${NC}"
    echo ""
    echo "Install Soroban CLI on your local machine:"
    echo ""
    echo "  1. Install Rust:"
    echo "     curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo ""
    echo "  2. Load Rust environment:"
    echo "     source \$HOME/.cargo/env"
    echo ""
    echo "  3. Add wasm target:"
    echo "     rustup target add wasm32-unknown-unknown"
    echo ""
    echo "  4. Install Soroban CLI:"
    echo "     cargo install --locked soroban-cli"
    echo ""
    echo "  5. Verify:"
    echo "     soroban --version"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ soroban CLI found${NC}"
echo ""

# Display account info
echo -e "${BLUE}📋 Account Information:${NC}"
echo "   Network:     $NETWORK"
echo "   Public Key:  $PUBLIC_KEY"
echo "   Secret Key:  ${SECRET_KEY:0:10}...${SECRET_KEY: -10}"
echo ""

# All contracts to deploy
declare -a CONTRACTS=(
    "content_nft:Content NFT"
    "subscription:Subscription"
    "payment:Payment"
    "revenue:Revenue"
)

# Arrays to store deployed addresses
declare -a CONTRACT_NAMES
declare -a CONTRACT_ADDRESSES

echo -e "${YELLOW}⏳ Deploying contracts...${NC}"
echo ""

SUCCESS=0
FAILED=0

# Deploy each contract
for contract_pair in "${CONTRACTS[@]}"; do
    IFS=':' read -r CONTRACT_DIR CONTRACT_NAME <<< "$contract_pair"
    
    WASM_PATH="$CONTRACT_DIR/target/wasm32-unknown-unknown/release/${CONTRACT_DIR}_contract.wasm"
    
    # Check WASM file exists
    if [ ! -f "$WASM_PATH" ]; then
        echo -e "${RED}❌ $CONTRACT_NAME: WASM not found at $WASM_PATH${NC}"
        echo "   Please run: ./build.sh"
        ((FAILED++))
        continue
    fi
    
    WASM_SIZE=$(du -h "$WASM_PATH" | cut -f1)
    echo -e "${BLUE}📦 Deploying $CONTRACT_NAME Contract${NC}"
    echo "   File: $WASM_PATH"
    echo "   Size: $WASM_SIZE"
    
    # Deploy contract
    echo "   Status: Sending to chain..."
    
    if DEPLOY_OUTPUT=$(soroban contract deploy \
        --wasm "$WASM_PATH" \
        --source-account "$SECRET_KEY" \
        --network "$NETWORK" 2>&1); then
        
        CONTRACT_ID=$(echo "$DEPLOY_OUTPUT" | grep -oE '^C[A-Z0-9]{55,}$' | head -1)
        
        if [ -z "$CONTRACT_ID" ]; then
            # Try to extract from the last line
            CONTRACT_ID=$(echo "$DEPLOY_OUTPUT" | tail -1)
        fi
        
        if [[ $CONTRACT_ID =~ ^C[A-Z0-9]{55,}$ ]]; then
            echo -e "${GREEN}✅ Deployed successfully!${NC}"
            echo "   Contract ID: $CONTRACT_ID"
            CONTRACT_NAMES+=("$CONTRACT_NAME")
            CONTRACT_ADDRESSES+=("$CONTRACT_ID")
            ((SUCCESS++))
        else
            echo -e "${YELLOW}⚠️  Deployment status unclear${NC}"
            echo "   Output: $DEPLOY_OUTPUT"
            ((FAILED++))
        fi
    else
        echo -e "${RED}❌ Deployment failed${NC}"
        echo "   Error: $DEPLOY_OUTPUT"
        ((FAILED++))
    fi
    
    echo ""
done

# Summary
echo "═══════════════════════════════════════════════════════════════"
echo -e "${BLUE}📊 DEPLOYMENT SUMMARY${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo "Success: $SUCCESS | Failed: $FAILED"
echo ""

if [ $SUCCESS -gt 0 ]; then
    echo -e "${GREEN}✅ Deployed Contracts:${NC}"
    echo ""
    
    for i in "${!CONTRACT_NAMES[@]}"; do
        echo "${CONTRACT_NAMES[$i]}: ${CONTRACT_ADDRESSES[$i]}"
    done
    
    echo ""
    echo -e "${YELLOW}📝 Next Steps:${NC}"
    echo ""
    echo "1. Create/Update .env.local with these values:"
    echo ""
    echo "   NEXT_PUBLIC_STELLAR_NETWORK=testnet"
    echo "   NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org"
    echo "   NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org"
    echo ""
    
    for i in "${!CONTRACT_NAMES[@]}"; do
        NAME=${CONTRACT_NAMES[$i]^^}  # Convert to uppercase
        NAME=${NAME// /_}  # Replace spaces with underscores
        ADDR=${CONTRACT_ADDRESSES[$i]}
        echo "   NEXT_PUBLIC_${NAME}_CONTRACT=$ADDR"
    done
    
    echo ""
    echo "2. Update lib/stellar-config.ts with contract addresses"
    echo ""
    echo "3. Start the application:"
    echo "   npm install"
    echo "   npm run dev"
    echo ""
else
    echo -e "${RED}❌ No contracts deployed successfully${NC}"
    echo "Troubleshooting:"
    echo "  • Verify account is funded: https://stellar.expert/testnet/friendbot"
    echo "  • Check network connectivity"
    echo "  • Verify WASM files exist: ./build.sh"
    exit 1
fi

echo "═══════════════════════════════════════════════════════════════"
