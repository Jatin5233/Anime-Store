import { NextResponse } from "next/server";
import { AuthUser } from "@/lib/auth";

export function requireAdmin(user: AuthUser) {
  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "Admin access required" },
      { status: 403 }
    );
  }
}
