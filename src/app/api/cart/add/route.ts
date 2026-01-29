import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Cart } from "@/models/Cart";
import { Product } from "@/models/Product";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";
import { Types } from "mongoose";

interface CartItem {
  product: Types.ObjectId;
  quantity: number;
}


export async function POST(req: Request) {
  try {
    await connectDB();

    // 🔐 Require login
    const auth = requireAuth(req);
    if (isNextResponse(auth)) return auth;
    const { userId } = auth as { userId: string };

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // ✅ Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Get or create cart FOR THIS USER ONLY
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    // 🔁 Check if product already in cart
    const itemIndex = cart.items.findIndex(
  (item: CartItem) => item.product.toString() === productId
);


    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
