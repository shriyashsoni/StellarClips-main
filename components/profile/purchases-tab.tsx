"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { horizonIndexer } from "@/lib/indexer/horizon-indexer"

interface PurchaseItem {
  id: string
  title: string
  thumbnail: string
  purchaseDate: string
  price: string
}

export function PurchasesTab() {
  const { publicKey } = useWallet()
  const [purchases, setPurchases] = useState<PurchaseItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPurchases = async () => {
      setLoading(true)
      setError(null)

      if (!publicKey) {
        setPurchases([])
        setLoading(false)
        return
      }

      try {
        const payments = await horizonIndexer.getAccountPayments(publicKey, 20)
        const normalized = payments
          .filter((payment: { type?: string }) => payment.type === "payment")
          .map((payment: { id: string; amount?: string; created_at?: string }, index: number) => ({
            id: String(index + 1),
            title: `On-chain Purchase #${index + 1}`,
            thumbnail: "/placeholder.svg?height=400&width=600&query=digital content",
            purchaseDate: payment.created_at ? new Date(payment.created_at).toLocaleDateString() : "Unknown",
            price: payment.amount || "0.00",
          }))

        setPurchases(normalized)
      } catch {
        setError("Failed to load on-chain purchases")
      } finally {
        setLoading(false)
      }
    }

    void loadPurchases()
  }, [publicKey])

  if (loading) {
    return <Card className="p-12 text-center text-muted-foreground">Loading on-chain purchases...</Card>
  }

  if (error) {
    return <Card className="p-12 text-center text-destructive">{error}</Card>
  }

  if (purchases.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No on-chain purchases found for this wallet.</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {purchases.map((purchase) => (
        <Card key={purchase.id} className="overflow-hidden group">
          <div className="relative aspect-video">
            <Image src={purchase.thumbnail || "/placeholder.svg"} alt={purchase.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="lg" className="rounded-full" asChild>
                <Link href={`/content/${purchase.id}`}>
                  <Play className="mr-2 h-5 w-5" />
                  Watch Now
                </Link>
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 line-clamp-1">{purchase.title}</h3>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{purchase.purchaseDate}</span>
              <span>{purchase.price} XLM</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
