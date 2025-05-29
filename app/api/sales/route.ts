import { type NextRequest, NextResponse } from "next/server"
import { getSales, createSale } from "@/lib/data"

export async function GET() {
  try {
    const sales = getSales()
    return NextResponse.json(sales)
  } catch (error) {
    console.error("Erro ao buscar vendas:", error)
    return NextResponse.json({ error: "Erro ao buscar vendas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const saleData = await request.json()
    console.log("Dados recebidos para criar venda:", saleData)

    const sale = createSale(saleData)
    console.log("Venda criada:", sale)

    return NextResponse.json(sale)
  } catch (error) {
    console.error("Erro ao criar venda:", error)
    return NextResponse.json({ error: "Erro ao criar venda" }, { status: 500 })
  }
}
