"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateTierDialog } from "./create-tier-dialog"
import { SubscriptionTiersList } from "./subscription-tiers-list"

export function SubscriptionsTab() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscription Tiers</h2>
          <p className="text-muted-foreground">Create and manage subscription tiers for your content</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Tier
        </Button>
      </div>

      <SubscriptionTiersList />

      <CreateTierDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
