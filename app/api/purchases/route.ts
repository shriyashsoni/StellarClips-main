import { NextResponse } from "next/server"

export async function GET(request: Request) {
  void request
  return NextResponse.json({ purchases: [], source: "onchain" })
}

export async function POST(request: Request) {
  void request
  return NextResponse.json(
    { error: "Off-chain purchases API is disabled. Use payment smart contract + indexer." },
    { status: 501 },
  )
}
