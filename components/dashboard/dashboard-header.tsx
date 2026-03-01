"use client"

import { Card } from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet"
import { AlertCircle, CheckCircle2, DollarSign, TrendingUp, Users, FileText } from "lucide-react"
import { getContractHealth } from "@/lib/contract-health"

export function DashboardHeader() {
  const { publicKey } = useWallet()
  const contractHealth = getContractHealth()

  return (
    <>
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
          <p className="text-muted-foreground">Manage your content, subscriptions, and earnings</p>

          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${contractHealth.isReady ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}
          >
            <div className="flex items-center gap-2">
              {contractHealth.isReady ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <span className="font-medium">
                Contracts ready: {contractHealth.configured}/{contractHealth.total} ({contractHealth.network})
              </span>
            </div>
            {!contractHealth.isReady && (
              <p className="mt-1 text-muted-foreground">Missing: {contractHealth.missingKeys.join(", ")}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-xl font-bold">0 XLM</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subscribers</p>
                  <p className="text-xl font-bold">0</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Content Items</p>
                  <p className="text-xl font-bold">0</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl font-bold">0 XLM</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
