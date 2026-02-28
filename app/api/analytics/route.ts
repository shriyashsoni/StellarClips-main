import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get("creatorId")
    const period = searchParams.get("period") || "30d"

    if (!creatorId) {
      return NextResponse.json({ error: "creatorId is required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const daysAgo = period === "7d" ? 7 : period === "30d" ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysAgo)

    const { data: clips } = await supabase
      .from("clips")
      .select("id, title, view_count, purchase_count, price_xlm")
      .eq("creator_id", creatorId)

    const { data: purchases } = await supabase
      .from("purchases")
      .select("amount_xlm, purchased_at")
      .gte("purchased_at", startDate.toISOString())

    const { data: creator } = await supabase.from("creators").select("subscriber_count").eq("id", creatorId).single()

    const totalViews = clips?.reduce((sum, c) => sum + (c.view_count || 0), 0) || 0
    const totalPurchases = clips?.reduce((sum, c) => sum + (c.purchase_count || 0), 0) || 0
    const totalRevenue = purchases?.reduce((sum, p) => sum + Number.parseFloat(p.amount_xlm || "0"), 0) || 0
    const conversionRate = totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0

    const topContent = clips
      ?.sort((a, b) => (b.purchase_count || 0) - (a.purchase_count || 0))
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        title: c.title,
        views: c.view_count,
        purchases: c.purchase_count,
        revenue: ((c.purchase_count || 0) * Number.parseFloat(c.price_xlm || "0")).toFixed(7),
      }))

    const analytics = {
      views: totalViews,
      purchases: totalPurchases,
      revenue: totalRevenue.toFixed(7),
      subscribers: creator?.subscriber_count || 0,
      conversionRate: conversionRate.toFixed(2),
      topContent: topContent || [],
      revenueChart: [],
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
