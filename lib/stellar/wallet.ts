"use client"

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

export function detectInstalledWallets(): WalletInfo[] {
  if (typeof window === "undefined") return []

  const wallets: WalletInfo[] = [
    {
      type: "freighter",
      name: "Freighter",
      description: "Most popular Stellar wallet",
      installUrl: "https://www.freighter.app/",
      isInstalled: !!(window as any).freighter,
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
      isInstalled: !!(window as any).xBullSDK,
    },
    {
      type: "rabet",
      name: "Rabet",
      description: "Browser extension wallet",
      installUrl: "https://rabet.io/",
      isInstalled: !!(window as any).rabet,
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
    const freighter = (window as any).freighter

    if (!freighter) {
      throw new Error("Freighter wallet not installed. Please install it from https://www.freighter.app/")
    }

    try {
      const isAllowed = await freighter.isAllowed()

      if (!isAllowed) {
        const allowed = await freighter.setAllowed()
        if (!allowed) {
          throw new Error("User denied wallet access")
        }
      }

      const publicKey = await freighter.getPublicKey()

      if (!publicKey) {
        throw new Error("Failed to get public key from Freighter")
      }

      return publicKey
    } catch (error: any) {
      if (error.message?.includes("User declined")) {
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
    const xBullSDK = (window as any).xBullSDK

    if (!xBullSDK) {
      throw new Error("xBull wallet not found. Please install the xBull browser extension.")
    }

    const result = await xBullSDK.connect()

    if (!result.publicKey) {
      throw new Error("Failed to get public key from xBull")
    }

    return result.publicKey
  }

  private async connectRabet(): Promise<string> {
    const rabet = (window as any).rabet

    if (!rabet) {
      throw new Error("Rabet wallet not found. Please install the Rabet browser extension.")
    }

    const result = await rabet.connect()

    if (!result.publicKey) {
      throw new Error("Failed to get public key from Rabet")
    }

    return result.publicKey
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
      switch (this.state.walletType) {
        case "freighter":
          return await (window as any).freighter.signTransaction(xdr, {
            network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet",
          })
        case "albedo":
          const albedoResult = await (window as any).albedo.tx({
            xdr,
            network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet",
          })
          return albedoResult.signed_envelope_xdr
        case "xbull":
          const xBullResult = await (window as any).xBullSDK.signTransaction(xdr)
          return xBullResult.signedTransaction
        case "rabet":
          const rabetResult = await (window as any).rabet.sign(xdr, {
            network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet",
          })
          return rabetResult.xdr
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
