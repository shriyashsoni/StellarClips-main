"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { detectInstalledWallets, type WalletType } from "@/lib/stellar/wallet"
import { useState, useEffect } from "react"

export function WalletConnectButton() {
  const { publicKey, isConnected, isLoading, error, connect, disconnect } = useWallet()
  const { toast } = useToast()
  const [installedWallets, setInstalledWallets] = useState<ReturnType<typeof detectInstalledWallets>>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInstalledWallets(detectInstalledWallets())
    }
  }, [])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const handleConnect = async (walletType: WalletType) => {
    console.log("[v0] Wallet connect button clicked:", walletType)

    const wallet = installedWallets.find((w) => w.type === walletType)

    if (!wallet?.isInstalled && walletType !== "albedo") {
      toast({
        title: "Wallet Not Installed",
        description: (
          <div className="flex flex-col gap-2">
            <p>Please install {wallet?.name} to continue.</p>
            <a
              href={wallet?.installUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline flex items-center gap-1"
            >
              Install {wallet?.name} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ),
        variant: "destructive",
      })
      return
    }

    try {
      await connect(walletType)
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      })
    } catch (err) {
      toast({
        title: "Connection Failed",
        description: err instanceof Error ? err.message : "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = async () => {
    console.log("[v0] Wallet disconnect button clicked")
    try {
      await disconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })
    } catch (err) {
      toast({
        title: "Disconnection Failed",
        description: err instanceof Error ? err.message : "Failed to disconnect wallet",
        variant: "destructive",
      })
    }
  }

  if (isConnected && publicKey) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Wallet className="w-4 h-4 mr-2" />
            {formatAddress(publicKey)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(publicKey)
              toast({
                title: "Address Copied",
                description: "Wallet address copied to clipboard.",
              })
            }}
          >
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDisconnect}>
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isLoading}>
          <Wallet className="w-4 h-4 mr-2" />
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Select Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {installedWallets.map((wallet) => (
          <DropdownMenuItem
            key={wallet.type}
            onClick={() => handleConnect(wallet.type)}
            className="flex items-start gap-2 py-3"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{wallet.name}</span>
                {wallet.isInstalled ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">{wallet.description}</span>
              {!wallet.isInstalled && wallet.type !== "albedo" && (
                <a
                  href={wallet.installUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary underline flex items-center gap-1 mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  Install <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
