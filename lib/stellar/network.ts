"use client"

import { Networks } from "@stellar/stellar-sdk"

export type StellarNetwork = "testnet" | "mainnet"

const ACTIVE_NETWORK_KEY = "stellar_active_network"
const NETWORK_CHANGED_EVENT = "stellar-network-changed"

function envDefaultNetwork(): StellarNetwork {
  return process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet" ? "mainnet" : "testnet"
}

export function getActiveNetwork(): StellarNetwork {
  if (typeof window === "undefined") {
    return envDefaultNetwork()
  }

  const stored = window.localStorage.getItem(ACTIVE_NETWORK_KEY)
  if (stored === "mainnet" || stored === "testnet") {
    return stored
  }

  return envDefaultNetwork()
}

export function setActiveNetwork(network: StellarNetwork) {
  if (typeof window === "undefined") return

  window.localStorage.setItem(ACTIVE_NETWORK_KEY, network)
  window.dispatchEvent(new CustomEvent(NETWORK_CHANGED_EVENT, { detail: { network } }))
}

export function onActiveNetworkChanged(listener: (network: StellarNetwork) => void): () => void {
  if (typeof window === "undefined") {
    return () => {}
  }

  const handler = (event: Event) => {
    const custom = event as CustomEvent<{ network?: StellarNetwork }>
    const network = custom.detail?.network || getActiveNetwork()
    listener(network)
  }

  const storageHandler = (event: StorageEvent) => {
    if (event.key !== ACTIVE_NETWORK_KEY) return
    listener(getActiveNetwork())
  }

  window.addEventListener(NETWORK_CHANGED_EVENT, handler as EventListener)
  window.addEventListener("storage", storageHandler)

  return () => {
    window.removeEventListener(NETWORK_CHANGED_EVENT, handler as EventListener)
    window.removeEventListener("storage", storageHandler)
  }
}

export function getNetworkPassphrase(network: StellarNetwork): string {
  return network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET
}

export function getSorobanRpcUrl(network: StellarNetwork): string {
  if (network === "mainnet") {
    return process.env.NEXT_PUBLIC_MAINNET_STELLAR_RPC_URL || process.env.NEXT_PUBLIC_MAINNET_SOROBAN_RPC_URL || "https://soroban-rpc.stellar.org"
  }

  return process.env.NEXT_PUBLIC_STELLAR_RPC_URL || process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org"
}

export function getHorizonUrl(network: StellarNetwork): string {
  if (network === "mainnet") {
    return process.env.NEXT_PUBLIC_MAINNET_HORIZON_URL || "https://horizon.stellar.org"
  }

  return process.env.NEXT_PUBLIC_HORIZON_URL || "https://horizon-testnet.stellar.org"
}
