"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentTab } from "./content-tab"
import { SubscriptionsTab } from "./subscriptions-tab"
import { EarningsTab } from "./earnings-tab"
import { AnalyticsTab } from "./analytics-tab"

export function DashboardTabs() {
  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-4">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        <TabsTrigger value="earnings">Earnings</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="mt-6">
        <ContentTab />
      </TabsContent>

      <TabsContent value="subscriptions" className="mt-6">
        <SubscriptionsTab />
      </TabsContent>

      <TabsContent value="earnings" className="mt-6">
        <EarningsTab />
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        <AnalyticsTab />
      </TabsContent>
    </Tabs>
  )
}
