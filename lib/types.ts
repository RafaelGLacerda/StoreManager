export interface User {
  id: string
  name: string
  email: string
  storeName: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  barcode: string
  price: number
  stock: number
  manufacturer: string
  manufacturingDate: string
  expiryDate: string
  image: string
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  createdAt: string
}

export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Sale {
  id: string
  customerId: string
  customerName: string
  items: SaleItem[]
  total: number
  date: string
}

export interface Session {
  user: {
    id: string
    name: string
    email: string
  }
}
