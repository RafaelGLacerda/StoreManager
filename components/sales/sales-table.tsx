"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, User, Calendar, Package, DollarSign } from "lucide-react"
import type { Sale } from "@/lib/types"

interface SalesTableProps {
  sales: Sale[]
}

export function SalesTable({ sales }: SalesTableProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5 text-purple-600" />
          <span>Histórico de Vendas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Data</TableHead>
                <TableHead className="font-semibold">Itens</TableHead>
                <TableHead className="font-semibold">Total</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-mono text-sm">#{sale.id.slice(0, 8)}</TableCell>
                  <TableCell className="font-medium flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{sale.customerName}</span>
                  </TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(sale.date).toLocaleDateString("pt-BR")}</span>
                  </TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>{sale.items.length} itens</span>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600 dark:text-green-400 flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>R$ {sale.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Concluída
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
