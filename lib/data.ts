import type { Product, Customer, Sale } from "./types"

// Simulação de banco de dados em memória
const products: Product[] = []
const customers: Customer[] = []
const sales: Sale[] = []

// Produtos
export function getProducts() {
  return products
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}

export function createProduct(productData: any) {
  const newProduct = {
    id: Date.now().toString(),
    ...productData,
    createdAt: new Date().toISOString(),
  }
  products.push(newProduct)
  return newProduct
}

export function updateProduct(id: string, productData: any) {
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...productData }
    return products[index]
  }
  throw new Error("Produto não encontrado")
}

export function deleteProduct(id: string) {
  const index = products.findIndex((p) => p.id === id)
  if (index !== -1) {
    products.splice(index, 1)
    return true
  }
  throw new Error("Produto não encontrado")
}

// Clientes
export function getCustomers() {
  return customers
}

export function createCustomer(customerData: any) {
  const newCustomer = {
    id: Date.now().toString(),
    ...customerData,
    createdAt: new Date().toISOString(),
  }
  customers.push(newCustomer)
  return newCustomer
}

export function deleteCustomer(id: string) {
  const index = customers.findIndex((c) => c.id === id)
  if (index !== -1) {
    customers.splice(index, 1)
    return true
  }
  throw new Error("Cliente não encontrado")
}

// Vendas
export function getSales() {
  return sales
}

export function createSale(saleData: any) {
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
  return newSale
}
