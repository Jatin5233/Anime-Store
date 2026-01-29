import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // If using cookies
  res.cookies.set("accessToken", "", { maxAge: 0 });
  res.cookies.set("refreshToken", "", { maxAge: 0 });

  return res;
}
