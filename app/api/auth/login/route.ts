import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = findUserByEmail(email)

    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: "Email ou senha inválidos" }, { status: 401 })
    }

    await createSession(user)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
