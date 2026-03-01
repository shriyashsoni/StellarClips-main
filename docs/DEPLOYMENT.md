# Deployment Guide

## Prerequisites

1. Node.js 20+
2. pnpm
3. Stellar account (testnet or mainnet)
4. Soroban CLI (for contract deployment)

## Environment Variables

Copy `.env.example` to `.env.local` and fill contract IDs.

Required frontend variables:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

NEXT_PUBLIC_CONTENT_NFT_CONTRACT=
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT=
NEXT_PUBLIC_PAYMENT_CONTRACT=
NEXT_PUBLIC_REVENUE_CONTRACT=
```

Compatibility alias (optional):

```env
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
```

Optional server-side/indexer variables:

```env
DATABASE_URL=
IPFS_API_URL=
IPFS_GATEWAY_URL=
PINATA_API_KEY=
PINATA_SECRET_KEY=
```

## Smart Contract Deployment

From repository root:

```bash
pnpm preflight
cd contracts
./build.sh
./deploy.sh testnet <source_account_or_secret>
```

Alternative scripts:

```bash
./deploy-testnet.sh <source_account_or_secret>
./deploy-via-rpc.sh testnet <source_account_or_secret>
node ./deploy-with-nodejs.js testnet <source_account_or_secret>
```

After deployment, copy contract IDs into `.env.local` and Vercel environment variables.

## Database Setup (If Using Indexer)

```bash
createdb stellarclips
psql -d stellarclips -f scripts/01-create-tables.sql
psql -d stellarclips -f scripts/02-create-functions.sql
```

## Vercel Deployment

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set all required `NEXT_PUBLIC_*` variables.
4. Deploy.

Recommended Vercel settings:

- Framework Preset: `Next.js`
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Node.js: `20.x` or newer

Notes:

- `.vercelignore` excludes heavy local artifacts (`contracts/**/target`) to keep deployment lean.
- If you switch to `mainnet`, update network and all contract IDs together.

## Verification

Before deploying:

```bash
pnpm install
pnpm build
pnpm audit --prod
```

Post-deploy checks:

1. Connect wallet from app UI.
2. Load `/browse` and `/dashboard`.
3. Execute one on-chain action (tip or purchase) on testnet.
4. Verify transaction on Stellar Expert.
