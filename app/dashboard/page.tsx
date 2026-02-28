"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/hooks/use-wallet"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardPage() {
  const { isConnected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Please connect your wallet to access the dashboard.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <DashboardTabs />
      </div>
    </div>
  )
}
