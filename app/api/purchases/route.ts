import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data: purchases, error } = await supabase
      .from("purchases")
      .select(
        `
        *,
        clip:clips(
          id,
          title,
          description,
          content_type,
          thumbnail_url,
          duration_seconds,
          creator:creators(
            user:users(
              username,
              display_name
            )
          )
        )
      `,
      )
      .eq("user_id", userId)
      .order("purchased_at", { ascending: false })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 })
    }

    return NextResponse.json({ purchases: purchases || [] })
  } catch (error) {
    console.error("[v0] Error fetching purchases:", error)
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, clipId, transactionHash, amountXlm, platformFeeXlm, creatorEarningsXlm } = body

    if (!userId || !clipId || !transactionHash || !amountXlm) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        user_id: userId,
        clip_id: clipId,
        amount_xlm: Number.parseFloat(amountXlm),
        platform_fee_xlm: Number.parseFloat(platformFeeXlm || "0"),
        creator_earnings_xlm: Number.parseFloat(creatorEarningsXlm || amountXlm),
        stellar_tx_hash: transactionHash,
      })
      .select()
      .single()

    if (purchaseError) {
      console.error("[v0] Database error:", purchaseError)
      return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 })
    }

    // Update purchase count
    await supabase.rpc("increment_purchase_count", { clip_id: clipId })

    return NextResponse.json({ success: true, purchase })
  } catch (error) {
    console.error("[v0] Error creating purchase:", error)
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 })
  }
}
