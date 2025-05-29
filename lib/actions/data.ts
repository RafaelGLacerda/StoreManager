"use server"

import { products, customers, sales } from "../data"

export async function getProducts() {
  return products
}

export async function getProductById(id: string) {
  return products.find((p) => p.id === id)
}

export async function getCustomers() {
  return customers
}

export async function getSales() {
  return sales
}
