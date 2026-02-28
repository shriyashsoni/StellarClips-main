import { NextResponse } from "next/server"

export async function GET(request: Request) {
  void request
  return NextResponse.json({ hasPurchased: false, source: "onchain" })
}
