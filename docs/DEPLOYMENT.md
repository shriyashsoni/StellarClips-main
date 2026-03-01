# Deployment Guide

## Prerequisites

1. Node.js 20+ installed
2. PostgreSQL database
3. Stellar account (testnet or mainnet)
4. IPFS node or Pinata account (optional)

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/stellarclips

# Stellar Network
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Smart Contract Addresses (deploy contracts first)
NEXT_PUBLIC_CONTENT_NFT_CONTRACT=
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT=
NEXT_PUBLIC_PAYMENT_CONTRACT=
NEXT_PUBLIC_REVENUE_CONTRACT=

# Platform Configuration
NEXT_PUBLIC_PLATFORM_FEE_PERCENT=5
NEXT_PUBLIC_PLATFORM_ADDRESS=

# IPFS (optional)
IPFS_API_URL=https://ipfs.infura.io:5001
IPFS_GATEWAY_URL=https://ipfs.io/ipfs/
PINATA_API_KEY=
PINATA_SECRET_KEY=
\`\`\`

## Database Setup

1. Create PostgreSQL database:
\`\`\`bash
createdb stellarclips
\`\`\`

2. Run migrations:
\`\`\`bash
psql -d stellarclips -f scripts/01-create-tables.sql
psql -d stellarclips -f scripts/02-seed-data.sql
psql -d stellarclips -f scripts/03-rls-policies.sql
\`\`\`

## Smart Contract Deployment

1. Install Soroban CLI:
\`\`\`bash
cargo install --locked soroban-cli
\`\`\`

2. Build contracts:
\`\`\`bash
cd contracts
./build.sh
\`\`\`

3. Deploy contracts:
\`\`\`bash
./deploy.sh testnet
\`\`\`

4. Update `.env.local` with deployed contract addresses

## Application Deployment

### Local Development

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

### Production (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Recommended Vercel settings:
- Framework preset: `Next.js`
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Node.js version: `20.x` or newer

Important:
- Do not commit `contracts/**/target` artifacts. They can make deployments too large and slow.

### Docker Deployment

\`\`\`bash
docker-compose up -d
\`\`\`

## Start Indexer Service

The indexer listens for blockchain events and updates the database:

\`\`\`bash
npm run indexer
\`\`\`

For production, use a process manager like PM2:

\`\`\`bash
pm2 start scripts/start-indexer.ts --name stellarclips-indexer
\`\`\`

## Monitoring

- Check indexer logs: `pm2 logs stellarclips-indexer`
- Monitor database: Use pgAdmin or similar tools
- Track blockchain events: Use Stellar Expert or similar explorers

## Troubleshooting

### Indexer not receiving events
- Verify Horizon URL is correct
- Check network connectivity
- Ensure contract addresses are correct

### Transactions failing
- Verify wallet has sufficient XLM for fees
- Check contract is deployed correctly
- Validate transaction parameters

### Database connection issues
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure database exists and migrations ran
