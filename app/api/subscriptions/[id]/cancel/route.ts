import { NextResponse } from "next/server"
import { subscriptionManager } from "@/lib/indexer/subscription-manager"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const subscriptionId = params.id
    const body = await request.json()
    const { userId } = body

    const result = await subscriptionManager.cancelSubscription(subscriptionId, userId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error canceling subscription:", error)
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
  }
}
