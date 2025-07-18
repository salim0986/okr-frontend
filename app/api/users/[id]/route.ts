import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/user/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: token || "",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.description || "Failed to delete user" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/user/${params.id}`, {
      headers: {
        Authorization: token || "",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.description || "Failed to fetch user" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")
    const body = await request.json()

    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/user/${params.id}`, {
      method: "PATCH", // Assuming PATCH for partial updates
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.description || "Failed to update user" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
