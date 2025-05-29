"use server"

import { revalidatePath } from "next/cache"
import { products } from "../data"

export async function createProduct(productData: any) {
  const newProduct = {
    id: Date.now().toString(),
    ...productData,
    createdAt: new Date().toISOString(),
  }

  products.push(newProduct)
  revalidatePath("/dashboard/products")
  return newProduct
}

export async function updateProduct(id: string, productData: any) {
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...productData }
    revalidatePath("/dashboard/products")
    return products[index]
  }
  throw new Error("Produto não encontrado")
}

export async function deleteProduct(id: string) {
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products.splice(index, 1)
    revalidatePath("/dashboard/products")
    return true
  }
  throw new Error("Produto não encontrado")
}
