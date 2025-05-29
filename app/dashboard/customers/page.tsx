"use client"

import { useEffect, useState } from "react"
import { CustomersTable } from "@/components/customers/customers-table"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"
import type { Customer } from "@/lib/types"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">Gerencie os clientes da sua loja</p>
        </div>
        <Link href="/dashboard/customers/new">
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      {customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente cadastrado"
          description="Comece adicionando clientes para gerenciar suas vendas e relacionamento."
          actionLabel="Adicionar primeiro cliente"
          actionHref="/dashboard/customers/new"
        />
      ) : (
        <CustomersTable customers={customers} onUpdate={fetchCustomers} />
      )}
    </div>
  )
}
