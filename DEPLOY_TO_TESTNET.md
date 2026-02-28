# 📖 Deploy StellarClips to Stellar Testnet

## ⚡ Quick Start (5 minutes)

### On Your Local Machine:

```bash
# 1. Install Rust (if not installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 2. Add WASM target
rustup target add wasm32-unknown-unknown

# 3. Install Soroban CLI
cargo install --locked soroban-cli

# Verify installation
soroban --version
```

### Deploy Contracts:

```bash
# 1. Clone/navigate to project
cd StellarClips/contracts

# 2. Make deployment script executable
chmod +x deploy-testnet.sh

# 3. Run deployment
./deploy-testnet.sh
```

**That's it!** The script will deploy all 4 contracts and output the contract addresses.

---

## 🔐 Your Testnet Account

Use these credentials in the script:

```
Public Key:  GCZWA2BB3HII3Q74ZLH2MMB7PSGWE34MIFDHGILGFRKOIFXG6MP4V3RI
Secret Key:  SA2MIKT7VTHKS6VVO4NBZKRPNIXSV2OC4XFVIS2MJJ7DIZ32EXFWN6YE
Network:     Stellar Testnet
```

---

## 📋 Prerequisites Checklist

Before deploying, ensure:

- ✅ Rust installed: `rustc --version`
- ✅ Cargo installed: `cargo --version`
- ✅ Soroban CLI installed: `soroban --version`
- ✅ WASM target added: `rustup target list | grep wasm32`
- ✅ Testnet account funded: https://stellar.expert/testnet/friendbot

### Fund Your Account

Go here: https://stellar.expert/testnet/friendbot

Enter public key: `GCZWA2BB3HII3Q74ZLH2MMB7PSGWE34MIFDHGILGFRKOIFXG6MP4V3RI`

Each deployment requires ~0.01 XLM

---

## 🛠️ Manual Deployment (If Script Fails)

Deploy contracts one by one:

```bash
cd contracts

# Content NFT Contract
soroban contract deploy \
  --wasm content_nft/target/wasm32-unknown-unknown/release/content_nft_contract.wasm \
  --source-account SA2MIKT7VTHKS6VVO4NBZKRPNIXSV2OC4XFVIS2MJJ7DIZ32EXFWN6YE \
  --network testnet

# Subscription Contract
soroban contract deploy \
  --wasm subscription/target/wasm32-unknown-unknown/release/subscription_contract.wasm \
  --source-account SA2MIKT7VTHKS6VVO4NBZKRPNIXSV2OC4XFVIS2MJJ7DIZ32EXFWN6YE \
  --network testnet

# Payment Contract
soroban contract deploy \
  --wasm payment/target/wasm32-unknown-unknown/release/payment_contract.wasm \
  --source-account SA2MIKT7VTHKS6VVO4NBZKRPNIXSV2OC4XFVIS2MJJ7DIZ32EXFWN6YE \
  --network testnet

# Revenue Contract
soroban contract deploy \
  --wasm revenue/target/wasm32-unknown-unknown/release/revenue_contract.wasm \
  --source-account SA2MIKT7VTHKS6VVO4NBZKRPNIXSV2OC4XFVIS2MJJ7DIZ32EXFWN6YE \
  --network testnet
```

