"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PurchasesTab } from "./purchases-tab"
import { SubscriptionsTab } from "./subscriptions-tab"
import { HistoryTab } from "./history-tab"

export function ProfileTabs() {
  return (
    <Tabs defaultValue="purchases" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="purchases">Purchases</TabsTrigger>
        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="purchases" className="mt-6">
        <PurchasesTab />
      </TabsContent>
      <TabsContent value="subscriptions" className="mt-6">
        <SubscriptionsTab />
      </TabsContent>
      <TabsContent value="history" className="mt-6">
        <HistoryTab />
      </TabsContent>
    </Tabs>
  )
}
