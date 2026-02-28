# StellarClips - Micro-Payments Platform for Content Creators

<div align="center">
  <!-- Using full blob URL for StellarClips logo so it displays on GitHub -->
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_fyjby2fyjby2fyjb-ml3FynuMx2aVQ0W1mAnw3EyxV49cle.png" alt="StellarClips Logo" width="200"/>
  
  # StellarClips
  ### Micro-Payments Platform for Content Creators
  
  [![Powered by Stellar](https://img.shields.io/badge/Powered%20by-Stellar-black?style=for-the-badge&logo=stellar)](https://stellar.org)
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
</div>

---

## 🌟 Overview

**StellarClips** is a revolutionary decentralized platform built on the Stellar blockchain that empowers content creators to monetize their work through micro-payments, subscriptions, and direct tips. With ultra-low fees and instant settlements, creators can finally earn what they deserve.

<div align="center">
  <!-- Using full blob URL for Stellar logo so it displays on GitHub -->
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7386716-KM6VnBlIw2oiRrvx88LVW16kCjmNVV.png" alt="Powered by Stellar" width="30"/>
  <strong>Powered by Stellar Blockchain</strong>
</div>

---

## ✨ Key Features

### 💰 **Pay-Per-Clip**
Users pay small amounts (micro-payments) to unlock individual content pieces. Perfect for premium articles, videos, tutorials, and exclusive content.

### 🔄 **Subscriptions**
Recurring subscriptions with prepaid pool pattern for predictable creator income. Support monthly and yearly tiers.

### 💝 **Direct Tips**
Fans can send tips directly to creators with 95% going to the creator (5% platform fee).

### ⚡ **Lightning Fast**
Instant payments via Stellar network with 3-5 second settlement times.

### 🔒 **Non-Custodial**
Users maintain full control of their funds. No intermediaries, no custody risks.

### 💸 **Ultra-Low Fees**
- Platform fee: 5%
- Stellar network fee: ~0.00001 XLM per transaction
- No hidden charges

---

## Features

- **Pay-Per-Clip**: Users pay small amounts to unlock individual content pieces
- **Subscriptions**: Recurring subscriptions with prepaid pool pattern
- **Tips**: Direct support for creators
- **Low Fees**: 5% platform fee, minimal blockchain fees
- **Fast Settlements**: Instant payments via Stellar network
- **Non-Custodial**: Users maintain control of their funds

## 🛠️ Tech Stack

### Frontend
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components

### Blockchain
- Stellar blockchain (Testnet/Mainnet)
- Soroban smart contracts (Rust)
- Stellar SDK for JavaScript

### Backend
- Node.js
- PostgreSQL database
- Horizon API indexer
- REST API

### Storage
- IPFS for content storage
- PostgreSQL for metadata

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| **Blockchain** | Stellar, Soroban Smart Contracts (Rust), Stellar SDK |
| **Backend** | Node.js, Express, PostgreSQL, Horizon API |
| **Storage** | IPFS, PostgreSQL |
| **Wallets** | Freighter, Albedo, xBull, Rabet |

</div>

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js** 18+ ([Download](https://nodejs.org))
- ✅ **PostgreSQL** 14+ ([Download](https://www.postgresql.org))
- ✅ **Rust & Cargo** (for smart contracts) ([Install](https://rustup.rs))
- ✅ **Stellar Account** ([Create on Testnet](https://laboratory.stellar.org/#account-creator))

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/stellarclips.git
cd stellarclips
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
bun install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration:
\`\`\`env
# Stellar Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Smart Contract Addresses (after deployment)
NEXT_PUBLIC_CONTENT_NFT_CONTRACT=C...
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT=C...
NEXT_PUBLIC_PAYMENT_CONTRACT=C...
NEXT_PUBLIC_REVENUE_CONTRACT=C...

# Database (Optional - for Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
\`\`\`

4. Set up database:
\`\`\`bash
# Create database
createdb stellarclips

# Run migrations
psql -d stellarclips -f scripts/01-create-tables.sql
psql -d stellarclips -f scripts/02-create-functions.sql
\`\`\`

5. Build and deploy smart contracts:
\`\`\`bash
cd contracts
chmod +x build.sh deploy.sh
./build.sh
./deploy.sh testnet
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

7. Start the indexer (optional, in separate terminal):
\`\`\`bash
npm run indexer
\`\`\`

Visit **http://localhost:3000** 🎉

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Rust and Cargo (for smart contracts)
- Stellar account

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/stellarclips.git
cd stellarclips
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your configuration
\`\`\`

4. Set up database:
\`\`\`bash
psql -d stellarclips -f scripts/01-create-tables.sql
psql -d stellarclips -f scripts/02-seed-data.sql
psql -d stellarclips -f scripts/03-rls-policies.sql
\`\`\`

5. Build and deploy smart contracts:
\`\`\`bash
cd contracts
./build.sh
./deploy.sh testnet
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

7. Start the indexer (in a separate terminal):
\`\`\`bash
npm run indexer
\`\`\`

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

\`\`\`
stellarclips/
├── 📱 app/                    # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── content/         # Content CRUD
│   │   ├── purchases/       # Purchase tracking
│   │   ├── subscriptions/   # Subscription management
│   │   └── earnings/        # Creator earnings
│   ├── browse/              # Content discovery page
│   ├── content/[id]/        # Content viewer
│   ├── dashboard/           # Creator dashboard
│   ├── profile/             # User profile
│   ├── about/               # About page
│   └── whitepaper/          # Whitepaper page
├── 🎨 components/            # React components
│   ├── browse/              # Browse components
│   ├── content/             # Content viewer components
│   ├── dashboard/           # Dashboard components
│   ├── profile/             # Profile components
│   └── ui/                  # Reusable UI components
├── 📜 contracts/             # Soroban smart contracts (Rust)
│   ├── content_nft/         # Content NFT contract
│   ├── subscription/        # Subscription contract
│   ├── payment/             # Payment processing
│   └── revenue/             # Revenue distribution
├── 🔧 lib/                   # Utility libraries
│   ├── indexer/             # Blockchain event indexer
│   ├── services/            # Business logic
│   ├── stellar/             # Stellar SDK utilities
│   └── types.ts             # TypeScript types
├── 🗄️ scripts/               # Database & deployment scripts
│   ├── 01-create-tables.sql
│   └── 02-create-functions.sql
└── 📚 public/                # Static assets
    ├── stellarclips-logo.png
    └── stellar-logo.png
\`\`\`

## Project Structure

\`\`\`
stellarclips/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── browse/            # Content discovery
│   ├── content/           # Content viewer
│   ├── dashboard/         # Creator dashboard
│   └── profile/           # User profile
├── components/            # React components
│   ├── browse/           # Browse page components
│   ├── content/          # Content viewer components
│   ├── dashboard/        # Dashboard components
│   └── profile/          # Profile components
├── contracts/            # Soroban smart contracts
│   ├── content_nft/     # Content NFT contract
│   ├── subscription/    # Subscription contract
│   ├── payment/         # Payment contract
│   └── revenue/         # Revenue distribution contract
├── lib/                 # Utility libraries
│   ├── indexer/        # Blockchain event indexer
│   ├── services/       # Business logic services
│   └── stellar/        # Stellar SDK utilities
├── scripts/            # Database and deployment scripts
└── docs/              # Documentation

\`\`\`

## 🔐 Smart Contracts

### 1. **Content NFT Contract** (`content_nft.rs`)
Manages content as NFTs with metadata and ownership tracking.

**Key Functions:**
- `mint_content()` - Create new content NFT
- `get_content_info()` - Retrieve content details
- `transfer_ownership()` - Transfer content ownership

### Content NFT Contract
Manages content as NFTs with metadata and ownership.

### 2. **Subscription Contract** (`subscription.rs`)
Handles subscription tiers and recurring payments using prepaid pool pattern.

**Key Functions:**
- `create_subscription_tier()` - Creator sets up tiers
- `subscribe()` - User subscribes to creator
- `check_subscription()` - Verify active subscription
- `cancel_subscription()` - End subscription

### Subscription Contract
Handles subscription tiers and recurring payments using prepaid pool pattern.

### 3. **Payment Contract** (`payment.rs`)
Processes one-time payments with automatic 5% platform fee distribution.

**Key Functions:**
- `process_payment()` - Handle content purchase
- `send_tip()` - Send tip to creator
- `get_payment_history()` - Retrieve transactions

### Payment Contract
Processes one-time payments with automatic platform fee distribution.

### 4. **Revenue Contract** (`revenue.rs`)
Manages creator earnings and withdrawals.

**Key Functions:**
- `record_earning()` - Track creator earnings
- `withdraw()` - Creator withdraws funds
- `get_balance()` - Check available balance

### Revenue Contract
Manages creator earnings and withdrawals.

## Smart Contracts

- **Content NFT Contract**: Manages content as NFTs with metadata and ownership.
- **Subscription Contract**: Handles subscription tiers and recurring payments using prepaid pool pattern.
- **Payment Contract**: Processes one-time payments with automatic platform fee distribution.
- **Revenue Contract**: Manages creator earnings and withdrawals.

## 🔌 API Documentation

### Content API

**GET** `/api/content` - List all content
**GET** `/api/content/:id` - Get content details
**POST** `/api/content` - Create new content (creator only)
**PUT** `/api/content/:id` - Update content (creator only)
**DELETE** `/api/content/:id` - Delete content (creator only)

### Purchases API

**GET** `/api/purchases` - Get user purchases
**POST** `/api/purchases` - Record new purchase
**GET** `/api/purchases/check?contentId=xxx&userId=xxx` - Check purchase status

### Subscriptions API

**GET** `/api/subscriptions` - Get user subscriptions
**POST** `/api/subscriptions` - Create subscription
**POST** `/api/subscriptions/:id/cancel` - Cancel subscription
**POST** `/api/subscriptions/:id/renew` - Renew subscription

### Earnings API

**GET** `/api/earnings` - Get creator earnings
**POST** `/api/earnings/withdraw` - Withdraw earnings

## API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

## 🗃️ Database Schema

\`\`\`sql
-- Users table
users (id, wallet_address, username, email, created_at)

-- Creators table
creators (id, user_id, bio, profile_image, total_earnings)

-- Clips/Content table
clips (id, creator_id, title, description, content_uri, price, duration, views, created_at)

-- Purchases table
purchases (id, user_id, clip_id, amount, transaction_hash, created_at)

-- Subscriptions table
subscriptions (id, user_id, creator_id, tier_id, start_date, end_date, status)

-- Tips table
tips (id, from_user_id, to_creator_id, amount, message, transaction_hash, created_at)

-- Blockchain events table
blockchain_events (id, event_type, contract_address, transaction_hash, data, processed, created_at)
\`\`\`

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## 🎯 Usage Guide

### For Creators

1. **Connect Wallet** - Click "Connect Wallet" and select your Stellar wallet
2. **Access Dashboard** - Navigate to Dashboard after connecting
3. **Upload Content** - Click "Upload Content" and fill in details
4. **Set Pricing** - Choose pay-per-view price or subscription tier
5. **Publish** - Content is minted as NFT on Stellar blockchain
6. **Track Earnings** - View real-time earnings in Dashboard
7. **Withdraw Funds** - Withdraw earnings to your wallet anytime

### For Users

1. **Connect Wallet** - Connect your Stellar wallet (Freighter, Albedo, etc.)
2. **Browse Content** - Explore content on the Browse page
3. **Purchase Content** - Click "Unlock" to pay and access content
4. **Subscribe to Creators** - Subscribe for unlimited access to creator's content
5. **Send Tips** - Support creators with direct tips
6. **View History** - Check your purchases and subscriptions in Profile

## Security

- Non-custodial wallet integration
- Row Level Security (RLS) on database
- Content hash verification
- Smart contract access controls
- Rate limiting on API endpoints

## 🔒 Security Features

- ✅ **Non-custodial wallet integration** - Users control their private keys
- ✅ **Row Level Security (RLS)** - Database-level access control
- ✅ **Content hash verification** - IPFS content integrity
- ✅ **Smart contract access controls** - Only authorized actions
- ✅ **Rate limiting** - API endpoint protection
- ✅ **Input validation** - Prevent injection attacks

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy Smart Contracts

\`\`\`bash
cd contracts
./deploy.sh mainnet
\`\`\`

Update contract addresses in environment variables.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support, please open an issue on GitHub.

## 💬 Support & Community

- 📧 **Email**: support@stellarclips.com
- 🐦 **Twitter**: [@StellarClips](https://twitter.com/stellarclips)
- 💬 **Discord**: [Join our community](https://discord.gg/stellarclips)
- 📖 **Documentation**: [docs.stellarclips.com](https://docs.stellarclips.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/stellarclips/issues)

## Acknowledgments

- Stellar Development Foundation
- Soroban smart contract platform
- shadcn/ui component library
- Next.js
- Vercel

## 🙏 Acknowledgments

- [Stellar Development Foundation](https://stellar.org) - Blockchain infrastructure
- [Soroban](https://soroban.stellar.org) - Smart contract platform
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Next.js](https://nextjs.org) - React framework
- [Vercel](https://vercel.com) - Deployment platform

---

<div align="center">
  <!-- Using full blob URL for Stellar logo in footer -->
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7386716-KM6VnBlIw2oiRrvx88LVW16kCjmNVV.png" alt="Stellar" width="24"/>
  <p><strong>Built with ❤️ on Stellar Blockchain</strong></p>
  <p>© 2025 StellarClips. All rights reserved.</p>
</div>
