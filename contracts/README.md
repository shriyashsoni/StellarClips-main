# Soroban Smart Contracts

This directory contains the Soroban smart contracts for the StellarClips platform.

## Contracts

### 1. Content NFT Contract (`content_nft`)
Manages content as NFTs on the Stellar blockchain.

**Key Functions:**
- `mint_content()` - Create new content NFT
- `get_content()` - Retrieve content metadata
- `update_content_uri()` - Update content metadata URI
- `update_price()` - Update content price
- `get_creator_contents()` - Get all content for a creator

### 2. Subscription Contract (`subscription`)
Handles creator subscriptions and tier management.

**Key Functions:**
- `create_tier()` - Create subscription tier
- `subscribe()` - Subscribe to a creator
- `is_subscribed()` - Check subscription status
- `get_subscription()` - Get subscription details
- `cancel_subscription()` - Cancel subscription
- `renew_subscription()` - Renew subscription
- `get_tier()` - Get tier information

### 3. Payment Contract (`payment`)
Processes payments and tips with automatic fee distribution.

**Key Functions:**
- `initialize()` - Set up platform address and token
- `pay_for_content()` - Process content purchase
- `send_tip()` - Send tip to creator
- `get_payment()` - Get payment details

**Platform Fee:** 5% (500 basis points)

### 4. Revenue Contract (`revenue`)
Manages creator earnings and withdrawals.

**Key Functions:**
- `initialize()` - Set up token address
- `record_earning()` - Record creator earnings
- `withdraw()` - Withdraw available balance
- `get_balance()` - Get full balance details
- `get_available_balance()` - Get available balance only

**Minimum Withdrawal:** 1 XLM

## Building Contracts

\`\`\`bash
# Build all contracts
cd contracts/content_nft && cargo build --target wasm32-unknown-unknown --release
cd ../subscription && cargo build --target wasm32-unknown-unknown --release
cd ../payment && cargo build --target wasm32-unknown-unknown --release
cd ../revenue && cargo build --target wasm32-unknown-unknown --release
\`\`\`

## Deploying Contracts

\`\`\`bash
# Install Soroban CLI
cargo install --locked soroban-cli

# Deploy content NFT contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/content_nft_contract.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet

# Deploy other contracts similarly
\`\`\`

## Testing

\`\`\`bash
# Run tests for each contract
cd contracts/content_nft && cargo test
cd ../subscription && cargo test
cd ../payment && cargo test
cd ../revenue && cargo test
\`\`\`

## Contract Addresses (Testnet)

After deployment, update these addresses in your environment variables:

\`\`\`env
NEXT_PUBLIC_CONTENT_NFT_CONTRACT=<contract_address>
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT=<contract_address>
NEXT_PUBLIC_PAYMENT_CONTRACT=<contract_address>
NEXT_PUBLIC_REVENUE_CONTRACT=<contract_address>
\`\`\`

## Events

All contracts emit events for indexing:

### Content NFT Events
- `content_minted` - New content created
- `content_updated` - Content metadata updated
- `price_updated` - Content price changed

### Subscription Events
- `tier_created` - New subscription tier
- `subscribed` - User subscribed
- `subscription_cancelled` - Subscription cancelled
- `subscription_renewed` - Subscription renewed

### Payment Events
- `payment_processed` - Content payment completed
- `tip_sent` - Tip sent to creator

### Revenue Events
- `earning_recorded` - Earnings added
- `withdrawal_processed` - Withdrawal completed

## Security Considerations

1. **Access Control**: All state-changing functions require authentication
2. **Input Validation**: All inputs are validated before processing
3. **Safe Math**: All arithmetic operations use safe math to prevent overflow
4. **Reentrancy Protection**: Contracts follow checks-effects-interactions pattern
5. **Event Logging**: All important actions emit events for transparency

## Integration

These contracts are designed to work together:

1. **Content Creation Flow**: Content NFT → Revenue (record earning)
2. **Payment Flow**: Payment → Revenue (record earning)
3. **Subscription Flow**: Subscription → Payment → Revenue
4. **Withdrawal Flow**: Revenue → Token Transfer

## Support

For questions or issues, please refer to the Soroban documentation:
- https://soroban.stellar.org/docs
- https://developers.stellar.org/docs
