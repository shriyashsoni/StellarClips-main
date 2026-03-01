"use client"

import { getActiveNetwork } from "./network"

export type WalletType = "freighter" | "albedo" | "xbull" | "rabet"

export interface WalletState {
  publicKey: string | null
  isConnected: boolean
  walletType: WalletType | null
}

export interface WalletInfo {
  type: WalletType
  name: string
  description: string
  installUrl: string
  isInstalled: boolean
}

type DynamicWalletProvider = Record<string, any>

function getFreighterProvider(): DynamicWalletProvider | null {
  if (typeof window === "undefined") return null

  const win = window as any
  return win.freighter || win.freighterApi || win.freighterAPI || win.stellar?.freighter || null
}

function getXBullProvider(): DynamicWalletProvider | null {
  if (typeof window === "undefined") return null

  const win = window as any
  return win.xBullSDK || win.xbull || win.xbullSDK || null
}

function getRabetProvider(): DynamicWalletProvider | null {
  if (typeof window === "undefined") return null

  const win = window as any
  return win.rabet || win.rabetApi || null
}

function extractAddress(value: any): string | null {
  if (!value) return null
  if (typeof value === "string") return value

  return value.publicKey || value.address || value.account || value.pubkey || null
}

function extractSignedXdr(value: any): string | null {
  if (!value) return null
  if (typeof value === "string") return value

  return (
    value.signedXDR ||
    value.signedXdr ||
    value.signedTransaction ||
    value.signedTxXdr ||
    value.xdr ||
    value.signed_envelope_xdr ||
    null
  )
}

export function detectInstalledWallets(): WalletInfo[] {
  if (typeof window === "undefined") return []

  const freighter = getFreighterProvider()
  const xbull = getXBullProvider()
  const rabet = getRabetProvider()

  const wallets: WalletInfo[] = [
    {
      type: "freighter",
      name: "Freighter",
      description: "Most popular Stellar wallet",
      installUrl: "https://www.freighter.app/",
      isInstalled: !!freighter,
    },
    {
      type: "albedo",
      name: "Albedo",
      description: "Web-based wallet (no installation needed)",
      installUrl: "https://albedo.link/",
      isInstalled: true, // Albedo is web-based
    },
    {
      type: "xbull",
      name: "xBull",
      description: "Mobile & browser wallet",
      installUrl: "https://xbull.app/",
      isInstalled: !!xbull,
    },
    {
      type: "rabet",
      name: "Rabet",
      description: "Browser extension wallet",
      installUrl: "https://rabet.io/",
      isInstalled: !!rabet,
    },
  ]

  return wallets
}

class StellarWalletService {
  private listeners: Set<(state: WalletState) => void> = new Set()
  private state: WalletState = {
    publicKey: null,
    isConnected: false,
    walletType: null,
  }

