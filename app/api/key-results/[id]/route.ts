import { type NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-utils";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/v1/key-result/${id}`, {
      headers: {
        Authorization: request.headers.get("authorization") || "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching key result:", error);
    return NextResponse.json(
      { error: "Failed to fetch key result" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/v1/key-result/${id}`, {
      method: "PUT",
      headers: {
        Authorization: request.headers.get("authorization") || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating key result:", error);
    return NextResponse.json(
      { error: "Failed to update key result" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const response = await fetch(`${BACKEND_URL}/api/v1/key-result/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: request.headers.get("authorization") || "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting key result:", error);
    return NextResponse.json(
      { error: "Failed to delete key result" },
      { status: 500 }
    );
  }
}
