import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Cart } from "@/models/Cart";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";

export async function POST(req: Request) {
  await connectDB();

  // Require authenticated user
  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  const { productId, quantity = 1 } = await req.json();

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ product: productId, quantity }],
    });
  } else {
    const item = cart.items.find(
      (i: { product: { toString: () => string }; quantity: number }) =>
        i.product.toString() === productId
    );

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  return NextResponse.json({ success: true });
}
