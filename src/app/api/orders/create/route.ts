import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Order } from "@/models/Order";
import { Cart } from "@/models/Cart";
import { User } from "@/models/User";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";

export async function POST(req: Request) {
  await connectDB();

  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  try {
    const { addressId, paymentMethod } = await req.json();

    if (!addressId || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user and their address
    const user = await User.findById(userId).select("addresses");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Find address by _id or fallback index-based ID
    let address = user.addresses?.find((addr: any) => 
      addr._id?.toString() === addressId || addr._id === addressId
    );

    // If not found by ID, try by fallback ID (address-0, address-1, etc)
    if (!address) {
      const indexMatch = addressId.match(/address-(\d+)/);
      if (indexMatch) {
        const index = parseInt(indexMatch[1], 10);
        address = user.addresses?.[index];
      }
    }

    if (!address) {
      console.error(`Address not found. AddressId: ${addressId}, User addresses:`, user.addresses);
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // Get cart
    const cart = await Cart.findOne({ userId }).populate("items.product");
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate totals
    let totalAmount = 0;
    const orderItems = cart.items.map((item: any) => {
      const price = item.product.discountPrice || item.product.price;
      totalAmount += price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        priceAtPurchase: price,
      };
    });

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "processing",
      totalAmount,
    });

    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order: {
          _id: order._id,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
