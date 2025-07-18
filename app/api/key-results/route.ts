import { type NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth-utils";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let apiUrl = `${BACKEND_URL}/api/v1/key-result`;

    // // Apply role-based filtering through organizational hierarchy
    // switch (user.role) {
    //   case "admin":
    //     // Admin can see all key results
    //     break;
    //   case "org_admin":
    //     if (user.organizationId) {
    //       apiUrl = `${BACKEND_URL}/api/v1/key-result/organization/${user.organizationId}`;
    //       console.log(apiUrl);
    //     }
    //     break;
    //   case "dept_manager":
    //     if (user.departmentId) {
    //       apiUrl = `${BACKEND_URL}/api/v1/key-result/department/${user.departmentId}`;
    //     }
    //     break;
    //   case "team_lead":
    //   case "employee":
    //     if (user.teamId) {
    //       apiUrl = `${BACKEND_URL}/api/v1/key-result/team/${user.teamId}`;
    //     }
    //     break;
    // }

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
    const keyResults = Array.isArray(data) ? data : [data];
    return NextResponse.json(keyResults);
  } catch (error) {
    console.error("Error fetching key results:", error);
    return NextResponse.json(
      { error: "Failed to fetch key results" },
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

    const body = await request.json();

    // Validate that the objective belongs to user's scope
    const objectiveResponse = await fetch(
      `${BACKEND_URL}/api/v1/okr/${body.objectiveId}`,
      {
        headers: {
          Authorization: request.headers.get("authorization") || "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!objectiveResponse.ok) {
      return NextResponse.json({ error: "Invalid objective" }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/key-result`, {
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
    console.error("Error creating key result:", error);
    return NextResponse.json(
      { error: "Failed to create key result" },
      { status: 500 }
    );
  }
}
