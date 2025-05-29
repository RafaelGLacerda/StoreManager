"use client"

import { useEffect, useState } from "react"
import { SalesTable } from "@/components/sales/sales-table"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingCart } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"
import type { Sale } from "@/lib/types"

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSales = async () => {
    try {
      const response = await fetch("/api/sales")
      const data = await response.json()
      setSales(data)
    } catch (error) {
      console.error("Erro ao carregar vendas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Vendas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">Gerencie as vendas da sua loja</p>
        </div>
        <Link href="/dashboard/sales/new">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </Link>
      </div>

      {sales.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Nenhuma venda registrada"
          description="Registre sua primeira venda para começar a acompanhar o desempenho da sua loja."
          actionLabel="Registrar primeira venda"
          actionHref="/dashboard/sales/new"
        />
      ) : (
        <SalesTable sales={sales} />
      )}
    </div>
  )
}
