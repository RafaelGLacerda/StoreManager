"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Package,
  Barcode,
  DollarSign,
  Hash,
  Building,
  Calendar,
  ImageIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    barcode: product?.barcode || "",
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    manufacturer: product?.manufacturer || "",
    manufacturingDate: product?.manufacturingDate || "",
    expiryDate: product?.expiryDate || "",
    image: product?.image || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setFormData({ ...formData, price: 0 })
    } else {
      const numValue = Number.parseFloat(value)
      if (!isNaN(numValue)) {
        setFormData({ ...formData, price: numValue })
      }
    }
  }

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setFormData({ ...formData, stock: 0 })
    } else {
      const numValue = Number.parseInt(value)
      if (!isNaN(numValue)) {
        setFormData({ ...formData, stock: numValue })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const url = "/api/products"
      const method = product ? "PUT" : "POST"
      const body = product ? { id: product.id, ...formData } : formData

      console.log("Enviando dados:", body)

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const result = await response.json()
      console.log("Resposta da API:", result)

      if (response.ok) {
        setSuccess(product ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!")
        setTimeout(() => {
          router.push("/dashboard/products")
          router.refresh()
        }, 1500)
      } else {
        setError(result.error || "Erro ao salvar produto")
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      setError("Erro interno do servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-blue-600" />
          <span>{product ? "Editar Produto" : "Novo Produto"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span>Nome do Produto</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12"
                placeholder="Digite o nome do produto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode" className="text-sm font-medium flex items-center space-x-2">
                <Barcode className="h-4 w-4 text-gray-500" />
                <span>Código de Barras</span>
              </Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="h-12 font-mono"
                placeholder="7891234567890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span>Preço</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ""}
                onChange={handlePriceChange}
                className="h-12"
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm font-medium flex items-center space-x-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span>Estoque</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock || ""}
                onChange={handleStockChange}
                className="h-12"
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer" className="text-sm font-medium flex items-center space-x-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span>Fabricante</span>
              </Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="h-12"
                placeholder="Nome do fabricante"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium flex items-center space-x-2">
                <ImageIcon className="h-4 w-4 text-gray-500" />
                <span>URL da Imagem</span>
              </Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="h-12"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturingDate" className="text-sm font-medium flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Data de Fabricação</span>
              </Label>
              <Input
                id="manufacturingDate"
                type="date"
                value={formData.manufacturingDate}
                onChange={(e) => setFormData({ ...formData, manufacturingDate: e.target.value })}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-sm font-medium flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Data de Validade</span>
              </Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Descrição detalhada do produto..."
              className="resize-none"
            />
          </div>

          <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Salvando...</span>
                </div>
              ) : (
                "Salvar Produto"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/products")} className="px-8">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
