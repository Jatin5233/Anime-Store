import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Cart } from "@/models/Cart";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";
import { Types } from "mongoose";

interface CartItem {
  product: Types.ObjectId;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const auth = requireAuth(req);
    if (isNextResponse(auth)) return auth;
    const { userId } = auth as { userId: string };

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(
      (item: CartItem) => item.product.toString() !== productId
    );

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("REMOVE FROM CART ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
