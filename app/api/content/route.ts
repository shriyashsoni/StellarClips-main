import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "recent"
    const creatorId = searchParams.get("creatorId")

    const supabase = await createServerClient()

    let query = supabase
      .from("clips")
      .select(
        `
        *,
        creator:creators(
          id,
          user:users(
            id,
            username,
            display_name,
            avatar_url
          )
        )
      `,
      )
      .eq("is_published", true)

    if (category && category !== "all") {
      query = query.eq("content_type", category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (creatorId) {
      query = query.eq("creator_id", creatorId)
    }

    switch (sortBy) {
      case "popular":
        query = query.order("view_count", { ascending: false })
        break
      case "price-low":
        query = query.order("price_xlm", { ascending: true })
        break
      case "price-high":
        query = query.order("price_xlm", { ascending: false })
        break
      case "recent":
      default:
        query = query.order("created_at", { ascending: false })
        break
    }

    const { data: content, error } = await query

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
    }

    return NextResponse.json({ content: content || [] })
  } catch (error) {
    console.error("[v0] Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { creatorId, title, description, contentType, ipfsHash, thumbnailUrl, priceXlm, durationSeconds } = body

    if (!creatorId || !title || !contentType || !priceXlm) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data: content, error } = await supabase
      .from("clips")
      .insert({
        creator_id: creatorId,
        title,
        description,
        content_type: contentType,
        ipfs_hash: ipfsHash,
        thumbnail_url: thumbnailUrl,
        price_xlm: Number.parseFloat(priceXlm),
        duration_seconds: durationSeconds,
        is_published: true,
        view_count: 0,
        purchase_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
    }

    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error("[v0] Error creating content:", error)
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
  }
}
