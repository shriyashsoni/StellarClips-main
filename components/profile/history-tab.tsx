"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/hooks/use-wallet"
import { horizonIndexer } from "@/lib/indexer/horizon-indexer"

interface HistoryItem {
  id: string
  type: string
  description: string
  amount: string
  date: string
  status: string
}

export function HistoryTab() {
  const { publicKey } = useWallet()
  const [transactions, setTransactions] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true)
      setError(null)

      if (!publicKey) {
        setTransactions([])
        setLoading(false)
        return
      }

      try {
        const payments = await horizonIndexer.getAccountPayments(publicKey, 30)
        const mapped = payments
          .filter((payment: { type?: string }) => payment.type === "payment")
          .map((payment: { id: string; amount?: string; from?: string; to?: string; created_at?: string }) => ({
            id: payment.id,
            type: "payment",
            description: `Payment ${payment.from?.slice(0, 4)}... -> ${payment.to?.slice(-4)}`,
            amount: `-${payment.amount || "0.00"}`,
            date: payment.created_at ? new Date(payment.created_at).toLocaleString() : "Unknown",
            status: "confirmed",
          }))

        setTransactions(mapped)
      } catch {
        setError("Failed to load on-chain transaction history")
      } finally {
        setLoading(false)
      }
    }

    void loadHistory()
  }, [publicKey])

  if (loading) {
    return <Card className="p-12 text-center text-muted-foreground">Loading on-chain history...</Card>
  }

  if (error) {
    return <Card className="p-12 text-center text-destructive">{error}</Card>
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No on-chain transaction history found.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <Card key={tx.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    tx.type === "purchase"
                      ? "bg-blue-500/10"
                      : tx.type === "tip"
                        ? "bg-pink-500/10"
                        : "bg-purple-500/10"
                  }`}
                >
                  {tx.amount.startsWith("-") ? (
                    <ArrowUpRight className="h-5 w-5 text-red-500" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.amount.startsWith("-") ? "text-red-500" : "text-green-500"}`}>
                  {tx.amount} XLM
                </p>
                <Badge variant="secondary" className="mt-1">
                  {tx.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
