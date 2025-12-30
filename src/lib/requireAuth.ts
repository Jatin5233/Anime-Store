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
