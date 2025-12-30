import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Product } from "@/models/Product";
import { requireAuth } from "@/lib/requireAuth";
import { requireAdmin } from "@/lib/requireAdmin";
import { User } from "@/models/User";
export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (auth instanceof Response) return auth;
  const adminError = requireAdmin(auth);
  if (adminError) return adminError;

  await connectDB();
  const count = await User.countDocuments();

  return NextResponse.json({ count });
}
