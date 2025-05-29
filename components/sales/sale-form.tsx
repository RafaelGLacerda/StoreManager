"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, ShoppingCart, User, Package, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import type { Product, Customer } from "@/lib/types"

interface SaleItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export function SaleForm() {
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [items, setItems] = useState<SaleItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, customersRes] = await Promise.all([fetch("/api/products"), fetch("/api/customers")])

        const [productsData, customersData] = await Promise.all([productsRes.json(), customersRes.json()])

        setProducts(productsData)
        setCustomers(customersData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setError("Erro ao carregar dados")
      }
    }
    loadData()
  }, [])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setQuantity(1)
    } else {
      const numValue = Number.parseInt(value)
      if (!isNaN(numValue) && numValue > 0) {
        setQuantity(numValue)
      }
    }
  }

  const addItem = () => {
    const product = products.find((p) => p.id === selectedProduct)
    if (!product || quantity <= 0) return

    if (quantity > product.stock) {
      setError(`Estoque insuficiente. Disponível: ${product.stock}`)
      return
    }

    const existingItemIndex = items.findIndex((item) => item.productId === selectedProduct)

    if (existingItemIndex >= 0) {
      const updatedItems = [...items]
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity

      if (newQuantity > product.stock) {
        setError(`Estoque insuficiente. Disponível: ${product.stock}`)
        return
      }

      updatedItems[existingItemIndex].quantity = newQuantity
      updatedItems[existingItemIndex].total = newQuantity * product.price
      setItems(updatedItems)
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        total: quantity * product.price,
      }
      setItems([...items, newItem])
    }

    setSelectedProduct("")
    setQuantity(1)
    setError("")
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const total = items.reduce((sum, item) => sum + item.total, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer || items.length === 0) {
      setError("Selecione um cliente e adicione pelo menos um item")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const customer = customers.find((c) => c.id === selectedCustomer)

      console.log("Enviando dados da venda:", {
        customerId: selectedCustomer,
        customerName: customer?.name || "",
        items,
        total,
      })

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomer,
          customerName: customer?.name || "",
          items,
          total,
        }),
      })

      const result = await response.json()
      console.log("Resposta da API:", result)

      if (response.ok) {
        setSuccess("Venda registrada com sucesso!")
        setTimeout(() => {
          router.push("/dashboard/sales")
          router.refresh()
        }, 1500)
      } else {
        setError(result.error || "Erro ao registrar venda")
      }
    } catch (error) {
      console.error("Erro ao criar venda:", error)
      setError("Erro interno do servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-purple-600" />
            <span>Nova Venda</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20 mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 mb-6">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customer" className="text-sm font-medium flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>Cliente</span>
              </Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="product" className="text-sm font-medium flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span>Produto</span>
                </Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products
                      .filter((p) => p.stock > 0)
                      .map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - R$ {product.price.toFixed(2)} (Estoque: {product.stock})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantidade
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity || ""}
                  onChange={handleQuantityChange}
                  className="h-12"
                  placeholder="1"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={addItem}
                  disabled={!selectedProduct || quantity <= 0}
                  className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span>Itens da Venda</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead className="font-semibold">Produto</TableHead>
                    <TableHead className="font-semibold">Quantidade</TableHead>
                    <TableHead className="font-semibold">Preço Unit.</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-green-600 dark:text-green-400">R$ {item.price.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold text-green-600 dark:text-green-400">
                        R$ {item.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total da Venda:</span>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleSubmit}
                disabled={loading || !selectedCustomer || items.length === 0}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Finalizando...</span>
                  </div>
                ) : (
                  "Finalizar Venda"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/sales")} className="px-8">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
