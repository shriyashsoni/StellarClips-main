import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const contentId = params.id
    const supabase = await createServerClient()

    const { data: content, error } = await supabase
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
            avatar_url,
            stellar_address
          )
        )
      `,
      )
      .eq("id", contentId)
      .single()

    if (error || !content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error("[v0] Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const contentId = params.id
    const body = await request.json()
    const supabase = await createServerClient()

    const { title, description, priceXlm, isPublished, thumbnailUrl } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (priceXlm !== undefined) updateData.price_xlm = Number.parseFloat(priceXlm)
    if (isPublished !== undefined) updateData.is_published = isPublished
    if (thumbnailUrl !== undefined) updateData.thumbnail_url = thumbnailUrl
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from("clips").update(updateData).eq("id", contentId).select().single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
    }

    return NextResponse.json({ success: true, content: data })
  } catch (error) {
    console.error("[v0] Error updating content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const contentId = params.id
    const supabase = await createServerClient()

    const { error } = await supabase
      .from("clips")
      .update({ is_published: false, updated_at: new Date().toISOString() })
      .eq("id", contentId)

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting content:", error)
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
  }
}
