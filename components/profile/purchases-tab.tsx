"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { accessService } from "@/lib/services/access-service"

interface PurchaseItem {
  id: string
  title: string
  thumbnail: string
  purchaseDate: string
  price: string
  contentId: string
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
        const purchases = await accessService.getUserPurchases(publicKey)
        const normalized = purchases.map((purchase, index) => ({
            id: String(purchase.paymentId),
            title: `Purchased Content #${purchase.contentId}`,
            thumbnail: "/placeholder.svg?height=400&width=600&query=digital content",
            purchaseDate: new Date(purchase.timestamp * 1000).toLocaleDateString(),
            price: (Number(purchase.amount) / 10_000_000).toFixed(2),
            contentId: String(purchase.contentId || index + 1),
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
                <Link href={`/content/${purchase.contentId}`}>
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
