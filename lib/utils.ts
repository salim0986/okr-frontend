import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This function provides headers for API calls.
// It's designed to be flexible: if a token is provided, it includes Authorization.
// Otherwise, it just ensures Content-Type is set for unauthenticated calls.
export function getAuthHeaders(token?: string) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    (headers as any).Authorization = `Bearer ${token}`;
  }
  return headers;
}
