import { NextResponse } from "next/server";
import { verifyAccessToken, AuthUser } from "@/lib/auth";

export function requireAuth(req: Request): AuthUser | NextResponse {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    return verifyAccessToken(token);
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export function isNextResponse(value: unknown): value is NextResponse {
  try {
    return (
      typeof value === "object" &&
      value !== null &&
      // NextResponse has a status property (number) and headers function
      "status" in (value as object) &&
      typeof (value as { status?: unknown }).status === "number"
    );
  } catch {
    return false;
  }
}
