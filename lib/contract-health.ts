import { STELLAR_CONFIG } from "@/lib/stellar-config"

const CONTRACT_KEY_MAP = {
  NEXT_PUBLIC_CONTENT_NFT_CONTRACT: "CONTENT_NFT_CONTRACT",
  NEXT_PUBLIC_SUBSCRIPTION_CONTRACT: "SUBSCRIPTION_CONTRACT",
  NEXT_PUBLIC_PAYMENT_CONTRACT: "PAYMENT_CONTRACT",
  NEXT_PUBLIC_REVENUE_CONTRACT: "REVENUE_CONTRACT",
} as const

const REQUIRED_CONTRACT_ENV_KEYS = Object.keys(CONTRACT_KEY_MAP) as Array<keyof typeof CONTRACT_KEY_MAP>

export interface ContractHealth {
  network: string
  configured: number
  total: number
  isReady: boolean
  missingKeys: string[]
}

export function getContractHealth(): ContractHealth {
  const missingKeys = REQUIRED_CONTRACT_ENV_KEYS.filter((envKey) => {
    const configKey = CONTRACT_KEY_MAP[envKey]
    return !STELLAR_CONFIG.CONTRACTS[configKey]
  })

  return {
    network: STELLAR_CONFIG.NETWORK,
    configured: REQUIRED_CONTRACT_ENV_KEYS.length - missingKeys.length,
    total: REQUIRED_CONTRACT_ENV_KEYS.length,
    isReady: missingKeys.length === 0,
    missingKeys,
  }
}
