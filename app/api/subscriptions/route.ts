import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const creatorId = searchParams.get("creatorId")

  if (userId) {
    return NextResponse.json({ subscriptions: [], source: "onchain" })
  }

  if (creatorId) {
    return NextResponse.json({ tier: null, source: "onchain" })
  }

  return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
}

export async function POST(request: Request) {
  void request
  return NextResponse.json(
    { error: "Off-chain subscriptions API is disabled. Use subscription smart contract + indexer." },
    { status: 501 },
  )
}
