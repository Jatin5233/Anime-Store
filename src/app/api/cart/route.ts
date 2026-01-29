import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Cart } from "@/models/Cart";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";

export async function GET(req: Request) {
  await connectDB();

  // Require authenticated user
  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  let cart = await Cart.findOne({ userId })
    .populate("items.product")
    .lean();
if (!cart) {
  cart = await Cart.create({ userId, items: [] });
}
console.log("CART USER ID:", userId);
  return NextResponse.json({
    
    success: true,
    cart: cart ?? { items: [] },
  });
}
