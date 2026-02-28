"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"

export function SubscriptionTiersList() {
  const tiers = []

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
      {tiers.map((tier: any) => (
        <Card key={tier.id} className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{tier.name}</h3>
                <Badge>{tier.subscribers} subscribers</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">XLM</span>
              </div>
              <p className="text-sm text-muted-foreground">per {tier.duration}</p>
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
