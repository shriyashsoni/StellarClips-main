"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SubscriptionsTab() {
  // TODO: Fetch actual subscriptions
  const subscriptions = [
    {
      id: "1",
      creatorName: "Tech Educator",
      tier: "Premium",
      price: "25.00",
      renewalDate: "Jan 15, 2025",
      status: "active",
    },
    {
      id: "2",
      creatorName: "Design Master",
      tier: "Basic",
      price: "10.00",
      renewalDate: "Jan 20, 2025",
      status: "active",
    },
  ]

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
                  <p className="text-sm text-muted-foreground">{sub.tier} Tier</p>
                </div>
              </div>
              <Badge variant={sub.status === "active" ? "default" : "secondary"}>{sub.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">{sub.price} XLM/month</p>
                <p className="text-muted-foreground">Renews on {sub.renewalDate}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Manage
                </Button>
                <Button variant="destructive" size="sm">
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
