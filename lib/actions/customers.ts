"use server"

import { revalidatePath } from "next/cache"
import { customers } from "../data"

export async function createCustomer(customerData: any) {
  const newCustomer = {
    id: Date.now().toString(),
    ...customerData,
    createdAt: new Date().toISOString(),
  }

  customers.push(newCustomer)
  revalidatePath("/dashboard/customers")
  return newCustomer
}

export async function deleteCustomer(id: string) {
  const index = customers.findIndex((c) => c.id === id)
  if (index !== -1) {
    customers.splice(index, 1)
    revalidatePath("/dashboard/customers")
    return true
  }
  throw new Error("Cliente não encontrado")
}
