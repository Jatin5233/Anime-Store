import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Cart } from "@/models/Cart";
import { requireAuth } from "@/lib/requireAuth";

export async function PATCH(req: Request) {
  await connectDB();

  const auth = requireAuth(req);
  if ((auth as any)?.status === 401) return auth as NextResponse;
  const { userId } = auth as { userId: string };

  const { productId, quantity } = await req.json();

  const cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ success: false });

  const item = cart.items.find(
    (i: { product: { toString: () => string }; quantity: number }) =>
      i.product.toString() === productId
  );

  if (item) {
    item.quantity = quantity;
    await cart.save();
  }

  return NextResponse.json({ success: true });
}
