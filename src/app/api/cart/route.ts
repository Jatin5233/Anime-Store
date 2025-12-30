import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Cart } from "@/models/Cart";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: Request) {
  await connectDB();

  // Require authenticated user
  const auth = requireAuth(req);
  if ((auth as any)?.status === 401) return auth as NextResponse;
  const { userId } = auth as { userId: string };

  const cart = await Cart.findOne({ userId })
    .populate("items.product")
    .lean();

  return NextResponse.json({
    success: true,
    cart: cart ?? { items: [] },
  });
}
