import { type NextRequest, NextResponse } from "next/server"
import { getCustomers, createCustomer, deleteCustomer } from "@/lib/data"

export async function GET() {
  try {
    const customers = getCustomers()
    return NextResponse.json(customers)
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const customerData = await request.json()
    console.log("Dados recebidos para criar cliente:", customerData)

    const customer = createCustomer(customerData)
    console.log("Cliente criado:", customer)

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do cliente é obrigatório" }, { status: 400 })
    }

    deleteCustomer(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar cliente:", error)
    return NextResponse.json({ error: "Erro ao deletar cliente" }, { status: 500 })
  }
}
