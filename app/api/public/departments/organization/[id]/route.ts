import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    console.log("Fetching departments for organization:", id);

    const response = await fetch(
      `${backendUrl}/api/v1/department/organization/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Backend response not ok:",
        response.status,
        response.statusText
      );
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    console.log("Departments fetched successfully:", data);

    // Ensure we return an array
    const departments = Array.isArray(data) ? data : [data];

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch departments",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
