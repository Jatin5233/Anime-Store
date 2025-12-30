import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  return NextResponse.json({
    success: true,
    message: "You are authenticated",
    user: auth,
  });
}
