"use client"

import { useEffect, useState } from "react"
import { ProductsTable } from "@/components/products/products-table"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Produtos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">Gerencie o catálogo de produtos da sua loja</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nenhum produto cadastrado"
          description="Comece adicionando produtos ao seu catálogo para gerenciar seu estoque e vendas."
          actionLabel="Adicionar primeiro produto"
          actionHref="/dashboard/products/new"
        />
      ) : (
        <ProductsTable products={products} onUpdate={fetchProducts} />
      )}
    </div>
  )
}
