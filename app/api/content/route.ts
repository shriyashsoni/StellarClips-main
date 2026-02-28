import { NextResponse } from "next/server"

export async function GET(request: Request) {
  void request
  return NextResponse.json({ content: [], source: "onchain" })
}

export async function POST(request: Request) {
  void request
  return NextResponse.json(
    { error: "Off-chain content API is disabled. Use smart contracts and on-chain indexer." },
    { status: 501 },
  )
}
