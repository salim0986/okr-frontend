import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/organizations`,
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
      throw new Error(
        `Backend responded with ${response.status}. ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Organizations fetched successfully:", data);

    // Ensure we return an array
    const organizations = Array.isArray(data) ? data : [data];
    console.log(organizations);

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch organizations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
