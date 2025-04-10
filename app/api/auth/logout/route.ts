import { NextResponse } from "next/server"
import { logout } from "@/lib/auth/auth"

export async function POST() {
  logout()
  return NextResponse.json({ success: true })
}
