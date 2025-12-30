import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Cart } from "@/models/Cart";
import { requireAuth } from "@/lib/requireAuth";

export async function DELETE(req: Request) {
  await connectDB();

  const auth = requireAuth(req);
  if ((auth as any)?.status === 401) return auth as NextResponse;
  const { userId } = auth as { userId: string };

  const { productId } = await req.json();

  const cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ success: false });

  cart.items = cart.items.filter(
    (i: { product: { toString: () => string }; quantity: number }) =>
      i.product.toString() !== productId
  );

  await cart.save();

  return NextResponse.json({ success: true });
}
