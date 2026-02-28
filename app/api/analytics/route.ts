import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const creatorId = searchParams.get("creatorId")

  if (!creatorId) {
    return NextResponse.json({ error: "creatorId is required" }, { status: 400 })
  }

  return NextResponse.json({
    analytics: {
      views: 0,
      purchases: 0,
      revenue: "0.0000000",
      subscribers: 0,
      conversionRate: "0.00",
      topContent: [],
      revenueChart: [],
    },
    source: "onchain",
  })
}
