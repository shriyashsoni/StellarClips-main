# Deploy StellarClips Contracts to Stellar Testnet

This guide deploys all Soroban contracts securely using local credentials (no hardcoded keys).

## Prerequisites

- Rust + Cargo installed
- Soroban CLI installed: `cargo install --locked soroban-cli`
- WASM target installed: `rustup target add wasm32-unknown-unknown`
- Funded testnet account (Friendbot): https://stellar.expert/testnet/friendbot

## 1) Build Contracts

```bash
cd contracts
./build.sh
```

## 2) Deploy Contracts

Use either an identity configured in Soroban CLI or a secret key.

### Option A: pass source as argument

```bash
cd contracts
./deploy-testnet.sh <source>
```

### Option B: pass source via environment variable

```bash
cd contracts
SOROBAN_SOURCE=<source> ./deploy-testnet.sh
```

The script prints contract IDs in env format:

```bash
NEXT_PUBLIC_CONTENT_NFT_CONTRACT=...
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT=...
NEXT_PUBLIC_PAYMENT_CONTRACT=...
NEXT_PUBLIC_REVENUE_CONTRACT=...
```

## 3) Configure Frontend

Create/update `.env.local` in the repository root:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org

NEXT_PUBLIC_CONTENT_NFT_CONTRACT=CD...
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT=CD...
NEXT_PUBLIC_PAYMENT_CONTRACT=CD...
NEXT_PUBLIC_REVENUE_CONTRACT=CD...
```

Then restart the app:

```bash
pnpm dev
```

## Troubleshooting

- `soroban: command not found`
  - Ensure cargo bin path is loaded: `source $HOME/.cargo/env`
- `Missing source account/secret`
  - Provide source via argument or `SOROBAN_SOURCE`.
- `WASM file not found`
  - Run `./build.sh` before deployment.
- `Account not found` / insufficient balance
  - Fund the account with Friendbot and retry.

## Security Notes

- Never commit secret keys to git.
- Prefer local environment variables or CLI identities.
- Use testnet for verification before mainnet deployment.
