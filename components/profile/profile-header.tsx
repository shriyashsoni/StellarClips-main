"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useWallet } from "@/hooks/use-wallet"

export function ProfileHeader() {
  const { publicKey } = useWallet()

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-2xl">{publicKey ? publicKey.slice(0, 2).toUpperCase() : "U"}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {publicKey && (
            <p className="text-sm text-muted-foreground font-mono">
              {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
            </p>
          )}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-semibold">12</span>
              <span className="text-muted-foreground ml-1">Purchases</span>
            </div>
            <div>
              <span className="font-semibold">3</span>
              <span className="text-muted-foreground ml-1">Subscriptions</span>
            </div>
          </div>
        </div>
      </div>
      <Button variant="outline">
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
    </div>
  )
}
