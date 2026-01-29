import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Order } from "@/models/Order";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";

// Create Razorpay order
export async function POST(req: Request) {
  await connectDB();

  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get order
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

    // Check for required environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.",
        },
        { status: 500 }
      );
    }

    // Dynamic import with error handling
    let Razorpay: any;
    try {
      const RazorpayModule = await import("razorpay");
      Razorpay = RazorpayModule.default;
    } catch (error) {
      console.error("Razorpay module not installed:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Payment gateway not configured. Please install razorpay SDK: npm install razorpay",
        },
        { status: 500 }
      );
    }

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(order.totalAmount * 100), // Convert to paise
      currency: "INR",
      receipt: order._id.toString(),
      payment_capture: 1, // Auto capture
    });

    // Update order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return NextResponse.json(
      {
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: order.totalAmount,
        orderId: order._id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create payment order",
      },
      { status: 500 }
    );
  }
}
