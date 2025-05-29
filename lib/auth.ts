import { cookies } from "next/headers"
import type { Session } from "./types"

// Simulação de banco de dados em memória
const users: any[] = [
  {
    id: "1",
    name: "Admin Demo",
    email: "admin@demo.com",
    password: "123456",
    storeName: "Loja Demo",
    createdAt: new Date().toISOString(),
  },
]

export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return session
  } catch {
    return null
  }
}

export async function createSession(user: any) {
  const session: Session = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }

  const cookieStore = cookies()
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return session
}

export async function destroySession() {
  const cookieStore = cookies()
  cookieStore.delete("session")
}

export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email)
}

export function createUser(userData: any) {
  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    password: userData.password,
    storeName: userData.storeName,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  return newUser
}
