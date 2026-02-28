"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function HistoryTab() {
  // TODO: Fetch actual transaction history
  const transactions = [
    {
      id: "1",
      type: "purchase",
      description: "Purchased: Advanced React Patterns",
      amount: "-5.00",
      date: "2 days ago",
      status: "completed",
    },
    {
      id: "2",
      type: "tip",
      description: "Tip sent to Tech Educator",
      amount: "-10.00",
      date: "3 days ago",
      status: "completed",
    },
    {
      id: "3",
      type: "subscription",
      description: "Subscription: Design Master (Premium)",
      amount: "-25.00",
      date: "1 week ago",
      status: "completed",
    },
  ]

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
