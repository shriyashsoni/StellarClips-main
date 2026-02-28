"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/hooks/use-wallet"
import { subscriptionService, type SubscriptionTier } from "@/lib/services/subscription-service"
import { useToast } from "@/hooks/use-toast"

interface ActiveSubscriptionItem {
  id: string
  creatorId: string
  creatorName: string
  tierId: number
  tierName: string
  priceXlm: number
  renewalDate: string
  status: "active" | "inactive"
}

export function SubscriptionsTab() {
  const { publicKey, isConnected } = useWallet()
  const { toast } = useToast()
  const [subscriptions, setSubscriptions] = useState<ActiveSubscriptionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const MAX_TIER_PROBE = 100

  const loadSubscriptions = async () => {
    setLoading(true)
    setError(null)

    if (!publicKey) {
      setSubscriptions([])
      setLoading(false)
      return
    }

    try {
      const probeIds = Array.from({ length: MAX_TIER_PROBE }, (_, index) => index + 1)
      const tierResults = await Promise.allSettled(probeIds.map((id) => subscriptionService.getTier(id)))
      const tiers = tierResults
        .filter(
          (result): result is PromiseFulfilledResult<SubscriptionTier | null> => result.status === "fulfilled",
        )
        .map((result) => result.value)

      const existingTiers = tiers.filter((tier): tier is SubscriptionTier => tier !== null)
      const creatorMap = new Map<string, SubscriptionTier>()
      for (const tier of existingTiers) {
        if (!creatorMap.has(tier.creator)) {
          creatorMap.set(tier.creator, tier)
        }
      }

      const active: ActiveSubscriptionItem[] = []
      for (const [creator, tier] of creatorMap) {
        const isActive = await subscriptionService.isSubscribed(publicKey, creator)
        if (!isActive) continue

        const details = await subscriptionService.getSubscription(publicKey, creator)
        active.push({
          id: `${creator}-${tier.tierId}`,
          creatorId: creator,
          creatorName: `${creator.slice(0, 6)}...${creator.slice(-4)}`,
          tierId: tier.tierId,
          tierName: tier.name,
          priceXlm: Number(tier.price) / 10_000_000,
          renewalDate: details ? new Date(details.expiryDate * 1000).toLocaleDateString() : "Unknown",
          status: "active",
        })
      }

      setSubscriptions(active)
    } catch {
      setError("Failed to load active subscriptions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSubscriptions()
  }, [publicKey])

  const handleRenew = async (creatorId: string, tierId: number) => {
    if (!publicKey || !isConnected) return

    try {
      await subscriptionService.renewSubscription(publicKey, creatorId, tierId)
      toast({ title: "Subscription renewed" })
      await loadSubscriptions()
    } catch {
      toast({ title: "Failed to renew subscription", variant: "destructive" })
    }
  }

  const handleCancel = async (creatorId: string) => {
    if (!publicKey || !isConnected) return

    try {
      await subscriptionService.cancelSubscription(publicKey, creatorId)
      toast({ title: "Subscription cancelled" })
      await loadSubscriptions()
    } catch {
      toast({ title: "Failed to cancel subscription", variant: "destructive" })
    }
  }

  if (loading) {
    return <Card className="p-12 text-center text-muted-foreground">Loading subscriptions...</Card>
  }

  if (error) {
    return <Card className="p-12 text-center text-destructive">{error}</Card>
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No active on-chain subscriptions found.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {subscriptions.map((sub) => (
        <Card key={sub.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{sub.creatorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{sub.creatorName}</h3>
                  <p className="text-sm text-muted-foreground">{sub.tierName} Tier</p>
                </div>
              </div>
              <Badge variant={sub.status === "active" ? "default" : "secondary"}>{sub.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">{sub.priceXlm} XLM</p>
                <p className="text-muted-foreground">Renews on {sub.renewalDate}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleRenew(sub.creatorId, sub.tierId)}>
                  Renew
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleCancel(sub.creatorId)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
