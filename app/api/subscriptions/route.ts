import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const creatorId = searchParams.get("creatorId")

    const supabase = await createServerClient()

    if (userId) {
      const { data: subscriptions, error } = await supabase
        .from("subscriptions")
        .select(
          `
          *,
          creator:creators(
            id,
            user:users(
              username,
              display_name,
              avatar_url
            )
          )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Database error:", error)
        return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
      }

      return NextResponse.json({ subscriptions: subscriptions || [] })
    }

    if (creatorId) {
      const { data: creator, error } = await supabase
        .from("creators")
        .select("subscription_price_xlm, subscription_duration_days, subscriber_count")
        .eq("id", creatorId)
        .single()

      if (error) {
        console.error("[v0] Database error:", error)
        return NextResponse.json({ error: "Failed to fetch subscription tiers" }, { status: 500 })
      }

      return NextResponse.json({ tier: creator })
    }

    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, creatorId, transactionHash, amountXlm, durationDays } = body

    if (!userId || !creatorId || !transactionHash || !amountXlm) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + (durationDays || 30))

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        creator_id: creatorId,
        amount_xlm: Number.parseFloat(amountXlm),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        is_active: true,
        stellar_tx_hash: transactionHash,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
    }

    // Update subscriber count
    await supabase.rpc("increment_subscriber_count", { creator_id: creatorId })

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    console.error("[v0] Error creating subscription:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
