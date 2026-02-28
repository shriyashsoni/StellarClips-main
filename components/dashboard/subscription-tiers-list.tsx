"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { subscriptionService, type SubscriptionTier } from "@/lib/services/subscription-service"
import { formatXLM } from "@/lib/stellar-utils"

interface TierCard {
  id: number
  name: string
  priceXlm: number
  durationDays: number
  subscribers: number
}

export function SubscriptionTiersList() {
  const MAX_TIER_PROBE = 30
  const { publicKey } = useWallet()
  const [tiers, setTiers] = useState<TierCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTiers = async () => {
      setLoading(true)
      setError(null)

      if (!publicKey) {
        setTiers([])
        setLoading(false)
        return
      }

      try {
        const probes = Array.from({ length: MAX_TIER_PROBE }, (_, index) => index + 1)
        const results = await Promise.allSettled(probes.map((id) => subscriptionService.getTier(id)))
        const fetched = results
          .filter((result): result is PromiseFulfilledResult<SubscriptionTier | null> => result.status === "fulfilled")
          .map((result) => result.value)

        const creatorTiers = fetched
          .filter((tier): tier is SubscriptionTier => tier !== null)
          .filter((tier) => tier.creator === publicKey)
          .map((tier) => ({
            id: tier.tierId,
            name: tier.name,
            priceXlm: Number(tier.price) / 10_000_000,
            durationDays: tier.durationDays,
            subscribers: 0,
          }))

        setTiers(creatorTiers)
      } catch {
        setError("Failed to load subscription tiers")
      } finally {
        setLoading(false)
      }
    }

    void loadTiers()
  }, [publicKey])

  if (loading) {
    return <Card className="p-12 text-center text-muted-foreground">Loading on-chain tiers...</Card>
  }

  if (error) {
    return <Card className="p-12 text-center text-destructive">{error}</Card>
  }

  if (tiers.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          No subscription tiers yet. Create your first tier to start accepting subscribers.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tiers.map((tier) => (
        <Card key={tier.id} className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{tier.name}</h3>
                <Badge>{tier.subscribers} subscribers</Badge>
              </div>
              <p className="text-sm text-muted-foreground">On-chain subscription tier</p>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-bold">{formatXLM(tier.priceXlm)}</span>
                <span className="text-muted-foreground">XLM</span>
              </div>
              <p className="text-sm text-muted-foreground">every {tier.durationDays} days</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
