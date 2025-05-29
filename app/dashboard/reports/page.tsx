"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesChart } from "@/components/reports/sales-chart"
import { TopProductsChart } from "@/components/reports/top-products-chart"
import { BarChart3, TrendingUp, DollarSign, ShoppingCart } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import type { Product, Sale } from "@/lib/types"

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, salesRes] = await Promise.all([fetch("/api/products"), fetch("/api/sales")])

        const [productsData, salesData] = await Promise.all([productsRes.json(), salesRes.json()])

        setProducts(productsData)
        setSales(salesData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
  const averageTicket = sales.length > 0 ? totalRevenue / sales.length : 0

  // Vendas por mês
  const salesByMonth = sales.reduce(
    (acc, sale) => {
      const month = new Date(sale.date).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
      acc[month] = (acc[month] || 0) + sale.total
      return acc
    },
    {} as Record<string, number>,
  )

  // Produtos mais vendidos
  const productSales = sales
    .flatMap((sale) => sale.items)
    .reduce(
      (acc, item) => {
        acc[item.productId] = (acc[item.productId] || 0) + item.quantity
        return acc
      },
      {} as Record<string, number>,
    )

  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId)
      return { name: product?.name || "Produto não encontrado", quantity }
    })

  if (sales.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Relatórios
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">Análise de vendas e performance da loja</p>
        </div>

        <EmptyState
          icon={BarChart3}
          title="Nenhum dado para relatórios"
          description="Registre algumas vendas para ver relatórios e análises detalhadas da sua loja."
          actionLabel="Registrar primeira venda"
          actionHref="/dashboard/sales/new"
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Relatórios
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">Análise de vendas e performance da loja</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Receita Total</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Total de vendas realizadas</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Ticket Médio</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              R$ {averageTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Valor médio por venda</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total de Vendas</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{sales.length}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Vendas realizadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Vendas por Mês</span>
            </CardTitle>
            <CardDescription>Evolução das vendas mensais</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesByMonth} />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Produtos Mais Vendidos</span>
            </CardTitle>
            <CardDescription>Top 5 produtos por quantidade vendida</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProductsChart data={topProducts} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
