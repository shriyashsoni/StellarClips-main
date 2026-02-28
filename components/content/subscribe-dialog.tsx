"use client"

import { useState, useEffect } from "react"
import { Loader2, CheckCircle2, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet"
import { subscriptionService } from "@/lib/services/subscription-service"
import { formatXLM } from "@/lib/stellar-utils"
import type { SubscriptionTier } from "@/lib/types"

interface SubscribeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  creatorId: string
  creatorName: string
}

export function SubscribeDialog({ open, onOpenChange, creatorId, creatorName }: SubscribeDialogProps) {
  const { publicKey, isConnected } = useWallet()
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Fetch actual tiers
    const mockTiers: SubscriptionTier[] = [
      {
        id: "1",
        creator_id: creatorId,
        name: "Basic",
        description: "Access to all content",
        price_xlm: "10.00",
        duration_days: 30,
        benefits: ["All content access", "Early releases"],
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        creator_id: creatorId,
        name: "Premium",
        description: "Everything in Basic plus exclusive perks",
        price_xlm: "25.00",
        duration_days: 30,
        benefits: ["All content access", "Early releases", "Exclusive content", "Direct messaging"],
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ]
    setTiers(mockTiers)
  }, [creatorId])

  const handleSubscribe = async () => {
    if (!isConnected || !publicKey || !selectedTier) {
      setError("Please select a tier and connect your wallet")
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const tier = tiers.find((t) => t.id === selectedTier)
      if (!tier) throw new Error("Tier not found")

      await subscriptionService.subscribe(publicKey, creatorId, selectedTier, tier.price_xlm)

      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
        setSelectedTier(null)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription failed")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Subscribe to {creatorName}</DialogTitle>
          <DialogDescription>Choose a subscription tier to support this creator</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Subscription Active!</h3>
              <p className="text-sm text-muted-foreground">You now have access to exclusive content</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4">
              {tiers.map((tier) => (
                <Card
                  key={tier.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedTier === tier.id ? "border-primary ring-2 ring-primary" : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{tier.name}</h3>
                        {selectedTier === tier.id && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                      <ul className="space-y-1">
                        {tier.benefits?.map((benefit, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatXLM(tier.price_xlm)}</div>
                      <div className="text-sm text-muted-foreground">XLM/month</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubscribe}
                disabled={processing || !isConnected || !selectedTier}
                className="flex-1"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
