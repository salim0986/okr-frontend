import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/progress`, {
      headers: {
        Authorization: token || "",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.description || "Failed to fetch progress updates" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")
    const body = await request.json()

    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.description || "Failed to create progress update" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 })
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 })
}
