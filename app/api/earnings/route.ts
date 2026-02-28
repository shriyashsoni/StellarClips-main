import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const creatorId = searchParams.get("creatorId")

  if (!creatorId) {
    return NextResponse.json({ error: "creatorId is required" }, { status: 400 })
  }

  return NextResponse.json({
    earnings: {
      totalEarnings: "0.0000000",
      availableBalance: "0.0000000",
      lifetimeEarnings: "0.0000000",
      breakdown: {
        purchases: "0.0000000",
        tips: "0.0000000",
        subscriptions: "0.0000000",
      },
    },
    source: "onchain",
  })
}
