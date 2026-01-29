import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Order } from "@/models/Order";
import { Cart } from "@/models/Cart";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";
import crypto from "crypto";

// Verify payment and update order
export async function POST(req: Request) {
  await connectDB();

  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, message: "Missing payment details" },
        { status: 400 }
      );
    }

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      console.error("Signature mismatch:", {
        expected: expectedSignature,
        received: razorpaySignature,
      });
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Get order and update
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.user.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update order with payment details
    order.razorpayPaymentId = razorpayPaymentId;
    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    await order.save();

    // Clear user's cart
    await Cart.deleteOne({ userId });

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        order: {
          _id: order._id,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Payment verification failed",
      },
      { status: 500 }
    );
  }
}
