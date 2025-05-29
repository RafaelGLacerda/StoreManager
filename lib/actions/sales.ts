"use server"

import { revalidatePath } from "next/cache"
import { sales, products } from "../data"

export async function createSale(saleData: any) {
  // Atualizar estoque dos produtos
  for (const item of saleData.items) {
    const productIndex = products.findIndex((p) => p.id === item.productId)
    if (productIndex !== -1) {
      products[productIndex].stock -= item.quantity
    }
  }

  const newSale = {
    id: Date.now().toString(),
    ...saleData,
    date: new Date().toISOString(),
  }

  sales.push(newSale)
  revalidatePath("/dashboard/sales")
  revalidatePath("/dashboard/products")
  revalidatePath("/dashboard")
  return newSale
}
