import { SaleForm } from "@/components/sales/sale-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewSalePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/sales">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Nova Venda
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">Registre uma nova venda no sistema</p>
        </div>
      </div>

      <SaleForm />
    </div>
  )
}
