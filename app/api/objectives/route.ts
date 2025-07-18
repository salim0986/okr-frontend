import { type NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-utils";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let apiUrl = `${BACKEND_URL}/api/v1/okr`;

    // Apply role-based filtering
    switch (user.role) {
      case "admin":
        // Admin can see all objectives
        break;
      case "org_admin":
        if (user.organizationId) {
          apiUrl = `${BACKEND_URL}/api/v1/okr/organization/${user.organizationId}`;
        }
        break;
      case "dept_manager":
        if (user.departmentId) {
          apiUrl = `${BACKEND_URL}/api/v1/okr/department/${user.departmentId}`;
        }
        break;
      case "team_lead":
      case "employee":
        if (user.teamId) {
          apiUrl = `${BACKEND_URL}/api/v1/okr/team/${user.teamId}`;
        }
        break;
    }

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: request.headers.get("authorization") || "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    // Ensure we return an array for consistency
    const objectives = Array.isArray(data) ? data : [data];
    return NextResponse.json(objectives);
  } catch (error) {
    console.error("Error fetching objectives:", error);
    return NextResponse.json(
      { error: "Failed to fetch objectives" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user can create objectives
    if (
      !["admin", "org_admin", "dept_manager", "team_lead"].includes(user.role)
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Auto-assign organizational context based on user role
    if (user.role === "org_admin" && user.organizationId) {
      body.organizationId = user.organizationId;
    }
    if (user.role === "dept_manager" && user.departmentId) {
      body.departmentId = user.departmentId;
    }
    if (user.role === "team_lead" && user.teamId) {
      body.teamId = user.teamId;
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/okr`, {
      method: "POST",
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
    console.error("Error creating objective:", error);
    return NextResponse.json(
      { error: "Failed to create objective" },
      { status: 500 }
    );
  }
}
