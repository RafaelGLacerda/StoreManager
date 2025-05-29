import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/data"

export async function GET() {
  try {
    const products = getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    console.log("Dados recebidos para criar produto:", productData)

    const product = createProduct(productData)
    console.log("Produto criado:", product)

    return NextResponse.json(product)
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...productData } = await request.json()
    console.log("Dados recebidos para atualizar produto:", { id, productData })

    const product = updateProduct(id, productData)
    console.log("Produto atualizado:", product)

    return NextResponse.json(product)
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do produto é obrigatório" }, { status: 400 })
    }

    deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 })
  }
}
