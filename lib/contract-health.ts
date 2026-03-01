const REQUIRED_CONTRACT_ENV_KEYS = [
  "NEXT_PUBLIC_CONTENT_NFT_CONTRACT",
  "NEXT_PUBLIC_SUBSCRIPTION_CONTRACT",
  "NEXT_PUBLIC_PAYMENT_CONTRACT",
  "NEXT_PUBLIC_REVENUE_CONTRACT",
] as const

export interface ContractHealth {
  network: string
  configured: number
  total: number
  isReady: boolean
  missingKeys: string[]
}

export function getContractHealth(): ContractHealth {
  const missingKeys = REQUIRED_CONTRACT_ENV_KEYS.filter((key) => !process.env[key])

  return {
    network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet",
    configured: REQUIRED_CONTRACT_ENV_KEYS.length - missingKeys.length,
    total: REQUIRED_CONTRACT_ENV_KEYS.length,
    isReady: missingKeys.length === 0,
    missingKeys,
  }
}
