import { NextRequest, NextResponse } from "next/server"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteContext) {
  void request
  await params
  return NextResponse.json({ error: "Use on-chain content lookup via indexer." }, { status: 501 })
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  void request
  await params
  return NextResponse.json({ error: "Use smart contract methods to update content." }, { status: 501 })
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  void request
  void params
  return NextResponse.json({ error: "Use smart contract methods to unpublish content." }, { status: 501 })
}
