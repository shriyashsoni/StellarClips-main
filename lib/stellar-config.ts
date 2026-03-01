// Stellar Network Configuration

export const STELLAR_CONFIG = {
  // Network settings
  NETWORK: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet",
  HORIZON_URL:
    process.env.NEXT_PUBLIC_HORIZON_URL ||
    (process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet"
      ? "https://horizon.stellar.org"
      : "https://horizon-testnet.stellar.org"),

  // Soroban RPC endpoints
  SOROBAN_RPC_URL:
    process.env.NEXT_PUBLIC_STELLAR_RPC_URL ||
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
    (process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet"
      ? "https://soroban-rpc.stellar.org"
      : "https://soroban-testnet.stellar.org"),

  // Contract addresses (deployed on testnet)
  CONTRACTS: {
    CONTENT_NFT_CONTRACT: process.env.NEXT_PUBLIC_CONTENT_NFT_CONTRACT || "",
    SUBSCRIPTION_CONTRACT: process.env.NEXT_PUBLIC_SUBSCRIPTION_CONTRACT || "",
    PAYMENT_CONTRACT: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT || "",
    REVENUE_CONTRACT: process.env.NEXT_PUBLIC_REVENUE_CONTRACT || "",
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