  async connectWallet(walletType: WalletType = "freighter"): Promise<string> {
    console.log("[v0] Attempting to connect wallet:", walletType)

    if (typeof window === "undefined") {
      throw new Error("Wallet can only be connected in browser")
    }

    try {
      let publicKey: string

      switch (walletType) {
        case "freighter":
          publicKey = await this.connectFreighter()
          break
        case "albedo":
          publicKey = await this.connectAlbedo()
          break
        case "xbull":
          publicKey = await this.connectXBull()
          break
        case "rabet":
          publicKey = await this.connectRabet()
          break
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`)
      }

      console.log("[v0] Wallet connected successfully:", publicKey)

      this.updateState({
        publicKey,
        isConnected: true,
        walletType,
      })

      // Store in localStorage
      localStorage.setItem("stellar_wallet_address", publicKey)
      localStorage.setItem("stellar_wallet_type", walletType)

      return publicKey
    } catch (error) {
      console.error("[v0] Failed to connect wallet:", error)
      throw error
    }
  }

  private async connectFreighter(): Promise<string> {
    const freighter = getFreighterProvider()

    if (!freighter) {
      throw new Error("Freighter wallet not installed. Please install it from https://www.freighter.app/")
    }

    try {
      if (typeof freighter.requestAccess === "function") {
        const access = await freighter.requestAccess()
        const address = extractAddress(access)
        if (address) return address
      }

      if (typeof freighter.isAllowed === "function" && typeof freighter.setAllowed === "function") {
        const isAllowed = await freighter.isAllowed()

        if (!isAllowed) {
          const allowed = await freighter.setAllowed()
          if (!allowed) {
            throw new Error("User denied wallet access")
          }
        }
      }

      if (typeof freighter.getPublicKey === "function") {
        const publicKey = await freighter.getPublicKey()
        if (publicKey) return publicKey
      }

      if (typeof freighter.getAddress === "function") {
        const address = extractAddress(await freighter.getAddress())
        if (address) return address
      }

      throw new Error("Failed to get public key from Freighter")
    } catch (error: any) {
      if (error.message?.includes("User declined") || error.message?.includes("rejected")) {
        throw new Error("User declined wallet connection")
      }
      throw error
    }
  }

  private async connectAlbedo(): Promise<string> {
    try {
      // Dynamically import Albedo
      const albedoModule = await import("@albedo-link/intent")
      const albedo = albedoModule.default

      const result = await albedo.publicKey({
        require_existing: false,
      })

      if (!result.pubkey) {
        throw new Error("Failed to get public key from Albedo")
      }

      return result.pubkey
    } catch (error: any) {
      if (error.message?.includes("canceled")) {
        throw new Error("User canceled Albedo connection")
      }
      throw new Error("Albedo connection failed. Please try again.")
    }
  }

  private async connectXBull(): Promise<string> {
    const xBullSDK = getXBullProvider()

    if (!xBullSDK) {
      throw new Error("xBull wallet not found. Please install the xBull browser extension.")
    }

    const result = await xBullSDK.connect()
    const publicKey = extractAddress(result)

    if (!publicKey) {
      throw new Error("Failed to get public key from xBull")
    }

    return publicKey
  }

  private async connectRabet(): Promise<string> {
    const rabet = getRabetProvider()

    if (!rabet) {
      throw new Error("Rabet wallet not found. Please install the Rabet browser extension.")
    }

    const result = await rabet.connect()
    const publicKey = extractAddress(result)

    if (!publicKey) {
      throw new Error("Failed to get public key from Rabet")
    }

    return publicKey
  }

  async disconnectWallet(): Promise<void> {
    console.log("[v0] Disconnecting wallet")

    this.updateState({
      publicKey: null,
      isConnected: false,
      walletType: null,
    })

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("stellar_wallet_address")
      localStorage.removeItem("stellar_wallet_type")
    }
  }

  async signTransaction(xdr: string): Promise<string> {
    if (!this.state.isConnected || !this.state.walletType) {
      throw new Error("Wallet not connected")
    }

    console.log("[v0] Signing transaction with", this.state.walletType)

    try {
      const network = getActiveNetwork()

      switch (this.state.walletType) {
        case "freighter":
          const freighter = getFreighterProvider()
          if (!freighter || typeof freighter.signTransaction !== "function") {
            throw new Error("Freighter signTransaction is not available")
          }

          try {
            const signed = await freighter.signTransaction(xdr, {
              network,
            })
            const signedXdr = extractSignedXdr(signed)
            if (signedXdr) return signedXdr
          } catch {
            const signed = await freighter.signTransaction(xdr)
            const signedXdr = extractSignedXdr(signed)
            if (signedXdr) return signedXdr
          }

          throw new Error("Freighter failed to sign transaction")
        case "albedo":
          const albedoModule = await import("@albedo-link/intent")
          const albedo = albedoModule.default

          const albedoResult = await albedo.tx({
            xdr,
            network,
          })
          {
            const signedXdr = extractSignedXdr(albedoResult)
            if (!signedXdr) throw new Error("Albedo failed to sign transaction")
            return signedXdr
          }
        case "xbull":
          const xBull = getXBullProvider()
          if (!xBull || typeof xBull.signTransaction !== "function") {
            throw new Error("xBull signTransaction is not available")
          }

          const xBullResult = await xBull.signTransaction(xdr)
          {
            const signedXdr = extractSignedXdr(xBullResult)
            if (!signedXdr) throw new Error("xBull failed to sign transaction")
            return signedXdr
          }
        case "rabet":
          const rabet = getRabetProvider()
          if (!rabet || typeof rabet.sign !== "function") {
            throw new Error("Rabet sign is not available")
          }

          const rabetResult = await rabet.sign(xdr, {
            network,
          })
          {
            const signedXdr = extractSignedXdr(rabetResult)
            if (!signedXdr) throw new Error("Rabet failed to sign transaction")
            return signedXdr
          }
        default:
          throw new Error(`Unsupported wallet type: ${this.state.walletType}`)
      }
    } catch (error) {
      console.error("[v0] Failed to sign transaction:", error)
      throw error
    }
  }

  getPublicKey(): string | null {
    return this.state.publicKey
  }

  isConnected(): boolean {
    return this.state.isConnected
  }

  getState(): WalletState {
    return { ...this.state }
  }

  subscribe(listener: (state: WalletState) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private updateState(newState: Partial<WalletState>): void {
    this.state = { ...this.state, ...newState }
    console.log("[v0] Wallet state updated:", this.state)
    this.listeners.forEach((listener) => listener(this.state))
  }

  async restoreSession(): Promise<void> {
    if (typeof window === "undefined") return

    const address = localStorage.getItem("stellar_wallet_address")
    const walletType = localStorage.getItem("stellar_wallet_type") as WalletType | null

    console.log("[v0] Restoring wallet session:", { address, walletType })

    if (address && walletType) {
      // Validate that the wallet is still installed
      const installedWallets = detectInstalledWallets()
      const wallet = installedWallets.find((w) => w.type === walletType)

      if (wallet?.isInstalled || walletType === "albedo") {
        this.updateState({
          publicKey: address,
          isConnected: true,
          walletType,
        })
      } else {
        // Clear invalid session
        console.log("[v0] Wallet no longer installed, clearing session")
        localStorage.removeItem("stellar_wallet_address")
        localStorage.removeItem("stellar_wallet_type")
      }
    }
  }
}

export const walletService = new StellarWalletService()
