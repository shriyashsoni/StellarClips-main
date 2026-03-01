"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut, ExternalLink, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useStellarNetwork } from "@/hooks/use-stellar-network"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { detectInstalledWallets, type WalletType } from "@/lib/stellar/wallet"
import { useState, useEffect } from "react"
import { sorobanClient } from "@/lib/stellar/soroban-client"
import { formatXLM } from "@/lib/stellar-utils"

export function WalletConnectButton() {
  const { publicKey, isConnected, isLoading, connect, disconnect } = useWallet()
  const { network, setNetwork } = useStellarNetwork()
  const { toast } = useToast()
  const [installedWallets, setInstalledWallets] = useState<ReturnType<typeof detectInstalledWallets>>([])
  const [balance, setBalance] = useState<string>("0")
  const [loadingBalance, setLoadingBalance] = useState(false)

  useEffect(() => {
    const loadBalance = async () => {
      if (!publicKey || !isConnected) {
        setBalance("0")
        return
      }

      setLoadingBalance(true)
      try {
        const xlmBalance = await sorobanClient.getAccountBalance(publicKey)
        setBalance(xlmBalance)
      } finally {
        setLoadingBalance(false)
      }
    }

    void loadBalance()
  }, [publicKey, isConnected, network])

  const refreshWallets = () => {
    const refreshed = detectInstalledWallets()
    setInstalledWallets(refreshed)
    return refreshed
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      refreshWallets()
    }
  }, [])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const handleConnect = async (walletType: WalletType) => {
    console.log("[v0] Wallet connect button clicked:", walletType)

    const refreshed = refreshWallets()

    const wallet = refreshed.find((w) => w.type === walletType)

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

  const handleNetworkChange = (nextNetwork: string) => {
    if (nextNetwork !== "testnet" && nextNetwork !== "mainnet") return

    setNetwork(nextNetwork)
    toast({
      title: "Network switched",
      description: `Active chain changed to ${nextNetwork}.`,
    })
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
          <DropdownMenuLabel className="text-xs text-muted-foreground">Network</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={network} onValueChange={handleNetworkChange}>
            <DropdownMenuRadioItem value="testnet">Testnet</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="mainnet">Mainnet</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            Balance: {loadingBalance ? "Loading..." : `${formatXLM(Number.parseFloat(balance || "0"))} XLM`}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              void (async () => {
                if (!publicKey) return
                setLoadingBalance(true)
                try {
                  const xlmBalance = await sorobanClient.getAccountBalance(publicKey)
                  setBalance(xlmBalance)
                  toast({ title: "Balance refreshed" })
                } finally {
                  setLoadingBalance(false)
                }
              })()
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Balance
          </DropdownMenuItem>
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
    <DropdownMenu onOpenChange={(open) => open && refreshWallets()}>
      <DropdownMenuTrigger asChild>
        <Button disabled={isLoading}>
          <Wallet className="w-4 h-4 mr-2" />
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Select Wallet</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={(event) => {
            event.preventDefault()
            refreshWallets()
            toast({
              title: "Wallet list refreshed",
              description: "Detected wallet extensions have been re-scanned.",
            })
          }}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Wallets
        </DropdownMenuItem>
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
