import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Use the regular departments endpoint
    const response = await fetch(
      `${BACKEND_URL}/api/v1/department/organization/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Backend responded with ${response.status}: ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Failed to fetch departments from backend" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Fetched departments for org", id, ":", data);

    // Ensure we return an array
    const departments = Array.isArray(data) ? data : [data];
    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching public departments:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 }
    );
  }
}
