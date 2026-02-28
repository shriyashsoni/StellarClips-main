"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { revenueService } from "@/lib/services/revenue-service"
import { useToast } from "@/hooks/use-toast"

export function EarningsTab() {
  const { isConnected, publicKey } = useWallet()
  const { toast } = useToast()
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [availableBalance, setAvailableBalance] = useState("0")
  const [totalEarned, setTotalEarned] = useState("0")
  const [totalWithdrawn, setTotalWithdrawn] = useState("0")

  useEffect(() => {
    const loadBalance = async () => {
      if (!publicKey) return

      const balance = await revenueService.getBalance(publicKey)
      if (!balance) return

      setAvailableBalance(revenueService.formatBalance(balance.availableBalance))
      setTotalEarned(revenueService.formatBalance(balance.totalEarned))
      setTotalWithdrawn(revenueService.formatBalance(balance.totalWithdrawn))
    }

    loadBalance()
  }, [publicKey])

  const handleWithdraw = async () => {
    if (!isConnected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to withdraw",
        variant: "destructive",
      })
      return
    }

    if (!withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      })
      return
    }

    setIsWithdrawing(true)

    try {
      const amountInStroops = revenueService.xlmToStroops(withdrawAmount)
      await revenueService.withdraw(publicKey, amountInStroops)

      toast({
        title: "Withdrawal successful",
        description: `${withdrawAmount} XLM has been sent to your wallet`,
      })

      setWithdrawAmount("")
      const balance = await revenueService.getBalance(publicKey)
      if (balance) {
        setAvailableBalance(revenueService.formatBalance(balance.availableBalance))
        setTotalEarned(revenueService.formatBalance(balance.totalEarned))
        setTotalWithdrawn(revenueService.formatBalance(balance.totalWithdrawn))
      }
    } catch (error) {
      console.error("Withdrawal failed:", error)
      toast({
        title: "Withdrawal failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Earnings</h2>
        <p className="text-muted-foreground">Track your earnings and withdraw funds</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">{availableBalance} XLM</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-2xl font-bold">{totalEarned} XLM</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Withdrawn</p>
              <p className="text-2xl font-bold">{totalWithdrawn} XLM</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Withdraw Funds</h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (XLM)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Minimum withdrawal: 1 XLM</p>
          </div>

          <Button onClick={handleWithdraw} disabled={isWithdrawing || !isConnected} className="w-full">
            {isWithdrawing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Withdraw to Wallet"
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No transactions yet</p>
        </div>
      </Card>
    </div>
  )
}
