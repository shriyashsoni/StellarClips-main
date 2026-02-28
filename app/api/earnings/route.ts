import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get("creatorId")

    if (!creatorId) {
      return NextResponse.json({ error: "creatorId is required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data: creator } = await supabase.from("creators").select("total_earnings_xlm").eq("id", creatorId).single()

    const { data: purchases } = await supabase.from("purchases").select("creator_earnings_xlm").eq("clip_id", creatorId)

    const { data: tips } = await supabase.from("tips").select("creator_earnings_xlm").eq("to_creator_id", creatorId)

    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("amount_xlm")
      .eq("creator_id", creatorId)

    const purchaseEarnings =
      purchases?.reduce((sum, p) => sum + Number.parseFloat(p.creator_earnings_xlm || "0"), 0) || 0
    const tipEarnings = tips?.reduce((sum, t) => sum + Number.parseFloat(t.creator_earnings_xlm || "0"), 0) || 0
    const subscriptionEarnings = subscriptions?.reduce((sum, s) => sum + Number.parseFloat(s.amount_xlm || "0"), 0) || 0

    const totalEarnings = purchaseEarnings + tipEarnings + subscriptionEarnings

    const earnings = {
      totalEarnings: totalEarnings.toFixed(7),
      availableBalance: (creator?.total_earnings_xlm || 0).toFixed(7),
      lifetimeEarnings: totalEarnings.toFixed(7),
      breakdown: {
        purchases: purchaseEarnings.toFixed(7),
        tips: tipEarnings.toFixed(7),
        subscriptions: subscriptionEarnings.toFixed(7),
      },
    }

    return NextResponse.json({ earnings })
  } catch (error) {
    console.error("[v0] Error fetching earnings:", error)
    return NextResponse.json({ error: "Failed to fetch earnings" }, { status: 500 })
  }
}
