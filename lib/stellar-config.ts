// Stellar Network Configuration

const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet"

const TESTNET_DEPLOYED_CONTRACTS = {
  CONTENT_NFT_CONTRACT: "CCZOU3GEW4OCJQR5W5JGTZYMOEBFHC2UAJFCE7JNKD7BYJGXYXXWEHDK",
  SUBSCRIPTION_CONTRACT: "CAOLNGMO6NMBZWFZBDBTBBOQSJ4XPMP34E7YPPZZBB5SVCRTL4NR7YOO",
  PAYMENT_CONTRACT: "CA7DX6OT3A6Q34L647OMLJC7XX77IZ4PZEV6VOGZDV7E2DFMI62C22D7",
  REVENUE_CONTRACT: "CA7LK2OJP5KWP534UKPIN5RWJ4XCZGONNE27YUFO7FLEUAPQMUYQ6OE7",
} as const

export const STELLAR_CONFIG = {
  // Network settings
  NETWORK,
  HORIZON_URL:
    process.env.NEXT_PUBLIC_HORIZON_URL ||
    (NETWORK === "mainnet"
      ? "https://horizon.stellar.org"
      : "https://horizon-testnet.stellar.org"),

  // Soroban RPC endpoints
  SOROBAN_RPC_URL:
    process.env.NEXT_PUBLIC_STELLAR_RPC_URL ||
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
    (NETWORK === "mainnet"
      ? "https://soroban-rpc.stellar.org"
      : "https://soroban-testnet.stellar.org"),

  // Contract addresses (deployed on testnet)
  CONTRACTS: {
    CONTENT_NFT_CONTRACT:
      process.env.NEXT_PUBLIC_CONTENT_NFT_CONTRACT || (NETWORK === "testnet" ? TESTNET_DEPLOYED_CONTRACTS.CONTENT_NFT_CONTRACT : ""),
    SUBSCRIPTION_CONTRACT:
      process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT ||
      (NETWORK === "testnet" ? TESTNET_DEPLOYED_CONTRACTS.SUBSCRIPTION_CONTRACT : ""),
    PAYMENT_CONTRACT:
      process.env.NEXT_PUBLIC_PAYMENT_CONTRACT || (NETWORK === "testnet" ? TESTNET_DEPLOYED_CONTRACTS.PAYMENT_CONTRACT : ""),
    REVENUE_CONTRACT:
      process.env.NEXT_PUBLIC_REVENUE_CONTRACT || (NETWORK === "testnet" ? TESTNET_DEPLOYED_CONTRACTS.REVENUE_CONTRACT : ""),
  },

  // Platform settings
  PLATFORM_FEE_PERCENT: 2.5,
  MIN_TIP_AMOUNT: 0.1, // XLM
  MIN_CONTENT_PRICE: 0.5, // XLM
  MAX_CONTENT_PRICE: 1000, // XLM

  // Asset codes
  NATIVE_ASSET: "XLM",
} as const

export const STELLAR_NETWORK_PASSPHRASE =
  STELLAR_CONFIG.NETWORK === "mainnet"
    ? "Public Global Stellar Network ; September 2015"
    : "Test SDF Network ; September 2015"
