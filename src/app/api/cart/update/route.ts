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

    const { productId, quantity } = await req.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, message: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be at least 1" },
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

    const item = cart.items.find(
      (item: CartItem) => item.product.toString() === productId
    );

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );
    }

    item.quantity = quantity;

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
