import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

export interface DecodedToken {
  id: string;
  email: string;
  role: "admin" | "org_admin" | "dept_manager" | "team_lead" | "employee";
  organizationId?: string;
  organizationName?: string;
  departmentId?: string;
  departmentName?: string;
  teamId?: string;
  teamName?: string;
  iat?: number;
  exp?: number;
}

export function getUserFromRequest(request: NextRequest): DecodedToken | null {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.decode(token) as DecodedToken;

    if (!decoded || !decoded.id) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function getFilteredUrl(baseUrl: string, user: DecodedToken): string {
  switch (user.role) {
    case "admin":
      return baseUrl;
    case "org_admin":
      if (user.organizationId) {
        return `${baseUrl}/organization/${user.organizationId}`;
      }
      break;
    case "dept_manager":
      if (user.departmentId) {
        return `${baseUrl}/department/${user.departmentId}`;
      }
      break;
    case "team_lead":
    case "employee":
      if (user.teamId) {
        return `${baseUrl}/team/${user.teamId}`;
      }
      break;
  }
  return baseUrl;
}

export function canUserCreate(
  user: DecodedToken,
  entityType:
    | "organization"
    | "department"
    | "team"
    | "user"
    | "objective"
    | "keyresult"
): boolean {
  switch (entityType) {
    case "organization":
      return user.role === "admin";
    case "department":
      return ["admin", "org_admin"].includes(user.role);
    case "team":
      return ["admin", "org_admin", "dept_manager"].includes(user.role);
    case "user":
      return ["admin", "org_admin", "dept_manager", "team_lead"].includes(
        user.role
      );
    case "objective":
      return ["admin", "org_admin", "dept_manager", "team_lead"].includes(
        user.role
      );
    case "keyresult":
      return [
        "admin",
        "org_admin",
        "dept_manager",
        "team_lead",
        "employee",
      ].includes(user.role);
    default:
      return false;
  }
}
