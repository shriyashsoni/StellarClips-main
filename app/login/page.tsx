"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet"

export default function LoginPage() {
  const router = useRouter()
  const { isConnected, connect } = useWallet()

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard")
    }
  }, [isConnected, router])

  const handleConnect = async () => {
    try {
      await connect("freighter")
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to connect:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">Connect your Stellar wallet to access the creator dashboard</p>
          <button onClick={handleConnect} className="w-full">
            Connect Wallet
          </button>
        </Card>
      </div>
    </div>
  )
}
