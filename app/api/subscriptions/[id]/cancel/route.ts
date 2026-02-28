import { NextRequest, NextResponse } from "next/server"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: RouteContext) {
  void request
  await params
  void params
  return NextResponse.json(
    { error: "Backend subscription routes are disabled. Use smart contract invoke from frontend." },
    { status: 501 },
  )
}
