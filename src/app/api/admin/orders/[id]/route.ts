import { NextResponse } from "next/server";
import { connectDB } from "@/lib/MongoDB";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { requireAuth, isNextResponse } from "@/lib/requireAuth";

// GET specific order (admin only)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  try {
    // Verify user is admin
    const user = await User.findById(userId).select("role");
    if (user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = params;

    const order = await Order.findById(id)
      .populate("items.product", "name images")
      .populate("user", "email");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Fetch order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE order status or payment status (admin only)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const auth = requireAuth(req);
  if (isNextResponse(auth)) return auth;
  const { userId } = auth as { userId: string };

  try {
    // Verify user is admin
    const user = await User.findById(userId).select("role");
    if (user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = params;
    const { orderStatus, paymentStatus } = await req.json();

    // Validate inputs
    const validOrderStatuses = ["processing", "shipped", "delivered", "cancelled"];
    const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];

    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid order status" },
        { status: 400 }
      );
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment status" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true })
      .populate("items.product", "name images")
      .populate("user", "email");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
