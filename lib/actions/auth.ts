"use server"

import { redirect } from "next/navigation"
import { findUserByEmail, createUser, createSession, destroySession, getAllUsers } from "../auth"

export async function login(email: string, password: string) {
  console.log("Tentativa de login:", email)

  const user = findUserByEmail(email)
  console.log("Usuário encontrado:", user ? "Sim" : "Não")

  if (!user) {
    console.log("Usuário não encontrado")
    return { success: false, error: "Email não encontrado. Verifique se você já criou uma conta." }
  }

  console.log("Verificando senha:", { fornecida: password, salva: user.password })

  if (user.password !== password) {
    console.log("Senha incorreta")
    return { success: false, error: "Senha incorreta" }
  }

  console.log("Login bem-sucedido")
  await createSession(user)
  return { success: true }
}

export async function register(userData: {
  name: string
  email: string
  password: string
  storeName: string
}) {
  console.log("Tentativa de registro:", userData.email)

  const existingUser = findUserByEmail(userData.email)

  if (existingUser) {
    console.log("Email já existe")
    return { success: false, error: "Email já cadastrado" }
  }

  const user = createUser(userData)
  console.log("Usuário criado com sucesso:", user.email)

  await createSession(user)
  return { success: true }
}

export async function logout() {
  await destroySession()
  redirect("/login")
}

// Função para debug - listar todos os usuários
export async function debugUsers() {
  const users = getAllUsers()
  console.log(
    "Usuários cadastrados:",
    users.map((u) => ({ email: u.email, name: u.name })),
  )
  return users
}
