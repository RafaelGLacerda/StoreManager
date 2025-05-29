import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail, createUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const existingUser = findUserByEmail(userData.email)

    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email já cadastrado" }, { status: 400 })
    }

    const user = createUser(userData)
    await createSession(user)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
