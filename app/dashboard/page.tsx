"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ShoppingCart, AlertTriangle, DollarSign, Store } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import type { Product, Customer, Sale } from "@/lib/types"

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, customersRes, salesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/customers"),
          fetch("/api/sales"),
        ])

        const [productsData, customersData, salesData] = await Promise.all([
          productsRes.json(),
          customersRes.json(),
          salesRes.json(),
        ])

        setProducts(productsData)
        setCustomers(customersData)
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
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
  const lowStockProducts = products.filter((p) => p.stock <= 5)
  const averageTicket = sales.length > 0 ? totalRevenue / sales.length : 0

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Bem-vindo de volta! Aqui está o resumo da sua loja.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total de Produtos</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Package className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{products.length}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {lowStockProducts.length > 0 ? `${lowStockProducts.length} com estoque baixo` : "Todos com estoque ok"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Clientes</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{customers.length}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Clientes cadastrados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Vendas</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{sales.length}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Vendas realizadas</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Receita Total</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Ticket médio: R$ {averageTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {products.length === 0 && sales.length === 0 && customers.length === 0 ? (
        <EmptyState
          icon={Store}
          title="Bem-vindo ao seu sistema de gestão!"
          description="Comece adicionando produtos, clientes e registrando vendas para ver suas estatísticas aqui."
          actionLabel="Adicionar primeiro produto"
          actionHref="/dashboard/products/new"
        />
      ) : (
        <>
          {lowStockProducts.length > 0 && (
            <Card className="border-l-4 border-l-yellow-500 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-yellow-700 dark:text-yellow-300">Produtos com Estoque Baixo</CardTitle>
                </div>
                <CardDescription>Produtos que precisam de reposição (estoque ≤ 5)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                    >
                      <div>
                        <span className="font-medium text-yellow-800 dark:text-yellow-200">{product.name}</span>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">R$ {product.price.toFixed(2)}</p>
                      </div>
                      <span className="text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                        {product.stock}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {sales.length === 0 && (
            <EmptyState
              icon={ShoppingCart}
              title="Nenhuma venda registrada"
              description="Registre sua primeira venda para começar a acompanhar o desempenho da sua loja."
              actionLabel="Registrar primeira venda"
              actionHref="/dashboard/sales/new"
            />
          )}
        </>
      )}
    </div>
  )
}