Each command outputs a contract address like: `CDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

---

## ✅ Current Verified Testnet Deployments

Contract links:

- Content NFT: https://stellar.expert/explorer/testnet/contract/CCZOU3GEW4OCJQR5W5JGTZYMOEBFHC2UAJFCE7JNKD7BYJGXYXXWEHDK
- Subscription: https://stellar.expert/explorer/testnet/contract/CAOLNGMO6NMBZWFZBDBTBBOQSJ4XPMP34E7YPPZZBB5SVCRTL4NR7YOO
- Payment: https://stellar.expert/explorer/testnet/contract/CA7DX6OT3A6Q34L647OMLJC7XX77IZ4PZEV6VOGZDV7E2DFMI62C22D7
- Revenue: https://stellar.expert/explorer/testnet/contract/CA7LK2OJP5KWP534UKPIN5RWJ4XCZGONNE27YUFO7FLEUAPQMUYQ6OE7

Deployment transaction links:

- Content NFT deploy tx: https://stellar.expert/explorer/testnet/tx/e9726da044dd1e51ff39098c4e91f369c38b71851b7785c372c9c47326367ce5
- Subscription deploy tx: https://stellar.expert/explorer/testnet/tx/deca6a14081580b3eb1e54e1d953bcdbb9c8a9a20236f70b0eba6f7e41c76eee
- Payment deploy tx: https://stellar.expert/explorer/testnet/tx/bbb0934e6dff246391a20f4302642698c57b67e2c3180bfd2e57abb2226d0dcc
- Revenue deploy tx: https://stellar.expert/explorer/testnet/tx/4722e4cbb67dfaf099e2f8be8b6a744329372b66acd1ec37032a5d411b466b3a

---

## 📝 After Deployment

Save all contract addresses and update your project:

### 1. Create `.env.local`

```env
# Network
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# YOUR DEPLOYED CONTRACTS (from deployment output)
NEXT_PUBLIC_CONTENT_NFT_CONTRACT=CD________
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT=CD________
NEXT_PUBLIC_PAYMENT_CONTRACT=CD________
NEXT_PUBLIC_REVENUE_CONTRACT=CD________

# Platform
NEXT_PUBLIC_PLATFORM_FEE_PERCENT=5
NEXT_PUBLIC_PLATFORM_ADDRESS=GCZWA2BB3HII3Q74ZLH2MMB7PSGWE34MIFDHGILGFRKOIFXG6MP4V3RI

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/stellarclips
```

### 2. Update `lib/stellar-config.ts`

```typescript
export const STELLAR_CONFIG = {
  NETWORK: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet",
  HORIZON_URL: process.env.NEXT_PUBLIC_HORIZON_URL,
  SOROBAN_RPC_URL: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL,
  CONTRACTS: {
    CONTENT_NFT_CONTRACT: process.env.NEXT_PUBLIC_CONTENT_NFT_CONTRACT,
    SUBSCRIPTION_CONTRACT: process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT,
    PAYMENT_CONTRACT: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT,
    REVENUE_CONTRACT: process.env.NEXT_PUBLIC_REVENUE_CONTRACT,
  },
  // ... rest of config
}
```

### 3. Start Application

```bash
npm install
npm run dev
```

---

## ❓ Troubleshooting

### "soroban: command not found"
```bash
source $HOME/.cargo/env
which soroban
# Should show: /path/to/.cargo/bin/soroban
```

### "Account not found" or "RPC error"
1. Verify account is funded: https://stellar.expert/testnet/friendbot
2. Check network connectivity
3. Verify secret key is correct

### "Insufficient funds"
Get more testnet XLM: https://stellar.expert/testnet/friendbot

### "WASM not found"
Build contracts first:
```bash
cd contracts
./build.sh
```

### "Connection timeout"
Try again - Testnet RPC might be slow. Wait 30 seconds and retry.

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| Stellar Docs | https://developers.stellar.org |
| Soroban Docs | https://developers.stellar.org/docs/learn/smart-contracts |
| Testnet Friendbot | https://stellar.expert/testnet/friendbot |
| Testnet RPC Status | https://soroban-testnet.stellar.org |
| Explorer | https://stellar.expert/testnet |

---

## 📝 Deployment Log

After successful deployment, save your contract addresses:

```
Content NFT:   CCZOU3GEW4OCJQR5W5JGTZYMOEBFHC2UAJFCE7JNKD7BYJGXYXXWEHDK
Subscription:  CAOLNGMO6NMBZWFZBDBTBBOQSJ4XPMP34E7YPPZZBB5SVCRTL4NR7YOO
Payment:       CA7DX6OT3A6Q34L647OMLJC7XX77IZ4PZEV6VOGZDV7E2DFMI62C22D7
Revenue:       CA7LK2OJP5KWP534UKPIN5RWJ4XCZGONNE27YUFO7FLEUAPQMUYQ6OE7
```

Keep these safe! You'll need them in `.env.local`

---

**Questions?** Check the full guides:
- `SMART_CONTRACT_DEPLOYMENT.md` - Complete deployment guide
- `DEPLOYMENT_QUICK_GUIDE.md` - Quick reference
