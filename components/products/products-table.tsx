"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Search, Package, AlertTriangle } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/types"

interface ProductsTableProps {
  products: Product[]
  onUpdate: () => void
}

export function ProductsTable({ products, onUpdate }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const response = await fetch(`/api/products?id=${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          onUpdate()
        }
      } catch (error) {
        console.error("Erro ao deletar produto:", error)
      }
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Sem estoque", variant: "destructive" as const, icon: AlertTriangle }
    if (stock <= 5) return { label: "Estoque baixo", variant: "secondary" as const, icon: AlertTriangle }
    return { label: "Em estoque", variant: "default" as const, icon: Package }
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-blue-600" />
          <span>Catálogo de Produtos</span>
        </CardTitle>
        <div className="flex items-center space-x-2 mt-4">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar produtos por nome, código ou fabricante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="font-semibold">Nome</TableHead>
                <TableHead className="font-semibold">Código de Barras</TableHead>
                <TableHead className="font-semibold">Preço</TableHead>
                <TableHead className="font-semibold">Estoque</TableHead>
                <TableHead className="font-semibold">Fabricante</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                return (
                  <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="font-mono text-sm">{product.barcode}</TableCell>
                    <TableCell className="font-semibold text-green-600 dark:text-green-400">
                      R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="font-semibold">{product.stock}</TableCell>
                    <TableCell>{product.manufacturer}</TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant} className="flex items-center space-x-1 w-fit">
                        <stockStatus.icon className="h-3 w-3" />
                        <span>{stockStatus.label}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
