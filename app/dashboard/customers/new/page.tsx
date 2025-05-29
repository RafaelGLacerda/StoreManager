import { CustomerForm } from "@/components/customers/customer-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewCustomerPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/customers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Novo Cliente
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">Adicione um novo cliente ao sistema</p>
        </div>
      </div>

      <CustomerForm />
    </div>
  )
}
