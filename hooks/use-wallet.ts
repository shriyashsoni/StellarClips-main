"use client"

import { useState, useEffect } from "react"
import { walletService, type WalletState, type WalletType } from "@/lib/stellar/wallet"

export function useWallet() {
  const [state, setState] = useState<WalletState>(walletService.getState())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("[v0] useWallet hook mounted")

    // Restore session on mount
    walletService.restoreSession()

    // Subscribe to wallet state changes
    const unsubscribe = walletService.subscribe((newState) => {
      console.log("[v0] Wallet state changed in hook:", newState)
      setState(newState)
    })

    return () => {
      console.log("[v0] useWallet hook unmounted")
      unsubscribe()
    }
  }, [])

  const connect = async (walletType: WalletType = "freighter") => {
    console.log("[v0] Connect function called with:", walletType)
    setIsLoading(true)
    setError(null)

    try {
      await walletService.connectWallet(walletType)
      console.log("[v0] Wallet connected successfully")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect wallet"
      console.error("[v0] Connect error:", message)
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = async () => {
    console.log("[v0] Disconnect function called")
    setIsLoading(true)
    setError(null)

    try {
      await walletService.disconnectWallet()
      console.log("[v0] Wallet disconnected successfully")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to disconnect wallet"
      console.error("[v0] Disconnect error:", message)
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    ...state,
    isLoading,
    error,
    connect,
    disconnect,
  }
}
