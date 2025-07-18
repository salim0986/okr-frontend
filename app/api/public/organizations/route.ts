import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET() {
  try {
    console.log(
      "Fetching organizations from:",
      `${BACKEND_URL}/api/v1/organization`
    );

    const response = await fetch(`${BACKEND_URL}/api/v1/organizations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      console.error(
        `Backend responded with ${response.status}: ${response.statusText}`
      );
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Organizations data:", data);

    // Ensure we return an array
    const organizations = Array.isArray(data) ? data : [data];
    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 }
    );
  }
}
