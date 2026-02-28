import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const contentId = searchParams.get("contentId")

    if (!userId || !contentId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", userId)
      .eq("clip_id", contentId)
      .limit(1)

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to check purchase" }, { status: 500 })
    }

    const hasPurchased = data && data.length > 0

    return NextResponse.json({ hasPurchased })
  } catch (error) {
    console.error("[v0] Error checking purchase:", error)
    return NextResponse.json({ error: "Failed to check purchase" }, { status: 500 })
  }
}
